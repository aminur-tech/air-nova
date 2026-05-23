'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/helpers';
import { 
  DollarSign, 
  PlaneTakeoff, 
  UserCheck, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/Sidebar';

interface AnalyticsData {
  totalRevenue: number;
  activeFlights: number;
  totalPassengers: number;
  bookingRate: number;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a live app, swap this with explicit service injections calling your Supabase schema aggregation functions
    const fetchAnalytics = async () => {
      setTimeout(() => {
        setData({
          totalRevenue: 148250.00,
          activeFlights: 34,
          totalPassengers: 1204,
          bookingRate: 88.4
        });
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, []);

  const cards = [
    { title: 'Total Revenue', value: data ? formatCurrency(data.totalRevenue) : '$0', icon: DollarSign, trend: '+12.4% MoM', color: 'from-emerald-500/10 to-teal-500/5', text: 'text-emerald-400' },
    { title: 'Active Flights', value: data?.activeFlights || 0, icon: PlaneTakeoff, trend: '8 scheduled today', color: 'from-blue-500/10 to-indigo-500/5', text: 'text-blue-400' },
    { title: 'Total Registered Passengers', value: data?.totalPassengers || 0, icon: UserCheck, trend: '+48 this week', color: 'from-purple-500/10 to-pink-500/5', text: 'text-purple-400' },
    { title: 'Seat Occupancy Rate', value: data ? `${data.bookingRate}%` : '0%', icon: TrendingUp, trend: 'Optimal threshold reached', color: 'from-amber-500/10 to-orange-500/5', text: 'text-amber-400' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      <DashboardSidebar role="admin" />
      
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            System Overview
          </h1>
          <p className="text-slate-400 text-sm">Real-time status monitoring and analytical flight controls.</p>
        </div>

        {/* Bento Grid Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-900/40 border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : (
            cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${card.color} border border-white/5 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-slate-400">{card.title}</span>
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${card.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{card.value}</h2>
                    <span className="text-xs text-slate-500 mt-1 block">{card.trend}</span>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Recent Bookings Queue Display Panel */}
        <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Real-time Activity</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-medium">
                  <th className="pb-3">Passenger</th>
                  <th className="pb-3">Flight Ref</th>
                  <th className="pb-3">Seat</th>
                  <th className="pb-3">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium text-white">Aminur Rahman</td>
                  <td className="py-3 text-slate-400">AS-102 (DAC → JFK)</td>
                  <td className="py-3 font-mono">14A</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Completed</span></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-medium text-white">Sarah Jenkins</td>
                  <td className="py-3 text-slate-400">AS-409 (LHR → DXB)</td>
                  <td className="py-3 font-mono">03C</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400">Processing</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}