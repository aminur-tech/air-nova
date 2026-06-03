'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, Plane, Search, Loader2 } from 'lucide-react';
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
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  // DYNAMIC FORM TRANSACTION ROUTER (CREATE VS UPDATE)
  const handleFormSubmit = async (formData: AdminFlightFormData) => {
    try {
      const parsedPayload = {
        flight_number: formData.flightNumber,
        departure_time: new Date(formData.departureTime).toISOString(),
        arrival_time: new Date(formData.arrivalTime).toISOString(),
        price: Number(formData.price),
        total_seats: Number(formData.totalSeats),
        airline_name: formData.airlineName,
        origin_airport_name: formData.originAirportName,
        destination_airport_name: formData.destinationAirportName
      };

      if (editingFlight) {
        // Run Dynamic Database Patch Update
        await FlightService.updateFlight(editingFlight.id, parsedPayload);
      } else {
        // Run Structural Database Creation Record Insert
        await FlightService.createFlight({
          ...parsedPayload,
          available_seats: Number(formData.totalSeats),
          class_type: 'economy',
          baggage_allowance: '23kg',
          status: 'scheduled'
        });
      }
      
      setIsModalOpen(false);
      setEditingFlight(null);
      await loadFlights(); // Re-sync table matrix state
    } catch (err) {
      console.error(err);
      alert('Operational write pipeline exception occurred.');
    }
  };

  // DYNAMIC REMOVAL MUTATION PIPE
  const handleDeleteFlight = async (flightId: string, flightNumber: string) => {
    const localizedConfirm = window.confirm(`Are you absolutely sure you want to decommission deployment: ${flightNumber}?`);
    if (!localizedConfirm) return;

    setActionLoadingId(flightId);
    try {
      await FlightService.deleteFlight(flightId);
      // Fast optimistic client UI array splice before sync fallback
      setFlights((prev) => prev.filter((item) => item.id !== flightId));
    } catch (err) {
      console.error('Removal pipeline exception thrown:', err);
      alert('Failed to drop targeted flight allocation instance.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredFlights = flights.filter(f =>
    f.flight_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.origin?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.destination?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.airline?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* SEARCH FILTER */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter by flight tag, origin, carrier, or landing destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-white text-sm rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* DYNAMIC DATA GRID DISPLAY */}
      {loading ? (
        <div className="h-48 bg-slate-900/40 rounded-2xl animate-pulse border border-white/5 flex items-center justify-center text-slate-500 text-sm">
          Compiling live flight array matrices...
        </div>
      ) : filteredFlights.length === 0 ? (
        <div className="h-48 bg-slate-900/20 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
          <Plane className="h-8 w-8 text-slate-600 mb-2 stroke-[1.5]" />
          <p className="text-sm font-medium">No matching active flight data metrics located.</p>
        </div>
      ) : (
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-medium bg-slate-900/40 select-none">
                  <th className="p-4">Flight / Carrier</th>
                  <th className="p-4">Route Blueprint</th>
                  <th className="p-4">Timing Windows</th>
                  <th className="p-4">Value Capacity</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFlights.map((flight) => {
                  const isProcessing = actionLoadingId === flight.id;
                  return (
                    <tr key={flight.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 border border-blue-500/10 group-hover:border-blue-500/20 rounded-xl text-blue-400 transition-colors">
                            <Plane className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-white font-mono tracking-tight">{flight.flight_number}</p>
                            <p className="text-xs text-slate-500 font-medium">{flight.airline?.name || 'AeroSky Express'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{flight.origin?.code || '???'} → {flight.destination?.code || '???'}</p>
                        <p className="text-xs text-slate-500">{flight.origin?.city || 'Unknown'} to {flight.destination?.city || 'Unknown'}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            <span>{new Date(flight.departure_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 pl-4">
                            {new Date(flight.departure_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-emerald-400">{formatCurrency(flight.price)}</p>
                        <p className="text-xs text-slate-500 font-medium">{flight.available_seats ?? flight.total_seats}/{flight.total_seats} Seats Left</p>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingFlight(flight);
                              setIsModalOpen(true);
                            }}
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-blue-400 disabled:opacity-40 transition-colors"
                            title="Edit Scheduling Matrix"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFlight(flight.id, flight.flight_number)}
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 disabled:opacity-40 transition-colors"
                            title="Drop Flight Deployment"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPUP MODAL FORM ENGINE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                type="button" 
                className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-md p-1 hover:bg-white/5 transition-colors z-10 font-sans" 
                onClick={() => { setIsModalOpen(false); setEditingFlight(null); }}
              >
                ✕
              </button>

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