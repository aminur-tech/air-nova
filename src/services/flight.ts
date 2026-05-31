import { supabase } from '@/lib/supabase';
import { Flight } from '@/types';

export const FlightService = {
  async searchFlights(filters: {
    origin?: string;
    destination?: string;
    date?: string;
    classType?: string;
  }): Promise<Flight[]> {
    let query = supabase
      .from('flights')
      .select(`*`)

    if (filters.origin) {
      query = query.ilike('origin.city', `%${filters.origin}%`);
    }

    if (filters.destination) {
      query = query.ilike('destination.city', `%${filters.destination}%`);
    }

    if (filters.date) {
      query = query
        .gte('departure_time', `${filters.date}T00:00:00Z`)
        .lte('departure_time', `${filters.date}T23:59:59Z`);
    }

    if (filters.classType) {
      query = query.eq('class_type', filters.classType);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as unknown as Flight[];
  },

  async createFlight(flightData: Omit<Flight, 'id' | 'airline' | 'origin' | 'destination'> & { 
    airline_name: string, 
    origin_airport_name: string, 
    destination_airport_name: string 
  }) {
    const { data, error } = await supabase
      .from('flights')
      .insert([flightData])
      .select();
    if (error) throw new Error(error.message);
    return data;
  },

  async getFlight() {
    const { data, error } = await supabase
      .from('flights')
      .select(`*`);

    if (error) throw new Error(error.message);
    return data as unknown as Flight[];
  },

 async getAirports() {
  const { data, error } = await supabase
    .from('airports')
    .select('*')
    .order('city');

  if (error) throw error;

  return data;
},

async getAirlines() {
  const { data, error } = await supabase
    .from('airlines')
    .select('*')
    .order('name');

  if (error) throw error;

  return data;
}
};