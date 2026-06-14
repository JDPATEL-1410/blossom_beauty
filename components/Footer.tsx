'use client';

import { FaInstagram, FaFacebookF, FaTiktok, FaYelp, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronRight, FaCalendarAlt, FaStar } from 'react-icons/fa';
import Image from 'next/image';

const links = [
  { label: 'Home', href: '#hero' }, { label: 'About', href: '#about' }, { label: 'Services', href: '#services' },
  { label: 'Offers', href: '#offers' }, { label: 'Gallery', href: '#gallery' }, { label: 'Reviews', href: '#testimonials' },
  { label: 'Book Now', href: '#booking' }, { label: 'Contact', href: '#contact' },
];
const svcs = ['Threading', 'Waxing', 'Facials', 'Hair Services', 'Bridal Makeup', 'Lashes & Brows'];
const go = (h: string) => { const el = document.querySelector(h); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };

export default function Footer() {
  return (
    <footer className="relative bg-dark text-white/80 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blush via-rose to-lavender animate-gradient-shift" />

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-rose-dark via-rose to-accent py-6 sm:py-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-8 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto px-4">
          <p className="font-script text-lg sm:text-2xl text-white/90 mb-1">Ready to Look Amazing?</p>
          <p className="text-white/50 text-[11px] sm:text-xs mb-3 sm:mb-4">Book your appointment and let us bring out your inner beauty.</p>
          <button onClick={() => go('#booking')}
            className="bg-white text-rose px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold text-[13px] sm:text-sm hover:bg-cream active:scale-[0.97] transition-all inline-flex items-center gap-1.5 shadow-lg min-h-[40px]">
            <FaCalendarAlt className="text-[10px] sm:text-xs" /> Book Now
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2.5">
              <Image src="/images/logo.png" alt="Blossom Beauty Room" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-accent/15" />
              <h3 className="font-script text-lg sm:text-xl text-blush">Blossom Beauty Room</h3>
            </div>
            <p className="text-white/30 text-[12px] sm:text-[13.5px] leading-relaxed mb-2">Enhancing beauty, boosting confidence. Premium beauty care in a luxurious environment.</p>
            <p className="font-script text-sm text-accent/50 italic">"Your Beauty, Our Passion"</p>
            <div className="flex gap-1.5 sm:gap-2 mt-3">
              {[{ i: FaInstagram, l: 'IG' }, { i: FaFacebookF, l: 'FB' }, { i: FaTiktok, l: 'TT' }, { i: FaYelp, l: 'Y' }].map(s => (
                <a key={s.l} href="#" aria-label={s.l} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose hover:text-white transition-all duration-300 active:scale-90 text-white/40">
                  <s.i className="text-[10px] sm:text-xs" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-blush mb-2.5 flex items-center gap-1"><FaStar className="text-accent/30 text-[7px]" /> Quick Links</h4>
            <ul className="space-y-1">
              {links.map(l => (
                <li key={l.label}><button onClick={() => go(l.href)} className="text-[12px] sm:text-[14px] text-white/30 hover:text-accent transition-colors flex items-center gap-1 py-0.5 min-h-[24px]"><FaChevronRight className="text-[6px] text-accent/25" />{l.label}</button></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-blush mb-2.5 flex items-center gap-1"><FaStar className="text-accent/30 text-[7px]" /> Services</h4>
            <ul className="space-y-1">
              {svcs.map(s => (
                <li key={s}><button onClick={() => go('#services')} className="text-[12px] sm:text-[14px] text-white/30 hover:text-accent transition-colors flex items-center gap-1 py-0.5 min-h-[24px]"><FaChevronRight className="text-[6px] text-accent/25" />{s}</button></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-serif text-sm sm:text-base font-bold text-blush mb-2.5 flex items-center gap-1"><FaStar className="text-accent/30 text-[7px]" /> Contact</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-1.5"><FaMapMarkerAlt className="text-accent text-[10px] mt-0.5 flex-shrink-0" /><p className="text-[12px] sm:text-[14px] text-white/30 leading-relaxed">Unit 9, Bellemay Salon Studios<br />3387 Hwy 5 Suite A<br />Douglasville, GA 30135</p></div>
              <div className="flex items-center gap-1.5"><FaPhone className="text-accent text-[10px] flex-shrink-0" /><a href="tel:4045931680" className="text-[12px] sm:text-[14px] text-white/30 hover:text-accent transition-colors">(404) 593-1680</a></div>
              <div className="flex items-center gap-1.5"><FaEnvelope className="text-accent text-[10px] flex-shrink-0" /><a href="mailto:bansari1027@yahoo.com" className="text-[12px] sm:text-[14px] text-white/30 hover:text-accent transition-colors break-all">bansari1027@yahoo.com</a></div>
            </div>
            <div className="mt-4">
              <p className="text-[9px] sm:text-[10.5px] font-medium text-white/35 mb-1 flex items-center gap-1"><FaEnvelope className="text-[8px] text-accent/30" /> Stay Updated</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="flex-1 px-2.5 py-2 rounded-l-lg bg-white/5 border border-white/5 text-[12px] sm:text-[14px] text-white placeholder:text-white/15 outline-none focus:border-accent/25 transition-colors min-w-0" />
                <button className="px-3 py-2 bg-gradient-to-r from-rose to-rose-dark rounded-r-lg text-[12px] sm:text-[14px] font-medium active:scale-[0.97] transition-transform flex-shrink-0">Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-[10px] sm:text-[11.5px] text-white/20">&copy; {new Date().getFullYear()} Blossom Beauty Room. All rights reserved.</p>
          <p className="text-[10px] sm:text-[11.5px] text-white/20 flex items-center gap-1">Designed with <FaHeart className="text-rose text-[8px]" /> for beauty</p>
        </div>
      </div>

      <div className="h-[68px] sm:h-0" />
    </footer>
  );
}
