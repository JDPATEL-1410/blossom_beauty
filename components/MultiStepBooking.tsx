'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaCheckCircle, FaCalendarAlt, FaClock, FaChevronDown, FaUserAlt, FaPhoneAlt, FaEnvelope, FaCalendarDay } from 'react-icons/fa';

const categories = [
  {
    name: 'Threading',
    services: [
      { id: 't1', name: 'Eyebrow Threading', duration: '15 minutes', price: '$15.00' },
      { id: 't2', name: 'Full Face Threading', duration: '30 minutes', price: '$40.00' },
      { id: 't3', name: 'Upper Lip / Chin', duration: '10 minutes', price: '$10.00' },
    ]
  },
  {
    name: 'Waxing',
    services: [
      { id: 'w1', name: 'Underarms Wax', duration: '15 minutes', price: '$20.00' },
      { id: 'w2', name: 'Full Arms Wax', duration: '30 minutes', price: '$45.00' },
      { id: 'w3', name: 'Full Legs Wax', duration: '45 minutes', price: '$65.00' },
      { id: 'w4', name: 'Brazilian Wax', duration: '30 minutes', price: '$55.00' },
    ]
  },
  {
    name: 'Facials',
    services: [
      { id: 'f1', name: 'Signature Facial', duration: '60 minutes', price: '$85.00' },
      { id: 'f2', name: 'Fruit Facial', duration: '45 minutes', price: '$65.00' },
      { id: 'f3', name: 'D-Tan Facial', duration: '45 minutes', price: '$75.00' },
      { id: 'f4', name: 'Acne Facial', duration: '60 minutes', price: '$95.00' },
      { id: 'f5', name: 'Microdermabrasion', duration: '60 minutes', price: '$110.00' },
    ]
  },
  {
    name: 'Lashes & Brows',
    services: [
      { id: 'b1', name: 'Brow Lamination', duration: '45 minutes', price: '$75.00' },
      { id: 'b2', name: 'Eyebrow Tint', duration: '15 minutes', price: '$20.00' },
      { id: 'b3', name: 'Lash Tint', duration: '20 minutes', price: '$25.00' },
    ]
  }
];

const mockTimes = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

