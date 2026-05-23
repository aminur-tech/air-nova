'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingService } from '@/services/booking';
import { Ticket, Search, ShieldCheck } from 'lucide-react';
import { Booking } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/helpers';
import { BookingStatusFormData } from '@/schemas/admin';
import { AdminBookingForm } from '@/components/admin/AdminBookingForm';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeAdminBooking, setActiveAdminBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadAllSystemBookings();
  }, []);

  async function loadAllSystemBookings() {
    setLoading(true);
    try {
      const data = await BookingService.getPassengerBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load global booking system array:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateBooking = async (data: BookingStatusFormData) => {
    if (!activeAdminBooking) return;

    try {
      console.log('Triggering structural state modification to ledger reservation:', activeAdminBooking.id, data);
      // In production, execute a patch service call through your BookingService here
      setActiveAdminBooking(null);
      loadAllSystemBookings();
    } catch (err) {
      alert('Ledger operational update mutation failed.');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.passenger_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.flight?.flight_number.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Passenger Document Manifests</h1>
        <p className="text-slate-400 text-sm">Review, audit, modify, or terminate passenger boarding passes globally.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <input 
          type="text"
          placeholder="Search by passenger legal name or target flight route code..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-white text-sm rounded-xl focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Bookings Table List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-40 bg-slate-900/40 rounded-2xl animate-pulse border border-white/5" />
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.id}
                  onClick={() => setActiveAdminBooking(booking)}
                  className={cn(
                    "p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all",
                    activeAdminBooking?.id === booking.id && "border-blue-500/50 bg-blue-600/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{booking.passenger_name}</h4>
                      <p className="text-xs text-slate-500">Flight Ref: <span className="font-mono text-slate-400 font-medium">{booking.flight?.flight_number || 'AS-102'}</span> | Seat: {booking.seat_number}</p>
                    </div>
                  </div>
                  
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-semibold border capitalize",
                    booking.status === 'confirmed' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    booking.status === 'pending' && "bg-amber-500/10 border-amber-500/20 text-amber-400",
                    booking.status === 'cancelled' && "bg-red-500/10 border-red-500/20 text-red-400"
                  )}>
                    {booking.status}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Contextual Action Editor Panel */}
        <div className="lg:col-span-1">
          {activeAdminBooking ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AdminBookingForm 
                bookingId={activeAdminBooking.id}
                passengerName={activeAdminBooking.passenger_name}
                currentStatus={activeAdminBooking.status}
                initialSeat={activeAdminBooking.seat_number}
                onUpdate={handleUpdateBooking}
              />
            </motion.div>
          ) : (
            <div className="p-6 text-center bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs flex flex-col items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
              <span>Select an active user pass reference from the list to modify details or view credentials.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}