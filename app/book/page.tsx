import MultiStepBooking from '@/components/MultiStepBooking';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BookPage() {
  return (
    <main className="min-h-screen bg-cream selection:bg-rose/30 selection:text-rose-dark pt-36 md:pt-44 pb-16">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-script text-5xl md:text-7xl font-bold text-metallic-rose mb-2 py-4">Schedule</h1>
          <p className="text-dark/60 font-bold uppercase tracking-widest text-[11px] md:text-xs">Your luxurious experience awaits</p>
        </div>
        
        <MultiStepBooking />
      </div>

      {/* <Footer /> - Omit or simplify if we don't want the full footer on the booking page */}
    </main>
  );
}
