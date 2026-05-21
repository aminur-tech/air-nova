"use client";

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  Plane,
  Clock3,
  MapPin,
  Search,
  CalendarDays,
  Users,
} from "lucide-react";

interface FlightType {
  id: string;
  airline: string;
  from: string;
  to: string;
  departure: string;
  price: number;
}

const Flight = () => {
  const [flights, setFlights] = useState<FlightType[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  // =========================
  // Fetch Flights (Optimized)
  // =========================
  const fetchFlights = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/flights");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setFlights(result.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // First time initialization inside useEffect
  useEffect(() => {
    let isMounted = true;

    const initializeFlights = async () => {
      if (isMounted) {
        await fetchFlights();
      }
    };

    initializeFlights();

    return () => {
      isMounted = false;
    };
  }, [fetchFlights]);

  // =========================
  // Filter Flights
  // =========================
  const filteredFlights = flights.filter((flight) => {
    return (
      flight.from.toLowerCase().includes(search.from.toLowerCase()) &&
      flight.to.toLowerCase().includes(search.to.toLowerCase())
    );
  });

  // =========================
  // Handle Search Button Click
  // =========================
  const handleSearchSubmit = () => {
    setLoading(true);
    fetchFlights();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Flight
          </h1>

          <p className="text-lg text-blue-100 mb-10">
            Search and book flights easily with the best prices.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* From */}
            <div className="border rounded-xl px-4 py-3 flex items-center gap-3">
              <MapPin className="text-blue-600" size={20} />
              <input
                type="text"
                placeholder="From"
                className="outline-none w-full text-black"
                value={search.from}
                onChange={(e) =>
                  setSearch({ ...search, from: e.target.value })
                }
              />
            </div>

            {/* To */}
            <div className="border rounded-xl px-4 py-3 flex items-center gap-3">
              <Plane className="text-blue-600" size={20} />
              <input
                type="text"
                placeholder="To"
                className="outline-none w-full text-black"
                value={search.to}
                onChange={(e) =>
                  setSearch({ ...search, to: e.target.value })
                }
              />
            </div>

            {/* Date */}
            <div className="border rounded-xl px-4 py-3 flex items-center gap-3">
              <CalendarDays className="text-blue-600" size={20} />
              <input
                type="date"
                className="outline-none w-full text-black"
                value={search.date}
                onChange={(e) =>
                  setSearch({ ...search, date: e.target.value })
                }
              />
            </div>

            {/* Passenger */}
            <div className="border rounded-xl px-4 py-3 flex items-center gap-3">
              <Users className="text-blue-600" size={20} />
              <select
                className="outline-none w-full text-black bg-transparent"
                value={search.passengers}
                onChange={(e) =>
                  setSearch({ ...search, passengers: Number(e.target.value) })
                }
              >
                <option value={1}>1 Passenger</option>
                <option value={2}>2 Passengers</option>
                <option value={3}>3 Passengers</option>
                <option value={4}>4 Passengers</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchSubmit}
              className="md:col-span-4 bg-blue-600 hover:bg-blue-700 transition-all text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold"
            >
              <Search size={20} />
              Search Flights
            </button>
          </div>
        </div>
      </div>

      {/* FLIGHT LIST */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Flights
          </h2>
          <p className="text-gray-500">
            {filteredFlights.length} Flights Found
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-lg font-medium">
            Loading flights...
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Airline */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {flight.airline}
                    </h3>
                    <p className="text-gray-500">
                      Flight ID: {flight.id}
                    </p>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-lg">{flight.from}</p>
                      <p className="text-gray-500 text-sm">Departure</p>
                    </div>
                    <Plane className="text-blue-600 rotate-90" size={24} />
                    <div>
                      <p className="font-semibold text-lg">{flight.to}</p>
                      <p className="text-gray-500 text-sm">Arrival</p>
                    </div>
                  </div>

                  {/* Departure */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock3 size={20} />
                    {flight.departure}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col md:items-end gap-3">
                    <h3 className="text-3xl font-bold text-blue-600">
                      ${flight.price}
                    </h3>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFlights.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Flights Found
            </h3>
            <p className="text-gray-500">
              Try searching with different locations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flight;