import { supabase } from '@/lib/supabase';

export interface CreateBookingPayload {
  flight_id: string;
  passenger_name: string;
  passenger_passport: string;
  seat_number: string;
  baggage_weight: number;
  ticket_price: number;
  payment_intent_id: string;
}

export const BookingService = {
  // প্রফেশনাল ব্যাগেজ চার্জ ক্যালকুলেটর
  calculateExtraBaggage(weight: number): number {
    const FREE_LIMIT = 23;
    const CHARGE_PER_KG = 15; // আপনার কারেন্সি অনুযায়ী রেট সেট করুন
    if (weight <= FREE_LIMIT) return 0;
    return (weight - FREE_LIMIT) * CHARGE_PER_KG;
  },

  async createBooking(payload: CreateBookingPayload) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Authentication required");

    const extraBaggageCharge = this.calculateExtraBaggage(payload.baggage_weight);
    const totalAmount = payload.ticket_price + extraBaggageCharge;

    // সরাসরি ইনসার্টের বদলে সিকিউর RPC (Database Transaction) ব্যবহার
    const { data, error } = await supabase.rpc('execute_flight_booking', {
      p_flight_id: payload.flight_id,
      p_passenger_name: payload.passenger_name,
      p_passenger_passport: payload.passenger_passport,
      p_seat_number: payload.seat_number,
      p_baggage_weight: payload.baggage_weight,
      p_extra_charge: extraBaggageCharge,
      p_ticket_price: payload.ticket_price,
      p_total_amount: totalAmount,
      p_payment_intent_id: payload.payment_intent_id
    });

    if (error) throw error;
    return data;
  },

  async getPassengerBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`*`);
    if (error) throw error;
    return data;
  },

  async getBookedSeats(flightId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('seat_number')
      .eq('flight_id', flightId);
    
    if (error) throw error;
    return data?.map(booking => booking.seat_number) || [];
  }
};