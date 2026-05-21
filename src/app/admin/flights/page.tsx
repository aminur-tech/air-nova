"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Plus,
    Pencil,
    Trash2,
    Plane,
    Search,
    X,
} from "lucide-react";

// Updated Flight Interface matching Supabase DB types
interface Flight {
    id: string; // Changed to string for UUID support
    airline: string;
    from_city: string;
    to_city: string;
    departure_time: string;
    price: number;
    created_at?: string;
}

const FlightsManagement = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    // Form Local State
    const [formData, setFormData] = useState({
        airline: "",
        from: "",
        to: "",
        price: "",
        departure: "",
    });

    const API_URL = "http://localhost:5000/api/flights";

    // =========================
    // Fetch Flights (GET)
    // =========================
    const fetchFlights = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            const resultData = response.data.data ? response.data.data : response.data;
            setFlights(Array.isArray(resultData) ? resultData : []);
        } catch (error: any) {
            console.error("Error fetching flights:", error?.response?.data || error.message);
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    // =========================
    // Add Flight (POST)
    // =========================
    const handleAddFlight = async () => {
        if (!formData.airline || !formData.from || !formData.to || !formData.price || !formData.departure) {
            alert("Please fill in all fields before saving.");
            return;
        }

        try {
            const response = await axios.post(API_URL, formData);
            const insertedData = response.data.data ? response.data.data[0] : response.data;

            // Mapping server response safely to the component state
            const newFlight: Flight = {
                id: insertedData?.id,
                airline: insertedData?.airline || formData.airline,
                from_city: insertedData?.from_city || formData.from,
                to_city: insertedData?.to_city || formData.to,
                departure_time: insertedData?.departure_time || formData.departure,
                price: Number(insertedData?.price || formData.price),
            };

            setFlights((prev) => [newFlight, ...prev]); // New item added to top smoothly

            // Resetting UI input fields
            setFormData({
                airline: "",
                from: "",
                to: "",
                price: "",
                departure: "",
            });
            setOpenModal(false);
            alert("Flight added successfully!");

        } catch (error: any) {
            console.error("Error adding flight:", error?.response?.data || error.message);
            alert(`Failed to add flight: ${error?.response?.data?.error || error.message}`);
        }
    };

    // =========================
    // Delete Flight (DELETE)
    // =========================
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this flight?")) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            setFlights((prev) => prev.filter((flight) => flight.id !== id));
            alert("Flight deleted successfully.");
        } catch (error: any) {
            console.error("Error deleting flight:", error?.response?.data || error.message);
            setFlights((prev) => prev.filter((flight) => flight.id !== id));
        }
    };

    // =========================
    // Search Filter
    // =========================
    const filteredFlights = flights.filter((flight) =>
        flight.airline?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Flights Management</h1>
                    <p className="text-gray-500 mt-2">Manage all flights professionally.</p>
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-medium shadow-lg transition-all"
                >
                    <Plus size={20} />
                    Add Flight
                </button>
            </div>

            {/* Search Input */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by airline..."
                    className="w-full outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="text-left px-6 py-4">Airline</th>
                                <th className="text-left px-6 py-4">Route</th>
                                <th className="text-left px-6 py-4">Departure</th>
                                <th className="text-left px-6 py-4">Price</th>
                                <th className="text-center px-6 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFlights.map((flight) => (
                                <tr key={flight.id} className="border-b hover:bg-gray-50 transition-all">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-xl">
                                                <Plane className="text-blue-600" size={20} />
                                            </div>
                                            <span className="font-medium text-gray-800">{flight.airline}</span>
                                        </div>
                                    </td>

                                    {/* Updated column mapping for route */}
                                    <td className="px-6 py-5 text-gray-600">
                                        {flight.from_city} → {flight.to_city}
                                    </td>

                                    {/* Updated column mapping for departure time */}
                                    <td className="px-6 py-5 text-gray-600">
                                        {flight.departure_time}
                                    </td>

                                    <td className="px-6 py-5 font-bold text-blue-600">${flight.price}</td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-xl transition-all">
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(flight.id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredFlights.length === 0 && (
                    <div className="text-center py-16">
                        <Plane className="mx-auto text-gray-300 mb-4" size={50} />
                        <h2 className="text-2xl font-semibold text-gray-700">No Flights Found</h2>
                        <p className="text-gray-500 mt-2">Try another search keyword.</p>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-16 text-lg font-medium text-gray-500">
                        Loading flights...
                    </div>
                )}
            </div>

            {/* Modal Setup */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Add New Flight</h2>
                                <p className="text-blue-100 text-sm mt-1">Fill all required flight details</p>
                            </div>
                            <button onClick={() => setOpenModal(false)} className="hover:bg-white/20 p-2 rounded-lg transition-all">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Airline</label>
                                <input
                                    type="text"
                                    placeholder="Emirates"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.airline}
                                    onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">From City</label>
                                <input
                                    type="text"
                                    placeholder="Dhaka"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.from}
                                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">To City</label>
                                <input
                                    type="text"
                                    placeholder="Dubai"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.to}
                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Departure Time</label>
                                <input
                                    type="text"
                                    placeholder="2026-05-20 10:00:00+06"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.departure}
                                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Price ($)</label>
                                <input
                                    type="number"
                                    placeholder="450"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-5 border-t flex items-center justify-end gap-3">
                            <button onClick={() => setOpenModal(false)} className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleAddFlight} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg">
                                Save Flight
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightsManagement;