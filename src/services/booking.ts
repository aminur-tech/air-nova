import { supabase } from '@/lib/supabase';

export const BookingService = {
  async createBooking(bookingData: {
    flight_id: string;
    passenger_name: string;
    passenger_passport: string;
    seat_number: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required");

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: user.id,
        ...bookingData,
        status: 'confirmed'
      }])
      .select();

    if (error) throw error;

    // Atomically decrement seats remaining
    await supabase.rpc('decrement_available_seats', { target_flight_id: bookingData.flight_id });

    return data;
  },

  async getPassengerBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *`);
    if (error) throw error;
    return data;
  }
};