export default function MultiStepBooking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [expandedCategory, setExpandedCategory] = useState<string | null>(categories[0].name);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          email: formData.email,
          service: selectedService?.name || '',
          date: `July ${selectedDate}, 2026`, // Hardcoded for this demo component
          time: selectedTime || '',
          notes: formData.notes
        }),
      });

      if (res.ok) {
        setStep(4);
      } else {
        console.error('Failed to submit appointment');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 rounded-xl border border-accent/20 bg-white focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none transition-all placeholder:text-dark/40 text-black font-semibold text-[15px]";

  // Generate calendar days for current month
  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const isPast = i < 15; // Mock past days
      const isSelected = selectedDate === i;
      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => setSelectedDate(i)}
          className={`aspect-square sm:h-12 w-full rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
            isPast ? 'opacity-30 cursor-not-allowed text-dark' :
            isSelected ? 'bg-primary text-white shadow-lg shadow-rose/20' : 
            'bg-white border border-accent/10 text-dark hover:border-rose hover:text-rose'
          }`}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="max-w-4xl mx-auto w-full min-h-[600px] flex flex-col bg-white rounded-3xl shadow-2xl shadow-rose/10 overflow-hidden border border-accent/10">
      
      {/* Header Area */}
      <div className="bg-dark px-6 md:px-10 py-6 md:py-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose/20 to-transparent rounded-full blur-3xl" />
        
        {step > 1 && step < 4 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="absolute left-6 md:left-10 top-8 text-white/70 hover:text-white transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest z-10"
          >
            <FaChevronLeft /> Back
          </button>
        )}
        
        <div className="text-center relative z-10 mt-8 md:mt-2">
          <h2 className="font-serif text-2xl md:text-3xl text-white font-bold mb-2">
            {step === 1 && "Choose Appointment"}
            {step === 2 && "Choose Date & Time"}
            {step === 3 && "Your Information"}
            {step === 4 && "Appointment Confirmed"}
          </h2>
          <div className="flex justify-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-white/50">
            <span className={step >= 1 ? 'text-metallic-rose' : ''}>Service</span> &mdash;
            <span className={step >= 2 ? 'text-metallic-rose' : ''}>Time</span> &mdash;
            <span className={step >= 3 ? 'text-metallic-rose' : ''}>Details</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-10 flex-1 relative bg-cream/30">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Choose Service */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.name} className="border border-accent/20 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <button 
                    onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-cream/50 transition-colors text-left"
                  >
                    <span className="font-serif text-xl font-bold text-dark">{cat.name}</span>
                    <FaChevronDown className={`text-rose transition-transform duration-300 ${expandedCategory === cat.name ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategory === cat.name && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }} 
                        className="overflow-hidden bg-cream/10 border-t border-accent/10"
                      >
                        {cat.services.map((svc) => (
                          <div key={svc.id} className="px-6 py-4 border-b border-accent/10 last:border-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-colors group">
                            <div>
                              <h4 className="font-bold text-dark text-[15px] mb-1">{svc.name}</h4>
                              <p className="text-dark/60 text-[13px] font-medium flex items-center gap-2">
                                <FaClock className="text-rose text-[11px]" /> {svc.duration}
                              </p>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                              <span className="font-bold text-dark">{svc.price}</span>
                              <button 
                                onClick={() => handleServiceSelect(svc)}
                                className="px-6 py-2.5 bg-white border border-primary text-primary font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}

          {/* STEP 2: Choose Date & Time */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <div className="mb-6 p-4 bg-white border border-accent/20 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-dark">{selectedService.name}</h3>
                  <p className="text-[13px] text-dark/60 font-medium">{selectedService.duration} &bull; {selectedService.price}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-rose text-[12px] font-bold uppercase tracking-wider hover:underline">Edit</button>
              </div>

              <div className="grid md:grid-cols-[1fr,300px] gap-8">
                {/* Calendar */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-accent/20 shadow-sm h-fit">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-dark text-lg">July 2026</h3>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cream text-dark hover:bg-primary hover:text-white transition-colors"><FaChevronLeft className="text-[10px]" /></button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-cream text-dark hover:bg-primary hover:text-white transition-colors"><FaChevronLeft className="text-[10px] rotate-180" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className="text-center text-[10px] sm:text-[11px] font-bold text-dark/40 uppercase">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {/* Empty slots for month start */}
                    <div/><div/><div/>
                    {renderCalendar()}
                  </div>
                </div>

                {/* Times */}
                <div className="bg-white p-6 rounded-2xl border border-accent/20 shadow-sm h-fit min-h-[300px]">
                  {selectedDate ? (
                    <>
                      <h3 className="font-bold text-dark text-lg mb-6 flex items-center gap-2">
                        <FaCalendarAlt className="text-rose text-sm" /> July {selectedDate}, 2026
                      </h3>
                      <div className="flex flex-col gap-3">
                        {mockTimes.map(time => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className="w-full py-3.5 border border-primary text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-rose/20 transition-all duration-300"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-10">
                      <FaCalendarDay className="text-4xl text-dark/20 mb-4" />
                      <p className="font-bold text-dark">Select a date<br/>to see available times</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit">
               <div className="mb-8 p-5 bg-white border border-accent/20 rounded-2xl shadow-sm grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-dark">{selectedService.name}</h3>
                  <p className="text-[13px] text-dark/60 font-medium">{selectedService.duration} &bull; {selectedService.price}</p>
                </div>
                <div className="md:text-right">
                  <h3 className="font-bold text-dark">July {selectedDate}, 2026</h3>
                  <p className="text-[13px] text-dark/60 font-medium">{selectedTime}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5 bg-white p-6 md:p-8 rounded-2xl border border-accent/20 shadow-sm">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-dark mb-2 uppercase tracking-wider">First Name *</label>
                    <div className="relative">
                      <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
                      <input type="text" required className={`${inputCls} pl-11`} placeholder="Jane" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-dark mb-2 uppercase tracking-wider">Last Name *</label>
                    <div className="relative">
                      <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
                      <input type="text" required className={`${inputCls} pl-11`} placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-dark mb-2 uppercase tracking-wider">Phone *</label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
                      <input type="tel" required className={`${inputCls} pl-11`} placeholder="(555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-dark mb-2 uppercase tracking-wider">Email *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" />
                      <input type="email" required className={`${inputCls} pl-11`} placeholder="jane@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-dark mb-2 uppercase tracking-wider">Appointment Notes</label>
                  <textarea rows={3} className={`${inputCls} resize-none`} placeholder="Any special requests or things we should know..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

                <div className="pt-4 border-t border-accent/10 mt-6">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-dark transition-colors shadow-xl shadow-rose/20 disabled:opacity-70">
                    {isSubmitting ? 'Processing...' : 'Complete Appointment'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center py-16">
               <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald/10 text-emerald flex items-center justify-center animate-scale-breathe">
                <FaCheckCircle className="text-5xl" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-dark mb-4">Appointment Confirmed!</h2>
              <p className="text-dark/70 text-lg max-w-md mx-auto mb-10">
                Thank you, {formData.firstName}. We've sent a confirmation email with details for your {selectedService.name} appointment.
              </p>
              
              <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-accent/20 shadow-sm text-left mb-10">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-accent/10">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-rose"><FaCalendarAlt /></div>
                  <div>
                    <p className="font-bold text-dark text-lg">July {selectedDate}, 2026</p>
                    <p className="text-dark/60 font-medium">{selectedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-rose"><FaUserAlt /></div>
                  <div>
                    <p className="font-bold text-dark">{selectedService.name}</p>
                    <p className="text-dark/60 font-medium">{selectedService.duration}</p>
                  </div>
                </div>
              </div>

              <button onClick={() => window.location.href = '/'} className="font-bold text-[12px] uppercase tracking-widest text-primary hover:text-dark transition-colors border-b-2 border-primary pb-1">
                Return to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
