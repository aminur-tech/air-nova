'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';

// Zod schema with strict validation
const AdminFlightFormSchema = z
  .object({
    flightNumber: z
      .string()
      .min(1, 'Flight number is required')
      .min(3, 'Flight number must be at least 3 characters')
      .max(20, 'Flight number must not exceed 20 characters')
      .regex(/^[A-Z0-9-]+$/, 'Flight number can only contain uppercase letters, numbers, and hyphens'),
    
    airlineName: z
      .string()
      .min(1, 'Airline name is required')
      .min(2, 'Airline name must be at least 2 characters')
      .max(100, 'Airline name must not exceed 100 characters'),
    
    originAirportName: z
      .string()
      .min(1, 'Departure airport name is required')
      .min(2, 'Departure airport name must be at least 2 characters')
      .max(100, 'Departure airport name must not exceed 100 characters'),
    
    destinationAirportName: z
      .string()
      .min(1, 'Arrival airport name is required')
      .min(2, 'Arrival airport name must be at least 2 characters')
      .max(100, 'Arrival airport name must not exceed 100 characters'),
    
    departureTime: z
      .string()
      .min(1, 'Departure time is required')
      .refine(
        (time) => {
          const depTime = new Date(time);
          return depTime > new Date();
        },
        'Departure time must be in the future'
      ),
    
    arrivalTime: z
      .string()
      .min(1, 'Arrival time is required'),
    
    price: z
      .number()
      .min(0, 'Price cannot be negative')
      .max(999999, 'Price exceeds maximum limit')
      .positive('Price must be greater than 0'),
    
    totalSeats: z
      .number()
      .int('Total seats must be a whole number')
      .min(1, 'Total seats must be at least 1')
      .max(1000, 'Total seats cannot exceed 1000'),
  })
  .refine(
    (data) => data.originAirportName !== data.destinationAirportName,
    {
      message: 'Departure and arrival airports must be different',
      path: ['destinationAirportName'],
    }
  )
  .refine(
    (data) => {
      const depTime = new Date(data.departureTime);
      const arrTime = new Date(data.arrivalTime);
      return arrTime > depTime;
    },
    {
      message: 'Arrival time must be after departure time',
      path: ['arrivalTime'],
    }
  );

// Infer TypeScript types from Zod schema
export type AdminFlightFormData = z.infer<typeof AdminFlightFormSchema>;

export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface Airline {
  id: string;
  name: string;
  code: string;
}

interface AdminFlightFormProps {
  onSubmit: (data: AdminFlightFormData) => void | Promise<void>;
  initialData?: Partial<AdminFlightFormData>;
  isLoading?: boolean;
  airports?: Airport[];
  airlines?: Airline[];
  error?: string | null;
}

