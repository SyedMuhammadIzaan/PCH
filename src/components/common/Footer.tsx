import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, ArrowRight, Instagram, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-white pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-emerald-900/60">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 flex items-center justify-center shrink-0 text-emerald-400 border border-emerald-700/40">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">Nationwide Delivery</h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Fast 2-4 day shipping across all major cities & towns in Pakistan with COD.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 flex items-center justify-center shrink-0 text-emerald-400 border border-emerald-700/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">100% Authentic Fabrics</h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Guaranteed genuine pure Swiss Voile lawn, Egyptian cotton, and pure silk.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 flex items-center justify-center shrink-0 text-emerald-400 border border-emerald-700/40">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">7-Day Easy Exchange</h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Hassle-free return and exchange policy on all unstitched & pret garments.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 flex items-center justify-center shrink-0 text-emerald-400 border border-emerald-700/40">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">Dedicated Support</h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Our fashion and customer care team is available 7 days a week for styling guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-emerald-900/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-serif font-bold text-xl border border-emerald-600">
                PCH
              </div>
              <div>
                <span className="font-serif text-xl font-bold uppercase tracking-wider text-white">
                  Pakistan Cloth House
                </span>
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">
                  Timeless Pakistani Textiles
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-sm">
              Pakistan Cloth House (PCH) is a premier textile & fashion destination delivering heritage craftsmanship, bespoke unstitched luxury lawn, festive formals, and tailored menswear throughout Pakistan.
            </p>

            <div className="space-y-2 text-xs text-zinc-300 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Shop 48-B, Anarkali & Main Boulevard Gulberg III, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+92 (042) 3571-9988 | WhatsApp: +92 300 8472911</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>care@pakistanclothhouse.pk</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-emerald-900/70 hover:bg-emerald-800 flex items-center justify-center text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-emerald-900/70 hover:bg-emerald-800 flex items-center justify-center text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-9 h-9 rounded-full bg-emerald-900/70 hover:bg-emerald-800 flex items-center justify-center text-white transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="font-serif font-bold text-sm text-emerald-300 uppercase tracking-wider mb-4">
              Shop Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-emerald-300 transition">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?sort=newest')} className="hover:text-emerald-300 transition">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?sort=top-selling')} className="hover:text-emerald-300 transition">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=unstitched-lawn')} className="hover:text-emerald-300 transition">
                  Luxury Lawn 3-Piece
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=stitched-pret')} className="hover:text-emerald-300 transition">
                  Stitched Ready-to-Wear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=mens-collection')} className="hover:text-emerald-300 transition">
                  Men's Kurta & Fabrics
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-serif font-bold text-sm text-emerald-300 uppercase tracking-wider mb-4">
              Customer Service
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <button onClick={() => onNavigate('/#faqs')} className="hover:text-emerald-300 transition">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/orders')} className="hover:text-emerald-300 transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#faqs')} className="hover:text-emerald-300 transition">
                  Shipping & Handling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#faqs')} className="hover:text-emerald-300 transition">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#faqs')} className="hover:text-emerald-300 transition">
                  Fabric Care & Sizing Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#why-choose-us')} className="hover:text-emerald-300 transition">
                  Why Choose PCH
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Administration */}
          <div>
            <h5 className="font-serif font-bold text-sm text-emerald-300 uppercase tracking-wider mb-4">
              My Account
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-emerald-300 transition">
                  Customer Profile
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/orders')} className="hover:text-emerald-300 transition">
                  Order History & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} className="hover:text-emerald-300 transition">
                  Sign In / Register
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment Logos & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 Pakistan Cloth House (PCH). All Rights Reserved. Crafted for Pakistani Elegance.</p>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-200">
            <span className="px-2 py-1 rounded bg-emerald-900 border border-emerald-800">Cash on Delivery</span>
            <span className="px-2 py-1 rounded bg-emerald-900 border border-emerald-800">Visa / Mastercard</span>
            <span className="px-2 py-1 rounded bg-emerald-900 border border-emerald-800">JazzCash</span>
            <span className="px-2 py-1 rounded bg-emerald-900 border border-emerald-800">EasyPaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
