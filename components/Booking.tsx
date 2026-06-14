'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaCalendarAlt, FaClock, FaWalking, FaCheckCircle, FaPhoneAlt, FaStar, FaArrowRight, FaClipboardList, FaGift, FaShieldAlt, FaHeart } from 'react-icons/fa';
import Image from 'next/image';

const serviceOptions = [
  '--- Threading ---', 'Eyebrow Threading', 'Full Face Threading', 'Upper Lip / Chin',
  '--- Waxing ---', 'Underarms Wax', 'Full Arms Wax', 'Full Legs Wax', 'Brazilian Wax',
  '--- Facials ---', 'Signature Facial', 'Fruit Facial', 'D-Tan Facial', 'Acne Facial', 'Peeling Facial', 'Microdermabrasion',
  '--- Hair ---', 'Hair Cut', 'Hair Styling', 'Hair Color', 'Root Touch Up', 'Hair Treatment / Spa',
  '--- Bridal & Makeup ---', 'Bridal Makeup', 'Party Makeup', 'Hair, Makeup & Saree',
  '--- Lashes & Brows ---', 'Eyebrow Tint', 'Lash Tint', 'Lash Enhancement',
  '--- Other ---', 'Other (specify in notes)',
];

const perks = [
  { icon: FaCheckCircle, text: 'No booking fees' },
  { icon: FaShieldAlt, text: 'Clean & hygienic' },
  { icon: FaHeart, text: 'Personalized care' },
  { icon: FaStar, text: 'Premium products' },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
};

