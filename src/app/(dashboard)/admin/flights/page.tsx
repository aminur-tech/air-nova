'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, Plane, Search } from 'lucide-react';
import { FlightService } from '@/services/flight';

import { Flight } from '@/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/helpers';
import { AdminFlightForm, AdminFlightFormData, Airline, Airport } from '@/components/admin/AdminFlightForm';


export default function AdminFlightsPage() {
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);


  useEffect(() => {
    loadFlights();
  }, []);

  async function loadFlights() {
    setLoading(true);
    try {
      const flightsData = await FlightService.getFlight();
      setFlights(flightsData || []);
      const airportsData = await FlightService.getAirports();
      const airlinesData = await FlightService.getAirlines();
      setAirports(airportsData || []);
      setAirlines(airlinesData || []);
    } catch (err) {
      console.error('Failed to resolve system flights matrix:', err);
    } finally {
      setLoading(false);
    }
  }

  // ইনপুট ফিল্ড থেকে আসা এয়ারলাইন এবং এয়ারপোর্ট এর নাম সরাসরি Supabase রাইট পাইপলাইনে পাঠানো হচ্ছে
  const handleFormSubmit = async (formData: AdminFlightFormData) => {
    try {
      if (editingFlight) {
        console.log('Updating schedule instance:', editingFlight.id, formData);
      } else {
        await FlightService.createFlight({
          flight_number: formData.flightNumber,
          departure_time: new Date(formData.departureTime).toISOString(),
          arrival_time: new Date(formData.arrivalTime).toISOString(),
          price: formData.price,
          total_seats: formData.totalSeats,
          available_seats: formData.totalSeats,
          class_type: 'economy',
          baggage_allowance: '23kg',
          status: 'scheduled',
          airline_name: formData.airlineName,
          origin_airport_name: formData.originAirportName,
          destination_airport_name: formData.destinationAirportName
        });
      }
      setIsModalOpen(false);
      setEditingFlight(null);
      loadFlights();
    } catch (err) {
      console.error(err);
      alert('Operational write pipeline exception occurred.');
    }
  };

  const filteredFlights = flights.filter(f =>
    f.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.origin?.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.destination?.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Flight Deployments</h1>
          <p className="text-slate-400 text-sm">Schedule, modify, and monitor active commercial aircraft lines.</p>
        </div>
        <Button
          onClick={() => { setEditingFlight(null); setIsModalOpen(true); }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Flight
        </Button>
      </div>

      {/* সার্চ ফিল্টার */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter by flight tag, origin, or landing destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-white text-sm rounded-xl focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* টেবিল লিস্ট */}
      {loading ? (
        <div className="h-48 bg-slate-900/40 rounded-2xl animate-pulse border border-white/5" />
      ) : (
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-medium bg-slate-900/40">
                  <th className="p-4">Flight / Carrier</th>
                  <th className="p-4">Route Blueprint</th>
                  <th className="p-4">Timing Windows</th>
                  <th className="p-4">Value Capacity</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFlights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                          <Plane className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white font-mono">{flight.flight_number}</p>
                          <p className="text-xs text-slate-500">{flight.airline?.name || 'AeroSky Express'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-white">{flight.origin?.code} → {flight.destination?.code}</p>
                      <p className="text-xs text-slate-500">{flight.origin?.city} to {flight.destination?.city}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>{new Date(flight.departure_time).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-white">{formatCurrency(flight.price)}</p>
                      <p className="text-xs text-slate-500">{flight.available_seats}/{flight.total_seats} Seats Avail</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingFlight(flight);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* পপআপ মডাল ফর্ম */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer" onClick={() => setIsModalOpen(false)}>✕</div>

              <AdminFlightForm
                airports={airports}
                airlines={airlines}
                onSubmit={handleFormSubmit}
                initialData={editingFlight ? {
                  flightNumber: editingFlight.flight_number,
                  airlineName: editingFlight.airline?.name || '',
                  originAirportName: editingFlight.origin?.name || '',
                  destinationAirportName: editingFlight.destination?.name || '',
                  departureTime: editingFlight.departure_time.slice(0, 16),
                  arrivalTime: editingFlight.arrival_time.slice(0, 16),
                  price: editingFlight.price,
                  totalSeats: editingFlight.total_seats,
                } : undefined}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}