export const AdminFlightForm: React.FC<AdminFlightFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  airports = [],
  airlines = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<AdminFlightFormData>({
    resolver: zodResolver(AdminFlightFormSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: initialData || {
      flightNumber: '',
      airlineName: '',
      originAirportName: '',
      destinationAirportName: '',
      departureTime: '',
      arrivalTime: '',
      price: undefined,
      totalSeats: undefined,
    },
  });

  const originAirportName = watch('originAirportName');
  const destinationAirportName = watch('destinationAirportName');
  const departureTime = watch('departureTime');

  const isSubmittingForm = isSubmitting || isLoading;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-4xl bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-slate-700 pb-6">
        <h2 className="text-2xl font-bold text-white">
          {initialData ? '✈️ Edit Flight Schedule' : '✈️ Create New Flight'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Ensure airline and airport names match the registered entries in the system.
        </p>
      </div>

      {/* Flight Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Number */}
        <div>
          <label htmlFor="flightNumber" className="block text-sm font-semibold text-slate-200 mb-2">
            Flight Number
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            id="flightNumber"
            type="text"
            placeholder="e.g., BG-084"
            {...register('flightNumber')}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white placeholder-slate-500 outline-none transition-all ${
              errors.flightNumber
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          />
          {errors.flightNumber && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.flightNumber.message}
            </div>
          )}
        </div>

        {/* Airline Name */}
        <div>
          <label htmlFor="airlineName" className="block text-sm font-semibold text-slate-200 mb-2">
            Airline Name
            <span className="text-red-400 ml-1">*</span>
          </label>
          <select
            id="airlineName"
            {...register('airlineName')}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white outline-none transition-all font-mono text-sm ${
              errors.airlineName
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          >
            <option value="">Select Airline</option>
            {airlines.map((airline) => (
              <option key={airline.id} value={airline.name}>
                {airline.code} - {airline.name}
              </option>
            ))}
          </select>
          {errors.airlineName && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.airlineName.message}
            </div>
          )}
        </div>

        {/* Departure Airport Name */}
        <div>
          <label htmlFor="originAirportName" className="block text-sm font-semibold text-slate-200 mb-2">
            Departure Airport Name
            <span className="text-red-400 ml-1">*</span>
          </label>
          <select
            id="originAirportName"
            {...register('originAirportName')}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white outline-none transition-all font-mono text-sm ${
              errors.originAirportName
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          >
            <option value="">Select Departure Airport</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.name}>
                {airport.code} - {airport.city}
              </option>
            ))}
          </select>
          {errors.originAirportName && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.originAirportName.message}
            </div>
          )}
        </div>

        {/* Arrival Airport Name */}
        <div>
          <label htmlFor="destinationAirportName" className="block text-sm font-semibold text-slate-200 mb-2">
            Arrival Airport Name
            <span className="text-red-400 ml-1">*</span>
          </label>
          <select
            id="destinationAirportName"
            {...register('destinationAirportName')}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white outline-none transition-all font-mono text-sm ${
              errors.destinationAirportName
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          >
            <option value="">Select Arrival Airport</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.name}>
                {airport.code} - {airport.city}
              </option>
            ))}
          </select>
          {errors.destinationAirportName && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.destinationAirportName.message}
            </div>
          )}
        </div>

        {/* Departure Time */}
        <div>
          <label htmlFor="departureTime" className="block text-sm font-semibold text-slate-200 mb-2">
            Departure Date & Time
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            id="departureTime"
            type="datetime-local"
            {...register('departureTime')}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white outline-none transition-all ${
              errors.departureTime
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          />
          {errors.departureTime && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.departureTime.message}
            </div>
          )}
        </div>

        {/* Arrival Time */}
        <div>
          <label htmlFor="arrivalTime" className="block text-sm font-semibold text-slate-200 mb-2">
            Arrival Date & Time
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            id="arrivalTime"
            type="datetime-local"
            {...register('arrivalTime')}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white outline-none transition-all ${
              errors.arrivalTime
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          />
          {errors.arrivalTime && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.arrivalTime.message}
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-slate-200 mb-2">
            Ticket Price (USD)
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-slate-400 font-medium">$</span>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('price', { valueAsNumber: true })}
              className={`w-full pl-8 pr-4 py-2.5 rounded-lg bg-slate-800 border text-white placeholder-slate-500 outline-none transition-all ${
                errors.price
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                  : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
            />
          </div>
          {errors.price && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.price.message}
            </div>
          )}
        </div>

        {/* Total Seats */}
        <div>
          <label htmlFor="totalSeats" className="block text-sm font-semibold text-slate-200 mb-2">
            Total Seats Available
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            id="totalSeats"
            type="number"
            min="1"
            max="1000"
            placeholder="0"
            {...register('totalSeats', { valueAsNumber: true })}
            className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white placeholder-slate-500 outline-none transition-all ${
              errors.totalSeats
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                : 'border-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
          />
          {errors.totalSeats && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errors.totalSeats.message}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-700">
        <button
          type="submit"
          disabled={isSubmittingForm}
          className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isSubmittingForm
              ? 'bg-blue-700 text-white cursor-not-allowed opacity-60'
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
          }`}
        >
          {isSubmittingForm && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSubmittingForm ? 'Saving Flight...' : initialData ? 'Update Flight' : 'Create Flight'}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmittingForm}
            className="px-6 py-3 font-semibold rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        )}
      </div>

    </form>
  );
};