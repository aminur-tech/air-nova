'use client';

import { Flight } from '@/types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plane, Armchair, Briefcase } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import Link from 'next/link';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <Card className="p-6 hover:border-slate-800 transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Route Details */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <span className="text-sm font-bold text-blue-400">{flight.airline?.name || 'AeroSky Carrier'}</span>
            <span className="text-xs font-mono text-slate-500">{flight.flight_number}</span>
          </div>

          <div className="flex items-center justify-between max-w-md gap-4">
            <div>
              <h3 className="text-2xl font-bold">{flight.origin?.code}</h3>
              <p className="text-xs text-slate-400">{flight.origin?.city}</p>
              <span className="text-xs font-medium text-slate-500 mt-1 block">
                {new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center px-4 relative">
              <span className="text-[10px] text-slate-600 uppercase tracking-widest font-mono mb-1">Non-Stop</span>
              <div className="w-full h-px border-t border-dashed border-slate-800 absolute top-1/2 -translate-y-1/2" />
              <Plane className="h-4 w-4 text-slate-600 bg-slate-950 px-0.5 z-10" />
            </div>

            <div className="text-right">
              <h3 className="text-2xl font-bold">{flight.destination?.code}</h3>
              <p className="text-xs text-slate-400">{flight.destination?.city}</p>
              <span className="text-xs font-medium text-slate-500 mt-1 block">
                {new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Class & Structural Metadata */}
        <div className="flex flex-wrap lg:flex-col gap-4 text-xs text-slate-400 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-900 justify-between lg:justify-center">
          <div className="flex items-center gap-1.5">
            <Armchair className="h-4 w-4 text-slate-600" />
            <span className="capitalize">{flight.class_type} Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-slate-600" />
            <span>{flight.baggage_allowance} Included</span>
          </div>
        </div>

        {/* Checkout CTA block */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end w-full lg:w-auto border-t lg:border-t-0 border-slate-900 pt-4 lg:pt-0">
          <div className="lg:text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Per Passenger</span>
            <span className="text-2xl font-extrabold text-white">{formatCurrency(flight.price)}</span>
          </div>
          <Link href={`/flights/${flight.id}/booking`} className="mt-2 block w-full sm:w-auto">
            <Button size="sm">Select Seat</Button>
          </Link>
        </div>

      </div>
    </Card>
  );
}