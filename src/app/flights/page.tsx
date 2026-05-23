'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FlightService } from '@/services/flight';
import { Flight } from '@/types';
import SearchForm from '@/components/flight/search-form';
import FlightCard from '@/components/flight/flight-card';
import { SlidersHorizontal } from 'lucide-react';

export default function FlightsSearchPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    async function loadFilteredData() {
      setLoading(true);
      try {
        const data = await FlightService.searchFlights({ origin, destination, date });
        setFlights(data);
      } catch (err) {
        console.error("Flight engine aggregation failure: ", err);
      } finally {
        setLoading(false);
      }
    }
    loadFilteredData();
  }, [searchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Available Departures</h1>
        <p className="text-slate-400 text-sm">Real-time parameters loaded for your explicit travel context</p>
      </div>

      <SearchForm onSearch={(data) => {
        const url = new URL(window.location.href);
        url.searchParams.set('origin', data.origin);
        url.searchParams.set('destination', data.destination);
        url.searchParams.set('date', data.date);
        window.history.pushState({}, '', url.toString());
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Dynamic Sidebar Filter Parameters panel shell */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-6 hidden lg:block">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-300">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Refine Search Context</span>
          </div>
          <div className="h-px bg-slate-900" />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 block">Class Category</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500">
              <option value="">All Standard Options</option>
              <option value="economy">Economy Tier</option>
              <option value="business">Business Corporate</option>
              <option value="first">First Class Luxury</option>
            </select>
          </div>
        </div>

        {/* Flight Cards Data Listing View */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-40 w-full bg-slate-900/40 border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : flights.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/20 border border-slate-900 border-dashed rounded-2xl text-slate-500 text-sm">
              No flight routes found corresponding to the exact parameters entered.
            </div>
          ) : (
            flights.map((flight) => <FlightCard key={flight.id} flight={flight} />)
          )}
        </div>
      </div>
    </div>
  );
}