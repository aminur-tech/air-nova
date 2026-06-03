'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookingService } from '@/services/booking';
import { Plane, Calendar, Armchair, QrCode, Download, FileText, CheckCircle2 } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import { formatCurrency } from '@/utils/helpers';

interface FlightInfo {
  flight_number?: string;
  departure_time?: string;
  origin?: { code: string; city: string };
  destination?: { code: string; city: string };
  price?: number;
}

interface BookingRecord {
  id: string;
  booking_status?: string;
  status?: string;
  flight?: FlightInfo;
  seat_number: string;
  passenger_name: string;
  passenger_passport?: string;
  payment_intent_id?: string;
  created_at?: string;
  ticket_price?: number;
  extra_baggage_charge?: number;
  baggage_weight?: number;
  total_amount?: number;
}

export default function PassengerDashboardPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  // HTML থেকে PDF ডাউনলোড করার ডায়নামিক ইঞ্জিন ফাংশন
  const handlePdfGeneration = async (elementId: string, filename: string) => {
    setDownloadingId(elementId);
    const element = document.getElementById(elementId);
    if (!element) return;

    // টেম্পোরারি প্রিন্ট ভিউ অপ্টিমাইজেশন (লুকানো ডম এলিমেন্টকে প্রিন্টের সময় ভিজিবল করা)
    element.classList.remove('hidden');
    
    const html2pdf = (await import('html2pdf.js')).default;
    const options = {
      margin: 0.5,
      filename: `${filename}.pdf`,
      image: { type: 'png' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#020617' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF generation aborted:", error);
    } finally {
      element.classList.add('hidden');
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      <DashboardSidebar role="passenger" />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            My Flight Itineraries
          </h1>
          <p className="text-slate-400 text-sm">Review electronic boarding assignments and download your compliance documents.</p>
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
            {bookings.map((booking, idx) => {
              const isConfirmed = booking.booking_status === 'confirmed' || booking.status === 'confirmed';
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/10 transition-colors flex flex-col"
                >
                  {/* MAIN CONTAINER */}
                  <div className="flex flex-col md:flex-row items-stretch">
                    {/* Boarding Summary Segment */}
                    <div className="flex-1 p-6 space-y-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-blue-600/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase">
                            {booking.flight?.flight_number || 'AS-747'}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 capitalize text-emerald-400`}>
                            {booking.booking_status || booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span>{new Date(booking.flight?.departure_time || new Date().toISOString()).toLocaleDateString()}</span>
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
                    <div className="md:w-48 bg-linear-to-br from-blue-600/10 via-indigo-600/5 to-transparent border-t md:border-t-0 md:border-l border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 bg-white rounded-xl shadow-lg">
                        <QrCode className="h-24 w-24 text-slate-950" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Digital Pass ID</span>
                        <span className="text-xs font-mono text-slate-500 truncate max-w-35 block">{booking.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION FOOTER BAR - DOWNLOAD CONTROLS */}
                  {isConfirmed && (
                    <div className="bg-slate-950/60 px-6 py-3 border-t border-white/5 flex flex-wrap gap-3 items-center justify-end">
                      <button
                        onClick={() => handlePdfGeneration(`ticket-${booking.id}`, `E-Ticket-${booking.id.slice(0,8)}`)}
                        disabled={downloadingId !== null}
                        className="text-xs flex items-center gap-1.5 bg-slate-900 border border-white/10 hover:border-blue-500/30 text-slate-300 px-3 py-2 rounded-xl transition duration-200"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-400" />
                        {downloadingId === `ticket-${booking.id}` ? 'Generating Ticket...' : 'Download E-Ticket'}
                      </button>

                      <button
                        onClick={() => handlePdfGeneration(`invoice-${booking.id}`, `Invoice-${booking.id.slice(0,8)}`)}
                        disabled={downloadingId !== null}
                        className="text-xs flex items-center gap-1.5 bg-slate-900 border border-white/10 hover:border-emerald-500/30 text-slate-300 px-3 py-2 rounded-xl transition duration-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        {downloadingId === `invoice-${booking.id}` ? 'Generating Invoice...' : 'Download Invoice'}
                      </button>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* HIDDEN PRINT-READY DOM TEMPLATES (Only Rendered Inside Generated PDF)     */}
                  {/* ========================================================================= */}

                  {/* A. E-TICKET PRINTER DOM */}
                  <div id={`ticket-${booking.id}`} className="hidden p-8 bg-slate-950 text-white font-sans max-w-2xl border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <div>
                        <h1 className="text-2xl font-black tracking-wider text-blue-400">AEROSKY CARRIER</h1>
                        <p className="text-xs text-slate-400 font-mono">OFFICIAL ELECTRONIC PASSENGER BOARDING PASS</p>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 my-6 text-sm">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Passenger Legal Name</span>
                        <span className="font-bold text-base text-white">{booking.passenger_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Passport Context Number</span>
                        <span className="font-mono text-white">{booking.passenger_passport || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Flight Number Mapping</span>
                        <span className="font-mono text-blue-400 font-bold">{booking.flight?.flight_number || 'AS-747'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">Assigned Seat Index</span>
                        <span className="font-mono text-emerald-400 font-bold text-base">{booking.seat_number}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl flex items-center justify-between border border-slate-800 font-mono">
                      <div>
                        <p className="text-xs text-slate-500">FROM: <span className="text-white font-bold">{booking.flight?.origin?.code}</span></p>
                        <p className="text-[10px] text-slate-400">{booking.flight?.origin?.city}</p>
                      </div>
                      <Plane className="w-4 h-4 text-slate-600 rotate-90" />
                      <div className="text-right">
                        <p className="text-xs text-slate-500">TO: <span className="text-white font-bold">{booking.flight?.destination?.code}</span></p>
                        <p className="text-[10px] text-slate-400">{booking.flight?.destination?.city}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-600 text-center mt-8 border-t border-slate-900 pt-4">
                      Generated at {new Date().toLocaleString()} • Security Clearance ID: {booking.id}
                    </div>
                  </div>

                  {/* B. OFFICIAL PAYMENT RECEIPT/INVOICE PRINTER DOM */}
                  <div id={`invoice-${booking.id}`} className="hidden p-8 bg-slate-950 text-white font-sans max-w-2xl border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                      <div>
                        <h1 className="text-xl font-black text-emerald-400">AEROSKY BILLING LEDGER</h1>
                        <p className="text-xs text-slate-500 font-mono">Payment Intent Identifier: {booking.payment_intent_id || 'N/A'}</p>
                      </div>
                      <div className="text-right text-xs font-mono text-slate-400">
                        <p>Invoice Date: {new Date(booking.created_at || new Date().getTime()).toLocaleDateString()}</p>
                        <p className="text-emerald-400 font-bold">STATUS: PAID</p>
                      </div>
                    </div>
                    <div className="my-6 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Transaction Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-400">
                          <span>Base Seat Tariff ({booking.flight?.flight_number}):</span>
                          <span className="text-white font-mono">{formatCurrency(booking.ticket_price || booking.flight?.price || 0)}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-400">
                          <span>Excess Baggage Premium ({booking.baggage_weight || 0} KG declared):</span>
                          <span className="text-white font-mono">{formatCurrency(booking.extra_baggage_charge || 0)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-white pt-2">
                          <span>Total Capital Settled via Stripe:</span>
                          <span className="text-emerald-400 font-mono">{formatCurrency(booking.total_amount || booking.flight?.price || 0)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-600 text-center mt-12">
                      Thank you for choosing AeroSky. This system-generated document serves as a lawful financial transaction clearance record.
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}