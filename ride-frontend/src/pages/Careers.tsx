import { motion } from "framer-motion";
import { Briefcase, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 flex items-center justify-center overflow-hidden bg-slate-900 px-6">
        <div className="absolute inset-0 z-0 opacity-10">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5"
          >
            <Briefcase size={28} className="text-primary" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter"
          >
            Careers at <span className="text-primary">NYC Taxi</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            We're building a smarter, faster New York. Join our world-class engineering and operations teams.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 relative z-10 -mt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-2xl p-8 md:p-16 text-center border border-slate-100"
        >
          <div className="w-12 h-1.5 bg-primary mb-12 rounded-full mx-auto"></div>
          
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
            <AlertCircle size={32} className="text-slate-300" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Current Status: No Openings</h2>
          <p className="text-slate-500 text-lg mb-12 leading-relaxed max-w-lg mx-auto font-medium">
            We've recently filled our core engineering and dispatch control roles. While we aren't hiring for corporate roles today, we update our listings weekly.
          </p>
          
          <div className="h-px w-full bg-slate-100 mb-12"></div>
          
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Want to join the fleet instead?</p>
            
            <Link 
              to="/become-driver" 
              className="group inline-flex items-center gap-3 bg-slate-900 px-10 py-5 rounded-md font-black text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 text-sm uppercase tracking-widest"
            >
              Become a Driver
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Careers;
