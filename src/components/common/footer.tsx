export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/40 py-8 px-6 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} AeroSky Inc. Developed for precision runtime scale.</p>
        <div className="flex gap-6 text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Center</a>
        </div>
      </div>
    </footer>
  );
}