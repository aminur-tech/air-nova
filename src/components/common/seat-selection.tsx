'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/helpers';

interface SeatMapProps {
  bookedSeats: string[];
  onSelectSeat: (seat: string) => void;
}

export default function SeatSelection({ bookedSeats, onSelectSeat }: SeatMapProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const totalRows = 12;

  const handleSeatClick = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeat(seat);
    onSelectSeat(seat);
  };

  return (
    <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center">
      <div className="w-full h-4 bg-slate-800 rounded-b-full mb-12 flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        Front of Aircraft / Cockpit
      </div>

      <div className="grid gap-3">
        {Array.from({ length: totalRows }).map((_, rowIndex) => {
          const rowNum = rowIndex + 1;
          return (
            <div key={rowNum} className="flex items-center gap-2">
              <span className="w-5 text-xs text-slate-600 font-bold text-center">{rowNum}</span>
              {rows.map((letter, index) => {
                const seatId = `${rowNum}${letter}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeat === seatId;

                return (
                  <React.Fragment key={letter}>
                    <button
                      type="button"
                      disabled={isBooked}
                      onClick={() => handleSeatClick(seatId)}
                      className={cn(
                        "w-8 h-8 rounded-md text-xs font-semibold flex items-center justify-center border transition-all duration-200",
                        isBooked && "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed",
                        isSelected && "bg-blue-600 border-blue-400 text-white ring-2 ring-blue-400/50 scale-105",
                        !isBooked && !isSelected && "bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-slate-800"
                      )}
                    >
                      {letter}
                    </button>
                    {index === 2 && <div className="w-8" />} {/* Aisle layout spacer */}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}