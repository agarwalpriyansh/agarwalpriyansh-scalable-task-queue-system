import { Link } from "react-router-dom";
import { Share2, Send, Camera, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-muted-foreground pt-16 pb-8 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Column 1: Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-background font-extrabold px-2 py-1 rounded">NYC</div>
            <span className="text-xl font-bold text-white">Taxi</span>
          </div>
          <p className="text-sm leading-relaxed">
            Safe, reliable, and comfortable taxi service across all boroughs of New York City.
            Available 24/7 for your travel needs.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors"><Share2 size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Send size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Camera size={20} /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-primary transition-colors">Book a Ride</Link></li>
            <li><Link to="/fleet" className="hover:text-primary transition-colors">Our Fleet</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contacts" className="hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: Contacts */}
        <div>
          <h4 className="text-white font-bold mb-6">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="text-primary shrink-0" />
              <span>123 Manhattan Ave, New York, NY 10001</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-primary shrink-0" />
              <span>+1 (234) 567 89 00</span>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-primary shrink-0" />
              <span>support@nyctaxi.com</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6">Stay Updated</h4>
          <p className="text-sm mb-4">Subscribe for special offers and updates.</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Email address"
              className="bg-white/5 border border-white/10 rounded px-4 py-2 text-sm w-full outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-background p-2 rounded hover:bg-primary-dark transition-colors">
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-xs">
        <p>© 2026 NYC Taxi Distributed Systems Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
