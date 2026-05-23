import '@/app/globals.css';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

export const metadata = {
  title: 'AeroSky - Premium Flight Management',
  description: 'Book and manage high-end flights across global destinations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white antialiased selection:bg-blue-500/30">
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}