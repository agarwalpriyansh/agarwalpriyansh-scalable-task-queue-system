import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, MessageSquare, Send } from "lucide-react";

const Contacts = () => {
  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or need assistance? Our team is available 24/7 to ensure your ride experience is flawless.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info Side */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white/5 border border-white/5 rounded-2xl">
                    <Phone className="text-primary mb-4" size={28} />
                    <h4 className="font-bold mb-2">Call Us</h4>
                    <p className="text-sm text-muted-foreground">+1 (234) 567 89 00</p>
                    <p className="text-sm text-muted-foreground">+1 (987) 654 32 10</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/5 rounded-2xl">
                    <Mail className="text-primary mb-4" size={28} />
                    <h4 className="font-bold mb-2">Email Us</h4>
                    <p className="text-sm text-muted-foreground">support@nyctaxi.com</p>
                    <p className="text-sm text-muted-foreground">info@nyctaxi.com</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/5 rounded-2xl">
                    <MapPin className="text-primary mb-4" size={28} />
                    <h4 className="font-bold mb-2">Visit Office</h4>
                    <p className="text-sm text-muted-foreground">123 Manhattan Ave,</p>
                    <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                </div>
                <div className="p-8 bg-white/5 border border-white/5 rounded-2xl">
                    <Clock className="text-primary mb-4" size={28} />
                    <h4 className="font-bold mb-2">Working Hours</h4>
                    <p className="text-sm text-muted-foreground">Always Open</p>
                    <p className="text-sm text-muted-foreground">24 Hours / 7 Days</p>
                </div>
              </div>

              <div className="bg-primary/10 p-8 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-4 mb-4 text-primary">
                    <MessageSquare size={24} />
                    <h4 className="text-xl font-bold">24/7 Live Support</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Need immediate help with a currently active booking? Our live support agents 
                  are standing by in the app or via the emergency hotline listed above.
                </p>
              </div>
            </div>

            {/* Form Side */}
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white p-10 md:p-12 rounded-2xl shadow-2xl text-background"
            >
              <h3 className="text-3xl font-black mb-2">Get in Touch</h3>
              <p className="text-muted-foreground mb-10">Fill out the form below and we'll get back to you within 24 hours.</p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold tracking-wider opacity-60">Full Name</label>
                        <input type="text" className="w-full bg-slate-100 border-none rounded p-4 focus:ring-2 focus:ring-primary outline-none" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold tracking-wider opacity-60">Email Address</label>
                        <input type="email" className="w-full bg-slate-100 border-none rounded p-4 focus:ring-2 focus:ring-primary outline-none" placeholder="john@example.com" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-wider opacity-60">Subject</label>
                    <input type="text" className="w-full bg-slate-100 border-none rounded p-4 focus:ring-2 focus:ring-primary outline-none" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold tracking-wider opacity-60">Message</label>
                    <textarea rows={5} className="w-full bg-slate-100 border-none rounded p-4 focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Describe your inquiry..."></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-background font-black py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-all transform hover:translate-y-[-2px]">
                    SEND MESSAGE <Send size={20} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Mockup */}
      <section className="h-[400px] w-full grayscale contrast-125 opacity-30 mt-24">
          <div className="bg-[#111] w-full h-full flex items-center justify-center border-y border-white/5">
              <span className="text-sm font-bold tracking-widest text-muted-foreground">INTERACTIVE MAP MOCKUP</span>
          </div>
      </section>
    </div>
  );
};

export default Contacts;
