import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-[#2D0F3D] text-[#FAF7F0] pt-16 pb-8 border-t border-[#C6A15B]/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Sri Laxmi Venkateshwara Selections Logo"
                className="h-12 w-auto object-contain bg-white/10 p-1 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-serif font-bold text-[#EFE6D8] leading-snug">
                  Sri Laxmi Venkateshwara
                </h3>
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#C6A15B]">
                  Selections
                </span>
              </div>
            </div>
            <p className="text-[#FAF7F0]/80 text-sm leading-relaxed pt-1">
              Discover timeless Indian ethnic craftsmanship. Exquisite sarees, festive wear, and elegant dresses handpicked for your special celebrations.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://www.instagram.com/lavitha_priya/?utm_source=qr&stkn=MWIxbGwyM2lyeXkydQ=="
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C6A15B] hover:text-[#2D0F3D] transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://wa.me/919848439181"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-serif font-semibold text-[#DFC488] uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                  Explore Collection
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                  Sarees & Dresses
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                  My Orders & Profile
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-base font-serif font-semibold text-[#DFC488] uppercase tracking-wider mb-5">
              Contact & Store
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="text-[#C6A15B] mt-1 mr-3 shrink-0" />
                <span className="text-[#FAF7F0]/80">
                  Beside Ramalayam Temple, Mirdoddi, Siddipet, Telangana, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-[#C6A15B] mr-3 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:9848439181" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                    +91 9848439181
                  </a>
                  <a href="tel:8074254030" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                    +91 8074254030
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-[#C6A15B] mr-3 shrink-0" />
                <a href="mailto:ram.anne606@gmail.com" className="text-[#FAF7F0]/80 hover:text-[#DFC488] transition-colors">
                  ram.anne606@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="text-[#C6A15B] mr-3 shrink-0" />
                <span className="text-[#FAF7F0]/80">
                  Mon – Sun: 9:00 AM – 9:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Location Map & Directions */}
          <div>
            <h4 className="text-base font-serif font-semibold text-[#DFC488] uppercase tracking-wider mb-5">
              Visit Store
            </h4>
            <div className="rounded-xl overflow-hidden h-36 bg-white/10 relative group border border-[#C6A15B]/30">
              <iframe 
                src="https://maps.google.com/maps?q=Mirdoddi,Siddipet,Telangana&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 group-hover:opacity-100 transition-opacity"
                title="SLV Store Location Map"
              ></iframe>
            </div>
            <a 
              href="https://share.google/cI9C3M8QpcfbuCVWC" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-[#DFC488] hover:text-white transition-colors bg-white/5 hover:bg-[#55236F] px-4 py-2 rounded-full border border-[#C6A15B]/40"
            >
              <MapPin size={14} />
              <span>Get Directions on Google Maps →</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FAF7F0]/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Sri Laxmi Venkateshwara Selections (SLV). All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[11px] text-[#DFC488]">
              Open 7 Days • 9 AM - 9 PM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
