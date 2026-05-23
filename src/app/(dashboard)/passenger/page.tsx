'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookingService } from '@/services/booking';
import { Booking } from '@/types';
import { Plane, Calendar, Armchair, QrCode } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/Sidebar';

export default function PassengerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const data = await BookingService.getPassengerBookings();
        setBookings(data || []);
      } catch (err) {
        console.error('Failed to resolve itineraries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      <DashboardSidebar role="passenger" />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            My Flight Itineraries
          </h1>
          <p className="text-slate-400 text-sm">Review electronic boarding assignments and flight tracking timelines.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-40 bg-slate-900/40 border border-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-slate-900/20 border border-dashed border-white/10 rounded-2xl text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-slate-900 border border-white/10 text-slate-400">
              <Plane className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No flights booked yet</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">Ready to explore? Find a new destination and complete your boarding assignment today.</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/10 transition-colors flex flex-col md:flex-row items-stretch"
              >
                {/* Boarding Summary Segment */}
                <div className="flex-1 p-6 space-y-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-blue-600/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase">
                        {booking.flight?.flight_number || 'AS-747'}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 capitalize">
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>{new Date(booking.flight?.departure_time).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{booking.flight?.origin?.code || 'DAC'}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{booking.flight?.origin?.city || 'Dhaka'}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center px-4 relative">
                      <div className="w-full h-px border-t border-dashed border-slate-700 absolute top-1/2 -translate-y-1/2" />
                      <Plane className="h-5 w-5 text-blue-400 bg-slate-950 px-1 z-10 rotate-90 md:rotate-0" />
                    </div>

                    <div className="text-right">
                      <h2 className="text-2xl font-bold text-white">{booking.flight?.destination?.code || 'JFK'}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{booking.flight?.destination?.city || 'New York'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Armchair className="h-4 w-4 text-slate-500" />
                      <span>Seat <strong className="text-white font-mono">{booking.seat_number}</strong></span>
                    </div>
                    <div className="text-slate-500">|</div>
                    <div>Passenger: <strong className="text-white font-medium">{booking.passenger_name}</strong></div>
                  </div>
                </div>

                {/* Digital Boarding Ticket Stub */}
                <div className="md:w-48 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent border-t md:border-t-0 md:border-l border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-xl shadow-lg">
                    <QrCode className="h-24 w-24 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Digital Pass ID</span>
                    <span className="text-xs font-mono text-slate-500 truncate max-w-[140px] block">{booking.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}