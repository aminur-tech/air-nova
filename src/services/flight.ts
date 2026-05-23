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
      .select(`
        *,
        airline:airlines(*),
        origin:airports!origin_airport_id(*),
        destination:airports!destination_airport_id(*)
      `);

    if (filters.classType) {
      query = query.eq('class_type', filters.classType);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Apply strict filtering in memory for complex join configurations
    let results = data as unknown as Flight[];
    if (filters.origin) {
      results = results.filter(f => f.origin.city.toLowerCase().includes(filters.origin!.toLowerCase()));
    }
    if (filters.destination) {
      results = results.filter(f => f.destination.city.toLowerCase().includes(filters.destination!.toLowerCase()));
    }
    
    return results;
  },

  async createFlight(flightData: Omit<Flight, 'id' | 'airline' | 'origin' | 'destination'> & { airline_id: string, origin_airport_id: string, destination_airport_id: string }) {
    const { data, error } = await supabase
      .from('flights')
      .insert([flightData])
      .select();
    if (error) throw error;
    return data;
  }
};