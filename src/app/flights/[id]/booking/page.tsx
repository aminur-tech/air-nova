'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SeatSelection from '@/components/common/seat-selection';
import { BookingService } from '@/services/booking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const checkoutSchema = z.object({
  passengerName: z.string().min(3, 'Provide legal passenger name context'),
  passportNumber: z.string().min(6, 'Valid passport context is mandatory'),
});

type CheckoutFields = z.infer<typeof checkoutSchema>;

export default function FlightCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params.id as string;

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFields>({
    resolver: zodResolver(checkoutSchema)
  });

  const handleBookingExecution = async (data: CheckoutFields) => {
    if (!selectedSeat) {
      setCheckoutError("Please isolate and confirm your structural seat index mapping first");
      return;
    }

    setProcessing(true);
    setCheckoutError(null);

    try {
      await BookingService.createBooking({
        flight_id: flightId,
        passenger_name: data.passengerName,
        passenger_passport: data.passportNumber,
        seat_number: selectedSeat
      });
      router.push('/passenger');
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout pipeline crashed during execution runtime");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Flight Seat Layout Selector Frame */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Select Cabin Seating</h2>
          <p className="text-xs text-slate-500">Assign physical layout position inside aircraft body framework</p>
        </div>
        <SeatSelection bookedSeats={['1A', '2C', '4F']} onSelectSeat={(seat) => setSelectedSeat(seat)} />
      </div>

      {/* Manifest Declaration and Profile Form */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Passenger Manifest Identity</h2>
          <p className="text-xs text-slate-500">Provide legal identification details matching passport metadata records</p>
        </div>

        <Card className="p-6 space-y-4">
          {checkoutError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
              {checkoutError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleBookingExecution)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Selected Allocation</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-blue-400">
                {selectedSeat ? `Seat Position Found: ${selectedSeat}` : "No position initialized yet"}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Full Passenger Name</label>
              <Input placeholder="Aminur Rahman" error={errors.passengerName?.message} {...register('passengerName')} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Passport Number Identity</label>
              <Input placeholder="AXXXXXXXX" error={errors.passportNumber?.message} {...register('passportNumber')} />
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Processing Ledger Injection..." : "Finalize Booking Allocation"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}