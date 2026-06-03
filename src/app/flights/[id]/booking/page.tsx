'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SeatSelection from '@/components/common/seat-selection';
import { BookingService } from '@/services/booking';
import { FlightService } from '@/services/flight'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/helpers';
import { Briefcase, Loader2, Armchair } from 'lucide-react';

const checkoutSchema = z.object({
  passengerName: z.string().min(3, 'Provide legal passenger name context'),
  passportNumber: z.string().min(6, 'Valid passport context is mandatory'),
  baggageWeight: z.number().min(0, 'Weight cannot be negative'),
});

type CheckoutFields = z.infer<typeof checkoutSchema>;

export default function FlightCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params.id as string;

  const [flightPrice, setFlightPrice] = useState<number>(0);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [alreadyBookedSeats, setAlreadyBookedSeats] = useState<string[]>([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFields>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { 
      passengerName: '',
      passportNumber: '',
      baggageWeight: 0 
    }
  });

  // রিয়েল-টাইম ক্যালকুলেশনের জন্য ব্যাগেজ ওয়েট ওয়াচ করা হচ্ছে
  const watchedBaggageWeight = watch('baggageWeight') || 0;
  const extraBaggageCharge = BookingService.calculateExtraBaggage(watchedBaggageWeight);
  const totalAmount = flightPrice + extraBaggageCharge;

  useEffect(() => {
    async function initCheckoutData() {
      try {
        // ১. ফ্লাইটের প্রাইস ও ডিটেইলস ফেচ করা
        const flightData = await FlightService.getFlightById(flightId); 
        setFlightPrice(flightData?.price || 0);

        // ২. এই ফ্লাইটের অলরেডি বুকড হওয়া সিটগুলো লোড করা (সিট ব্লক করার জন্য)
        const booked = await BookingService.getBookedSeats(flightId);
        setAlreadyBookedSeats(booked || []);
      } catch (err) {
        console.error("Initialization failure:", err);
      }
    }
    initCheckoutData();
  }, [flightId]);

  const handleBookingExecution: SubmitHandler<CheckoutFields> = async (data) => {
    if (!selectedSeat) {
      setCheckoutError("Please isolate and confirm your structural seat index mapping first");
      return;
    }

    setProcessing(true);
    setCheckoutError(null);

    try {
      const mockPaymentIntentId = `pi_${Math.random().toString(36).substr(2, 9)}`;

      await BookingService.createBooking({
        flight_id: flightId,
        passenger_name: data.passengerName,
        passenger_passport: data.passportNumber,
        seat_number: selectedSeat,
        baggage_weight: data.baggageWeight,
        ticket_price: flightPrice,
        payment_intent_id: mockPaymentIntentId
      });

      router.push('/passenger/bookings?success=true');
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout pipeline crashed");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
      {/* Flight Seat Layout Selector Frame */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Select Cabin Seating</h2>
          <p className="text-xs text-slate-400">Assign physical layout position inside aircraft body framework</p>
        </div>
        {/* ডেটাবেস থেকে পাওয়া রিয়েল বুকড সিটগুলো পাস করা হচ্ছে */}
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

          <form onSubmit={handleSubmit(handleBookingExecution)} className="space-y-4">
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
              <Input className="bg-slate-950 border-slate-800 text-white" placeholder="Aminur Rahman" {...register('passengerName')} />
              {errors.passengerName && <p className="text-red-400 text-xs">{errors.passengerName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Passport Number Identity</label>
              <Input className="bg-slate-950 border-slate-800 text-white" placeholder="AXXXXXXXX" {...register('passportNumber')} />
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

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3" disabled={processing}>
              {processing ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Authorization Engine Running...
                </span>
              ) : `Pay & Finalize Booking`}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}