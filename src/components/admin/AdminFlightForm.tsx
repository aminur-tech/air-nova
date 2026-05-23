import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FlightFormData, flightSchema } from '@/schemas/admin';


interface AdminFlightFormProps {
  onSubmit: (data: FlightFormData) => void;
  initialData?: FlightFormData;
}

export const AdminFlightForm: React.FC<AdminFlightFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: initialData || {
      flightNumber: '',
      airline: '',
      departureAirport: '',
      arrivalAirport: '',
      departureTime: '',
      arrivalTime: '',
      price: 0,
      totalSeats: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h2 className="text-xl font-semibold text-white mb-4">
        {initialData ? 'Edit Flight Schedule' : 'Create New Flight'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flight Number */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Flight Number</label>
          <input
            {...register('flightNumber')}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., BG-084"
          />
          {errors.flightNumber && <p className="mt-1 text-sm text-red-400">{errors.flightNumber.message}</p>}
        </div>

        {/* Airline */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Airline</label>
          <input
            {...register('airline')}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Biman Bangladesh"
          />
          {errors.airline && <p className="mt-1 text-sm text-red-400">{errors.airline.message}</p>}
        </div>

        {/* Departure Airport */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Departure Airport (IATA)</label>
          <input
            {...register('departureAirport')}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="DAC"
          />
          {errors.departureAirport && <p className="mt-1 text-sm text-red-400">{errors.departureAirport.message}</p>}
        </div>

        {/* Arrival Airport */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Arrival Airport (IATA)</label>
          <input
            {...register('arrivalAirport')}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="JFK"
          />
          {errors.arrivalAirport && <p className="mt-1 text-sm text-red-400">{errors.arrivalAirport.message}</p>}
        </div>

        {/* Departure Time */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Departure Date & Time</label>
          <input
            type="datetime-local"
            {...register('departureTime')}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.departureTime && <p className="mt-1 text-sm text-red-400">{errors.departureTime.message}</p>}
        </div>

        {/* Arrival Time */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Arrival Date & Time</label>
          <input
            type="datetime-local"
            {...register('arrivalTime')}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.arrivalTime && <p className="mt-1 text-sm text-red-400">{errors.arrivalTime.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Ticket Price (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>}
        </div>

        {/* Total Capacity */}
        <div>
          <label className="block text-sm font-medium text-slate-300">Total Seats Available</label>
          <input
            type="number"
            {...register('totalSeats', { valueAsNumber: true })}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.totalSeats && <p className="mt-1 text-sm text-red-400">{errors.totalSeats.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg dynamic-transition outline-none"
      >
        {isSubmitting ? 'Saving...' : 'Save Flight'}
      </button>
    </form>
  );
};