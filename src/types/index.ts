import { bookingStatusSchema } from "@/schemas/admin";

export type UserRole = 'passenger' | 'admin';
export type FlightStatus = 'scheduled' | 'delayed' | 'departed' | 'arrived' | 'cancelled';
export type ClassType = 'economy' | 'business' | 'first';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: string;
  code: string;
  name: string;
  logo_url: string | null;
}

export interface Flight {
  id: string;
  flight_number: string;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  departure_time: string;
  arrival_time: string;
  price: number;
  total_seats: number;
  available_seats: number;
  class_type: ClassType;
  baggage_allowance: string;
  status: FlightStatus;
}

export interface Booking {
  id: string;
  flight: Flight;
  user_id: string;
  passenger_name: string;
  passenger_passport: string;
  seat_number: string;
  status: BookingStatus;
  created_at: string;
}