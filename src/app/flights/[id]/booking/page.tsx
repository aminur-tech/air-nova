'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import SeatSelection from '@/components/common/seat-selection';
import StripePaymentForm from '@/components/common/stripe-payment-form';
import { BookingService } from '@/services/booking';
import { FlightService } from '@/services/flight'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/helpers';
import { Briefcase, Loader2, Armchair, CreditCard, Wallet, CheckCircle, Ticket } from 'lucide-react';


// Load Stripe Publishable Key securely from env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const checkoutSchema = z.object({
  passengerName: z.string().min(3, 'Provide legal passenger name context'),
  passportNumber: z.string().min(6, 'Valid passport context is mandatory'),
  baggageWeight: z.number().min(0, 'Weight cannot be negative'),
});

type CheckoutFields = z.infer<typeof checkoutSchema>;

interface BookingReceipt extends CheckoutFields {
  seat: string;
  paymentId: string;
  total: number;
  baggageCharge: number;
}

export default function FlightCheckoutPage() {
  const params = useParams();
  const flightId = params.id as string;

  const [flightPrice, setFlightPrice] = useState<number>(0);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [alreadyBookedSeats, setAlreadyBookedSeats] = useState<string[]>([]);
  
  // Payment Options Workflow States
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'wallet' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFields | null>(null);
  
  // Successful transaction output object state
  const [successReceipt, setSuccessReceipt] = useState<BookingReceipt | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFields>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { passengerName: '', passportNumber: '', baggageWeight: 0 }
  });

  const watchedBaggageWeight = watch('baggageWeight') || 0;
  const extraBaggageCharge = BookingService.calculateExtraBaggage(watchedBaggageWeight);
  const totalAmount = flightPrice + extraBaggageCharge;

  // Stabilize the options object to prevent Elements from remounting
  // when parent state (like processing or baggage) changes.
  const stripeOptions = useMemo(() => ({
    clientSecret: clientSecret || undefined,
    appearance: { theme: 'night' as const },
  }), [clientSecret]);

  useEffect(() => {
    async function initCheckoutData() {
      try {
        const flightData = await FlightService.getFlightById(flightId); 
        setFlightPrice(flightData?.price || 0);
        const booked = await BookingService.getBookedSeats(flightId);
        setAlreadyBookedSeats(booked || []);
      } catch (err) {
        console.error("Initialization failure:", err);
      }
    }
    initCheckoutData();
  }, [flightId]);

  // First step: Manifest verification & unlocking options
  const handleInitiatePayment: SubmitHandler<CheckoutFields> = async (data) => {
    if (!selectedSeat) {
      setCheckoutError("Please isolate and confirm your structural seat index mapping first");
      return;
    }
    setProcessing(true);
    setCheckoutError(null);
    setFormData(data);

    try {
      // Fetch backend payment intent mapping
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}. Ensure the API route exists.`);
      }

      const intentData = await res.json();
      
      if (intentData.error) throw new Error(intentData.error);
      
      setClientSecret(intentData.clientSecret);
      setShowPaymentOptions(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initialize standard checkout channels";
      setCheckoutError(message);
    } finally {
      setProcessing(false);
    }
  };

  // Execution flow triggered when stripe answers true
  const handleFinalBookingInsertion = async (paymentIntentId: string) => {
    if (!formData || !selectedSeat) return;
    setProcessing(true);

    try {
      await BookingService.createBooking({
        flight_id: flightId,
        passenger_name: formData.passengerName,
        passenger_passport: formData.passportNumber,
        seat_number: selectedSeat,
        baggage_weight: formData.baggageWeight,
        ticket_price: flightPrice,
        payment_intent_id: paymentIntentId
      });

      // Show immediate localized operational digital receipt screen
      setSuccessReceipt({
        ...formData,
        seat: selectedSeat,
        paymentId: paymentIntentId,
        total: totalAmount,
        baggageCharge: extraBaggageCharge
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Database allocation error upon verified clearance";
      setCheckoutError(message);
    } finally {
      setProcessing(false);
    }
  };

  // Render receipt layout if booking succeeded
  if (successReceipt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-white space-y-8">
        <div className="text-center space-y-2">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black uppercase tracking-wider">Booking Authorized & Confirmed</h2>
          <p className="text-xs text-slate-400">Electronic Manifest Ticket Token issued to internal databases</p>
        </div>

        {/* PHYSICAL BOARDING TICKET DISPLAY SLIP */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span className="font-mono text-sm font-bold tracking-widest">BOARDING PASS</span>
            </div>
            <span className="text-xs font-mono bg-blue-800 px-3 py-1 rounded-full text-blue-200">SYSTEM CLEAR</span>
          </div>

          <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm font-mono border-b border-dashed border-slate-800 relative">
            {/* Ticket Tear Notches */}
            <div className="w-4 h-8 bg-slate-900 rounded-r-full absolute left-0 top-1/2 -translate-y-1/2 border-r border-slate-800" />
            <div className="w-4 h-8 bg-slate-900 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2 border-l border-slate-800" />

            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight">Passenger Legal Name</p>
              <p className="text-base text-white font-bold">{successReceipt.passengerName}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight">Passport Manifest ID</p>
              <p className="text-base text-white font-bold">{successReceipt.passportNumber}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight">Assigned Cabin Seat</p>
              <p className="text-emerald-400 font-black text-lg">{successReceipt.seat}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-tight">Baggage Declaration</p>
              <p className="text-white font-bold">{successReceipt.baggageWeight} KG Checked</p>
            </div>
          </div>

          {/* FINANCIAL ACCOUNTABILITY STATEMENT SLIP */}
          <div className="p-6 bg-slate-900/50 space-y-3 font-sans">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment Accounts Auditing Ledger</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between"><span>Base Flight Unit Rate:</span><span className="text-white font-mono">{formatCurrency(flightPrice)}</span></div>
              <div className="flex justify-between"><span>Excess Load Fee:</span><span className="text-white font-mono">{formatCurrency(successReceipt.baggageCharge)}</span></div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm text-white">
                <span>Total Settled Cleared:</span>
                <span className="text-emerald-400 font-mono">{formatCurrency(successReceipt.total)}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 break-all text-center">
              TRANSACTION CAPTURE ID: {successReceipt.paymentId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
      {/* Flight Seat Layout Selector Frame */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Select Cabin Seating</h2>
          <p className="text-xs text-slate-400">Assign physical layout position inside aircraft body framework</p>
        </div>
        <SeatSelection bookedSeats={alreadyBookedSeats} onSelectSeat={(seat) => setSelectedSeat(seat)} />
      </div>

      {/* Manifest Declaration and Profile Form */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Passenger Manifest Identity</h2>
          <p className="text-xs text-slate-400">Provide legal identification details matching passport metadata records</p>
        </div>

        <Card className="p-6 bg-slate-900 border-slate-800 space-y-4">
          {checkoutError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
              {checkoutError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleInitiatePayment)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Armchair className="w-3.5 h-3.5" /> Selected Allocation
              </label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-blue-400">
                {selectedSeat ? `Seat Position Found: ${selectedSeat}` : "No position initialized yet"}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Passenger Name</label>
              <Input className="bg-slate-950 border-slate-800 text-white" placeholder="Aminur Rahman" {...register('passengerName')} disabled={showPaymentOptions} />
              {errors.passengerName && <p className="text-red-400 text-xs">{errors.passengerName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Passport Number Identity</label>
              <Input className="bg-slate-950 border-slate-800 text-white" placeholder="AXXXXXXXX" {...register('passportNumber')} disabled={showPaymentOptions} />
              {errors.passportNumber && <p className="text-red-400 text-xs">{errors.passportNumber.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Baggage Weight (KG)
              </label>
              <Input 
                type="number" 
                className="bg-slate-950 border-slate-800 text-white" 
                placeholder="23" 
                {...register('baggageWeight', { valueAsNumber: true })} 
                disabled={showPaymentOptions}
              />
              <p className="text-[11px] text-slate-500">First 23 KG is free. Excess baggage weight is charged at $15/KG.</p>
            </div>

            {/* LIVE BILLING BREAKDOWN */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-sm font-sans">
              <div className="flex justify-between text-slate-400">
                <span>Base Ticket Price:</span>
                <span>{formatCurrency(flightPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Excess Baggage Cost:</span>
                <span className={extraBaggageCharge > 0 ? "text-amber-400 font-medium" : ""}>
                  {formatCurrency(extraBaggageCharge)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-white pt-2 border-t border-dashed border-slate-800">
                <span>Total Amount Due:</span>
                <span className="text-emerald-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {!showPaymentOptions && (
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3" disabled={processing}>
                {processing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" /> Fetching Payment Rules...
                  </span>
                ) : `Pay & Finalize Booking`}
              </Button>
            )}
          </form>

          {/* DYNAMIC PAYMENT METHOD GATEWAYS */}
          {showPaymentOptions && clientSecret && (
            <div className="pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-300">Select Desired Clearing Option</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setSelectedMethod('stripe')}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${selectedMethod === 'stripe' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-semibold">Stripe / Card</span>
                </button>
                <button 
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition ${selectedMethod === 'wallet' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}>
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs font-semibold">System Wallet</span>
                </button>
              </div>

              {selectedMethod === 'stripe' && (
                <div className="pt-2 animate-fadeIn">
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripePaymentForm onSuccess={handleFinalBookingInsertion} />
                  </Elements>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
                  <p className="text-xs text-slate-400">Pay using your system pre-funded wallet credits.</p>
                  <Button onClick={() => handleFinalBookingInsertion(`wallet_${Math.random().toString(36).substr(2, 9)}`)} className="w-full bg-blue-600 hover:bg-blue-500 text-xs">
                    Confirm Wallet Deduction
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}