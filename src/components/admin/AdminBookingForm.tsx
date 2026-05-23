import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingStatusFormData, bookingStatusSchema } from '@/schemas/admin';


interface AdminBookingFormProps {
  bookingId: string;
  passengerName: string;
  currentStatus: 'pending' | 'confirmed' | 'cancelled';
  initialSeat?: string;
  onUpdate: (data: BookingStatusFormData) => void;
}

export const AdminBookingForm: React.FC<AdminBookingFormProps> = ({
  bookingId,
  passengerName,
  currentStatus,
  initialSeat = '',
  onUpdate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingStatusFormData>({
    resolver: zodResolver(bookingStatusSchema),
    defaultValues: {
      status: currentStatus,
      assignedSeat: initialSeat,
      adminNotes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onUpdate)} className="space-y-4 max-w-md bg-slate-900 p-6 rounded-xl border border-slate-800">
      <div>
        <h3 className="text-lg font-medium text-white">Manage Booking</h3>
        <p className="text-sm text-slate-400 mt-1">
          ID: <span className="font-mono text-slate-300">{bookingId}</span> | Passenger: <span className="text-slate-300">{passengerName}</span>
        </p>
      </div>

      <hr className="border-slate-800" />

      {/* Status Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300">Reservation Status</label>
        <select
          {...register('status')}
          className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="pending">Pending Review</option>
          <option value="confirmed">Confirmed / Active</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {errors.status && <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>}
      </div>

      {/* Assigned Seat */}
      <div>
        <label className="block text-sm font-medium text-slate-300">Assign Seat (Optional)</label>
        <input
          {...register('assignedSeat')}
          className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 uppercase focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., 14A"
        />
        {errors.assignedSeat && <p className="mt-1 text-sm text-red-400">{errors.assignedSeat.message}</p>}
      </div>

      {/* Internal Admin Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-300">Internal Audit Notes</label>
        <textarea
          {...register('adminNotes')}
          rows={3}
          className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 text-white p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Reason for cancellation, upgrade notes, etc..."
        />
        {errors.adminNotes && <p className="mt-1 text-sm text-red-400">{errors.adminNotes.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium rounded-lg transition-colors outline-none"
      >
        {isSubmitting ? 'Updating System...' : 'Update Ticket Details'}
      </button>
    </form>
  );
};