import * as z from 'zod';

// Flight Form Schema
export const flightSchema = z.object({
  flightNumber: z.string().min(2, 'Flight number must be at least 2 characters'),
  airline: z.string().min(2, 'Airline name is required'),
  departureAirport: z.string().min(3, 'Use 3-letter airport code (e.g., DAC)').max(3),
  arrivalAirport: z.string().min(3, 'Use 3-letter airport code (e.g., JFK)').max(3),
  departureTime: z.string().min(1, 'Departure date and time is required'),
  arrivalTime: z.string().min(1, 'Arrival date and time is required'),
  price: z.number().positive('Price must be a positive number'),
  totalSeats: z.number().int().positive('Seats must be a positive integer'),
});

export type FlightFormData = z.infer<typeof flightSchema>;

// Booking Management Schema (e.g., Changing status or assigning seats)
export const bookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  assignedSeat: z.string().optional(),
  adminNotes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type BookingStatusFormData = z.infer<typeof bookingStatusSchema>;