export default function Booking() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const appts = JSON.parse(localStorage.getItem('blossom_appointments') || '[]');
      appts.unshift({
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('blossom_appointments', JSON.stringify(appts));
    } catch (_) {}
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputCls = 'w-full px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-xl border border-accent/20 bg-white/50 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none transition-all placeholder:text-dark/20 text-dark/70 text-sm';
  const labelCls = 'block text-[11px] sm:text-[12.5px] font-semibold text-dark/50 mb-1 sm:mb-1.5 uppercase tracking-wider';

  return (
    <section id="booking" className="relative py-12 sm:py-20 md:py-28 overflow-hidden">
      <div className="section-divider" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/images/booking-bg.jpg" alt="" fill className="object-cover opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-blush/10 to-cream" />
      </div>
      <div className="absolute top-10 right-6 w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-accent/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-6 w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-lavender/6 blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }} className="text-center mb-5 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/30 text-rose px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 border border-accent/12">
            <FaClipboardList className="text-[8px] sm:text-[10px]" /> APPOINTMENTS
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-1.5 sm:mb-3">
            Reserve Your <span className="text-gradient">Appointment</span>
          </h2>
          <p className="text-dark/40 max-w-md mx-auto text-[13px] sm:text-[15px] mb-3 sm:mb-4">
            Schedule your beauty session today!
          </p>

          {/* Trust badges inline */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {[
              { icon: FaWalking, t: 'Walk-ins Welcome' },
              { icon: FaCalendarAlt, t: 'By Appointment' },
              { icon: FaClock, t: 'Flexible Hours' },
            ].map(item => (
              <span key={item.t} className="flex items-center gap-1 text-[11px] sm:text-[13px] text-dark/40">
                <item.icon className="text-rose text-[9px] sm:text-[11px]" /> {item.t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Mobile perks row - horizontal scroll */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 sm:mb-6 lg:hidden -mx-4 sm:mx-0">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 sm:px-0 pb-1 snap-x snap-mandatory">
            {perks.map(p => (
              <div key={p.text} className="snap-center flex-shrink-0 glass rounded-lg px-3 py-2 flex items-center gap-2 min-w-0">
                <p.icon className="text-emerald text-[11px] flex-shrink-0" />
                <span className="text-[12px] text-dark/50 font-medium whitespace-nowrap">{p.text}</span>
              </div>
            ))}
            <a href="tel:4045931680" className="snap-center flex-shrink-0 glass-rose rounded-lg px-3 py-2 flex items-center gap-2">
              <FaPhoneAlt className="text-rose text-[11px] flex-shrink-0" />
              <span className="text-[12px] text-rose font-semibold whitespace-nowrap">(404) 593-1680</span>
            </a>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[1fr,280px] gap-4 sm:gap-6">

          {/* ── FORM ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg">

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12">
                <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto mb-3 sm:mb-4 rounded-full bg-emerald/10 flex items-center justify-center animate-scale-breathe">
                  <FaCheckCircle className="text-emerald text-2xl sm:text-3xl" />
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-dark mb-1.5">Thank You!</h3>
                <p className="text-dark/45 text-xs sm:text-sm max-w-xs mx-auto">
                  Your appointment request has been received. We will contact you shortly to confirm.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-4 text-rose text-xs font-semibold hover:text-rose-dark transition-colors">
                  Book Another Appointment
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input type="text" required placeholder="Your name" value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input type="tel" required placeholder="(xxx) xxx-xxxx" value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>

                {/* Row 2: Email + Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" placeholder="your@email.com" value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Service *</label>
                    <select required value={formData.service}
                      onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className={`${inputCls} appearance-none`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='%23B76E79' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}>
                      <option value="" disabled>Select a service</option>
                      {serviceOptions.map(s =>
                        s.startsWith('---')
                          ? <option key={s} disabled>{s}</option>
                          : <option key={s} value={s}>{s}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Row 3: Date + Time */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={labelCls}>Preferred Date *</label>
                    <input type="date" required value={formData.date}
                      onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Time *</label>
                    <input type="time" required value={formData.time}
                      onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className={labelCls}>Special Notes</label>
                  <textarea rows={2} placeholder="Any special requests..." value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    className={`${inputCls} resize-none`} />
                </div>

                {/* Submit */}
                <button type="submit"
                  className="btn-glow animate-pulse-glow w-full bg-gradient-to-r from-rose to-rose-dark text-white py-3 sm:py-3.5 rounded-full font-semibold text-[14px] sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-rose/20 min-h-[44px] mt-1">
                  <FaCalendarAlt className="text-[10px] sm:text-xs" />
                  Reserve My Appointment
                </button>

                {/* Security note */}
                <p className="text-center text-[10px] sm:text-[11px] text-dark/25 mt-1">
                  <FaShieldAlt className="inline text-[9px] mr-1" />
                  Your information is safe. We never share your details.
                </p>
              </form>
            )}
          </motion.div>

          {/* ── SIDEBAR (Desktop only) ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="hidden lg:flex flex-col gap-3">

            {/* Call card */}
            <div className="glass rounded-2xl p-5 text-center">
              <div className="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-gradient-to-br from-blush to-accent/30 flex items-center justify-center">
                <FaPhoneAlt className="text-rose text-sm" />
              </div>
              <p className="font-serif text-base font-bold text-dark mb-0.5">Prefer to Call?</p>
              <a href="tel:4045931680" className="text-rose font-semibold text-sm hover:text-rose-dark transition-colors">
                (404) 593-1680
              </a>
              <p className="text-[10.5px] text-dark/35 mt-1">Mon-Sat during business hours</p>
            </div>

            {/* Why book card */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaStar className="text-gold text-sm" />
                <p className="font-serif text-sm font-bold text-dark">Why Book With Us</p>
              </div>
              <ul className="space-y-2">
                {['No booking fees', 'Flexible rescheduling', 'Personalized service', 'Premium products', 'Clean & hygienic studio'].map(t => (
                  <li key={t} className="flex items-center gap-2 text-[12px] text-dark/45">
                    <FaCheckCircle className="text-emerald text-[10px] flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* New client card */}
            <div className="glass-rose rounded-2xl p-5 text-center">
              <FaGift className="text-rose text-lg mx-auto mb-2" />
              <p className="font-serif text-sm font-bold text-dark mb-0.5">New Client?</p>
              <p className="text-[11px] text-dark/40">Special first-visit pricing!</p>
              <button onClick={() => scrollTo('#offers')}
                className="mt-2 text-rose text-[12px] font-semibold hover:text-rose-dark transition-colors flex items-center gap-1 mx-auto">
                View Offers <FaArrowRight className="text-[8px]" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile bottom CTA row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
          <a href="tel:4045931680"
            className="glass rounded-xl py-3 flex items-center justify-center gap-2 text-rose font-semibold text-[13px] sm:text-sm min-h-[44px] active:scale-[0.97] transition-transform">
            <FaPhoneAlt className="text-[11px]" /> Call to Book
          </a>
          <button onClick={() => scrollTo('#offers')}
            className="glass-rose rounded-xl py-3 flex items-center justify-center gap-2 text-rose font-semibold text-[13px] sm:text-sm min-h-[44px] active:scale-[0.97] transition-transform">
            <FaGift className="text-[11px]" /> View Offers
          </button>
        </motion.div>
      </div>
    </section>
  );
}
