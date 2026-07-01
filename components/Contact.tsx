'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaDirections, FaInstagram, FaFacebookF, FaLocationArrow } from 'react-icons/fa';
import Image from 'next/image';

const hours = [
  { day: 'Mon', time: '10–7 PM', open: true }, { day: 'Tue', time: '10–7 PM', open: true },
  { day: 'Wed', time: '10–7 PM', open: true }, { day: 'Thu', time: '10–7 PM', open: true },
  { day: 'Fri', time: '10–7 PM', open: true }, { day: 'Sat', time: '9–6 PM', open: true },
  { day: 'Sun', time: 'By Appt', open: false },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="contact" className="relative py-12 sm:py-20 md:py-28 bg-white-warm overflow-hidden">
      <div className="section-divider" />
      <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-blush/10 blur-3xl pointer-events-none" />
      <Image src="/images/section-flowers.png" alt="" width={176} height={176} className="floral-corner bottom-0 right-0 w-28 sm:w-44 h-auto opacity-[0.05] rotate-180 -scale-y-100" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/25 text-rose px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 border border-accent/10">
            <FaLocationArrow className="text-[8px] sm:text-[10px]" /> FIND US
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-1.5 sm:mb-3">
            Visit <span className="text-gradient">Us Today</span>
          </h2>
          <p className="text-black font-bold max-w-sm mx-auto text-[13px] sm:text-[15px]">We'd love to welcome you to our studio.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-2.5 sm:space-y-3">
            {/* Address */}
            <div className="glass-strong rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex items-start gap-3 group hover:shadow-lg hover:shadow-rose/5 transition-all duration-300">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-blush to-accent/25 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <FaMapMarkerAlt className="text-rose text-xs sm:text-sm" />
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-dark mb-0.5">Our Studio</h3>
                <p className="text-[12px] sm:text-[14px] text-black font-bold leading-relaxed">Unit 9, Bellemay Salon Studios<br />3387 Highway 5 Suite A<br />Douglasville, GA 30135</p>
                <a href="https://maps.google.com/?q=3387+Highway+5+Suite+A+Douglasville+GA+30135" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-rose text-[12px] sm:text-[14px] font-semibold mt-1 hover:text-rose-dark transition-colors">
                  <FaDirections className="text-[9px] sm:text-[10px]" /> Get Directions
                </a>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { icon: FaPhone, title: 'Call', val: '(404) 593-1680', href: 'tel:4045931680' },
                { icon: FaEnvelope, title: 'Email', val: 'bansari1027@yahoo.com', href: 'mailto:bansari1027@yahoo.com' },
              ].map(c => (
                <div key={c.title} className="glass rounded-xl p-3 sm:p-3.5 group hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blush to-accent/15 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform duration-300">
                    <c.icon className="text-rose text-[10px] sm:text-xs" />
                  </div>
                  <p className="font-serif text-xs sm:text-sm font-bold text-dark mb-0.5">{c.title}</p>
                  <a href={c.href} className="text-black font-bold text-[11px] sm:text-[13px] hover:text-rose transition-colors break-all leading-tight">{c.val}</a>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="glass rounded-xl sm:rounded-2xl p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blush to-accent/15 flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-rose text-[10px] sm:text-xs" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-dark leading-none">Hours</h3>
                  <p className="text-[9px] text-emerald font-medium flex items-center gap-1 mt-0.5"><span className="w-1 h-1 rounded-full bg-emerald inline-block" /> Open Now</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-1.5">
                {hours.map(h => (
                  <div key={h.day} className="flex justify-between text-[12px] sm:text-[14px] items-center">
                    <span className="text-black font-bold font-medium">{h.day}</span>
                    <span className={`font-medium ${h.open ? 'text-black font-bold' : 'text-rose text-[10px]'}`}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:4045931680" className="btn-glow bg-gradient-to-r from-rose to-rose-dark text-white py-2.5 rounded-full font-semibold text-[12px] sm:text-sm text-center shadow-md shadow-rose/12 flex items-center justify-center gap-1.5 min-h-[40px]">
                <FaPhone className="text-[10px] sm:text-[11px]" /> Call Now
              </a>
              <a href="https://maps.google.com/?q=3387+Highway+5+Suite+A+Douglasville+GA+30135" target="_blank" rel="noopener noreferrer"
                className="btn-rose-outline border border-accent/20 text-rose py-2.5 rounded-full font-semibold text-[12px] sm:text-sm text-center flex items-center justify-center gap-1.5 min-h-[40px]">
                <FaDirections className="text-[10px] sm:text-[11px]" /> Directions
              </a>
            </div>
            <div className="flex justify-center lg:justify-start gap-2">
              {[{ icon: FaInstagram, label: 'Instagram' }, { icon: FaFacebookF, label: 'Facebook' }].map(s => (
                <a key={s.label} href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-rose flex items-center justify-center text-rose min-h-[36px]" aria-label={s.label}>
                  <s.icon className="text-xs" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="map-container">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg h-[240px] sm:h-[320px] lg:h-full lg:min-h-[460px]">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.1!2d-84.75!3d33.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQ1JzAwLjAiTiA4NMKwNDUnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
