'use client';

import { motion } from 'framer-motion';
import SearchForm, { SearchFormData } from '@/components/flight/search-form';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleFlightSearch = (data: SearchFormData) => {
    const params = new URLSearchParams(data).toString();
    router.push(`/flights?${params}`);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto text-center z-10 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            The Next Generation of Air Travel
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Fly Anywhere, <br />Manage Seamlessly
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Experience ultra-smooth booking mechanics, custom seat selections, and production-grade reliability across all global horizons.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-4xl mx-auto pt-6"
        >
          <SearchForm onSearch={handleFlightSearch} />
        </motion.div>
      </div>
    </div>
  );
}