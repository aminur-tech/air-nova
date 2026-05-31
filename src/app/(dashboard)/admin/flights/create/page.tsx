'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminFlightForm, AdminFlightFormData, Airport, Airline } from '@/components/admin/AdminFlightForm';
import { FlightService } from '@/services/flight';

export default function CreateFlight() {
    const router = useRouter();

    const [airports, setAirports] = useState<Airport[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [airlines, setAirlines] = useState<Airline[]>([]);


    useEffect(() => {
        async function fetchData() {
            try {
                const airportsData = await FlightService.getAirports();
                const airlinesData = await FlightService.getAirlines();
                // console.log('Fetched airports:', airportsData);
                // console.log('Fetched airlines:', airlinesData);

                setAirports(airportsData || []);
                setAirlines(airlinesData || []);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, []);

    const handleSubmit = async (data: AdminFlightFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await FlightService.createFlight({
                flight_number: data.flightNumber,
                departure_time: new Date(data.departureTime).toISOString(),
                arrival_time: new Date(data.arrivalTime).toISOString(),
                price: data.price,
                total_seats: data.totalSeats,
                available_seats: data.totalSeats,
                class_type: 'economy',
                baggage_allowance: '23kg',
                status: 'scheduled',
                airline_name: data.airlineName,
                origin_airport_name: data.originAirportName,
                destination_airport_name: data.destinationAirportName,
            });

            router.push('/admin/flights');
            router.refresh();
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create flight';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <AdminFlightForm
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                airports={airports}
                airlines={airlines}
                error={error}
            />
        </div>
    );
}