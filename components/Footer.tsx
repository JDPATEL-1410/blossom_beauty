'use client';

import { FaInstagram, FaFacebookF, FaTiktok, FaYelp, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Home', href: '/' }, 
  { label: 'About', href: '/about' }, 
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' }, 
  { label: 'Contact', href: '/contact' },
];
const svcs = ['Threading', 'Waxing', 'Facials', 'Hair Services', 'Bridal Makeup', 'Lashes & Brows'];

export default function Footer() {
  return (
    <footer className="bg-dark text-white border-t border-white/10 pb-24 md:pb-0">
      
      {/* Architectural CTA Banner */}
      <div className="bg-primary/5 border-b border-white/10 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">Elevate Your <span className="text-metallic-rose">Beauty</span></h2>
          <p className="text-white/70 font-sans text-sm md:text-base mb-8 max-w-md mx-auto">
            Book your appointment today and let our specialists bring out your natural confidence in a luxurious sanctuary.
          </p>
          <Link href="/book"
            className="inline-block bg-primary text-white border border-primary px-10 py-4 font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-white hover:text-dark hover:border-white transition-colors duration-500">
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="lg:pr-8">
            <Link href="/" className="flex items-center gap-3 sm:gap-4 group text-left mb-6 inline-flex">
              <Image src="/images/logo.png" alt="Blossom Beauty Room" width={80} height={80} className="w-14 h-14 md:w-20 md:h-20 object-contain hover:scale-105 transition-transform duration-500" />
              <div>
                <h1 className="font-script text-3xl md:text-5xl font-bold py-1 text-metallic-rose leading-none">Blossom</h1>
                <p className="text-[9px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase font-sans mt-0.5 text-white">Beauty Room</p>
              </div>
            </Link>
            <p className="text-white font-medium font-sans text-[14px] leading-loose mb-6">
              Premium beauty care in a luxurious environment. Specialist expertise, premium products, and uncompromising attention to detail.
            </p>
            <div className="flex gap-4">
              {[{ l: 'Instagram', h: '#' }, { l: 'Facebook', h: '#' }, { l: 'TikTok', h: '#' }].map(s => (
                <a key={s.l} href={s.h} className="text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-primary transition-colors duration-300 border-b border-transparent hover:border-primary pb-1">
                  {s.l}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {links.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="font-serif text-[16px] md:text-[18px] text-white hover:text-primary transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-6">Services</h4>
            <ul className="space-y-4">
              {svcs.map(s => (
                <li key={s}>
                  <Link href="/services" className="font-serif text-[16px] md:text-[18px] text-white hover:text-primary transition-colors duration-300">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-6">Visit Us</h4>
            <div className="space-y-4 mb-10">
              <p className="font-serif text-[16px] md:text-[18px] text-white leading-relaxed">
                Unit 9, Bellemay Salon Studios<br />
                3387 Hwy 5 Suite A<br />
                Douglasville, GA 30135
              </p>
              <a href="tel:4045931680" className="block font-sans text-[14px] text-primary hover:text-white transition-colors duration-300 tracking-wide font-bold mt-2">
                (404) 593-1680
              </a>
              <a href="mailto:bansari1027@yahoo.com" className="block font-sans text-[14px] text-primary hover:text-white transition-colors duration-300 tracking-wide">
                bansari1027@yahoo.com
              </a>
            </div>

            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-4">Newsletter</h4>
            <div className="flex border border-white/20 hover:border-primary transition-colors duration-500">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="flex-1 px-4 py-3 bg-transparent text-[11px] font-bold tracking-[0.1em] text-white placeholder:text-white/30 outline-none w-full" 
              />
              <button className="px-6 py-3 bg-white text-dark font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-colors duration-500">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-white/30 uppercase">
            &copy; {new Date().getFullYear()} Blossom Beauty Room. All Rights Reserved.
          </p>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-white/30 uppercase flex flex-wrap items-center justify-center sm:justify-start gap-1">
            Made by <a href="https://jekush.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors duration-300 ml-1">JEKUSH INFOTECH LLP</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
