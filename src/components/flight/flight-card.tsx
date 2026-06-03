'use client';

import { Flight } from '@/types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plane, Armchair, Briefcase, Users, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import Link from 'next/link';

interface FlightCardProps {
  flight: Flight & {
    airline_name?: string;
    origin_airport_name?: string;
    destination_airport_name?: string;
  };
}

export default function FlightCard({ flight }: FlightCardProps) {
  // Calculate dynamic hour/minute duration windows on the fly
  const durationInMinutes = Math.round(
    (new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / 60000
  );
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  // Determine availability status context
  const isSoldOut = flight.available_seats <= 0;

  return (
    <Card className="p-6 hover:border-slate-800 bg-slate-950/40 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Route Details */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between lg:justify-start gap-4">
            {/* Dynamic Carrier Name Lookup Protection */}
            <span className="text-sm font-bold text-blue-400">
              {flight.airline?.name || flight.airline_name || 'AeroSky Carrier'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-slate-400">
                {flight.flight_number}
              </span>
              {/* Departure Date Stamp Label */}
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(flight.departure_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between max-w-md gap-4">
            {/* Origin Airport Block */}
            <div className="min-w-[80px]">
              <h3 className="text-2xl font-black tracking-tight">{flight.origin?.code || 'ORI'}</h3>
              <p className="text-xs text-slate-400 truncate max-w-[120px]">
                {flight.origin?.city || flight.origin_airport_name || 'Unknown Airport'}
              </p>
              <span className="text-sm font-semibold text-white mt-1 block">
                {new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Path Graphic Overlay Line */}
            <div className="flex-1 flex flex-col items-center px-2 relative min-w-[100px]">
              <span className="text-[10px] text-slate-500 font-medium mb-1 whitespace-nowrap">
                {hours > 0 ? `${hours}h ` : ''}{minutes}m
              </span>
              <div className="w-full h-px border-t border-dashed border-slate-800 absolute top-1/2 -translate-y-1/2" />
              <Plane className="h-4 w-4 text-slate-500 bg-slate-950 px-0.5 z-10 rotate-45 lg:rotate-90" />
              <span className="text-[9px] text-slate-600 font-mono tracking-wider mt-1 uppercase">Non-Stop</span>
            </div>

            {/* Destination Airport Block */}
            <div className="text-right min-w-[80px]">
              <h3 className="text-2xl font-black tracking-tight">{flight.destination?.code || 'DES'}</h3>
              <p className="text-xs text-slate-400 truncate max-w-[120px]">
                {flight.destination?.city || flight.destination_airport_name || 'Unknown Airport'}
              </p>
              <span className="text-sm font-semibold text-white mt-1 block">
                {new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Class & Structural Metadata */}
        <div className="flex flex-wrap lg:flex-col gap-3 text-xs text-slate-400 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-900/60 justify-between lg:justify-center">
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <Armchair className="h-4 w-4 text-blue-500/70" />
            <span className="capitalize">{flight.class_type || 'Economy'} Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-slate-600" />
            <span>{flight.baggage_allowance || '23kg'} Bags</span>
          </div>
          {/* Realtime Seat Counter Capacity Badge */}
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-600" />
            <span className={flight.available_seats <= 5 ? 'text-amber-500 font-semibold' : ''}>
              {isSoldOut ? 'Sold Out' : `${flight.available_seats}/${flight.total_seats} Seats Left`}
            </span>
          </div>
        </div>

        {/* Checkout CTA block */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 border-slate-900/60 pt-4 lg:pt-0 gap-2">
          <div className="lg:text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Per Passenger</span>
            <span className="text-2xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(flight.price)}
            </span>
          </div>
          <Link 
            href={isSoldOut ? '#' : `/flights/${flight.id}/booking`} 
            className={`block w-full sm:w-auto ${isSoldOut ? 'pointer-events-none' : ''}`}
          >
            <Button 
              size="sm" 
              disabled={isSoldOut}
              className={`w-full sm:w-auto font-semibold ${isSoldOut ? 'bg-slate-900 text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            >
              {isSoldOut ? 'Full' : 'Select Seat'}
            </Button>
          </Link>
        </div>

      </div>
    </Card>
  );
}