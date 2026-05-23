'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, MapPin, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

const searchSchema = z.object({
  origin: z.string().min(2, "Enter origin city"),
  destination: z.string().min(2, "Enter destination city"),
  date: z.string().min(1, "Select date"),
});

export type SearchFormData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
        <input 
          {...register('origin')} 
          placeholder="From where?" 
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
        {errors.origin && <p className="text-red-400 text-xs mt-1 absolute">{errors.origin.message}</p>}
      </div>

      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
        <input 
          {...register('destination')} 
          placeholder="Where to?" 
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
        {errors.destination && <p className="text-red-400 text-xs mt-1 absolute">{errors.destination.message}</p>}
      </div>

      <div className="relative">
        <Calendar className="absolute left-3 top-3.5 text-slate-400 h-5 w-5" />
        <input 
          type="date" 
          {...register('date')} 
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
        {errors.date && <p className="text-red-400 text-xs mt-1 absolute">{errors.date.message}</p>}
      </div>

      <Button type="submit" className="w-full h-full flex items-center justify-center gap-2">
        <Search className="h-5 w-5" /> Search Flights
      </Button>
    </form>
  );
}