import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, CheckCircle2, Navigation, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/utils/cn';

const BOROUGHS = [
    { name: 'Manhattan', lat: 40.7831, lng: -73.9712 },
    { name: 'Brooklyn', lat: 40.6782, lng: -73.9442 },
    { name: 'Queens', lat: 40.7282, lng: -73.7949 },
    { name: 'Bronx', lat: 40.8448, lng: -73.8648 },
    { name: 'Staten Island', lat: 40.5795, lng: -74.1502 }
];

const BecomeDriver = () => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: BOROUGHS[0].lat,
    longitude: BOROUGHS[0].lng
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await axios.post(`${apiUrl}/api/register-driver`, formData);
      setStatus('success');
    } catch (error: any) {
      console.error('Registration error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.error || 'Failed to register as a driver. Please try again.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-48 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
            <Navigation size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Join the Fleet</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Become a <span className="text-primary underline decoration-primary/30 underline-offset-8">Driver</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">Set your own schedule, be your own boss, and drive with the city's most iconic yellow fleet.</p>
        </motion.div>
      </section>

      <div className="max-w-xl mx-auto px-6 -mt-32 relative z-20 pb-24">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-12 rounded-lg shadow-2xl text-center border border-slate-100"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Welcome to the Team!</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium">Your profile has been created and our systems have verified your availability. You can now start receiving ride requests.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="w-full bg-slate-900 text-white py-4 rounded-md font-black uppercase text-sm tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
              >
                Register Another Driver
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 md:p-12 rounded-lg shadow-2xl border border-slate-100"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <div className="w-12 h-1.5 bg-primary mb-8 rounded-full"></div>
                  <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Driver Registration</h2>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserPlus size={18} className="text-slate-300" />
                      </div>
                      <input 
                        type="text" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-primary transition-all text-slate-900 font-medium"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Operations Hub</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {BOROUGHS.map((b) => (
                        <button
                          key={b.name}
                          type="button"
                          onClick={() => setFormData({...formData, latitude: b.lat, longitude: b.lng})}
                          className={cn(
                            "px-4 py-3 rounded-md border text-[11px] font-black uppercase tracking-tighter transition-all",
                            formData.latitude === b.lat 
                              ? "bg-primary border-primary text-background shadow-lg shadow-primary/20" 
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                          )}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Latitude</label>
                        <input 
                          type="number" step="any" required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-mono text-xs focus:border-primary outline-none"
                          value={formData.latitude}
                          onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                        />
                     </div>
                     <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Longitude</label>
                        <input 
                          type="number" step="any" required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-slate-500 font-mono text-xs focus:border-primary outline-none"
                          value={formData.longitude}
                          onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                        />
                     </div>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-md flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-widest">
                    <AlertCircle size={16} />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    "w-full py-4 bg-primary text-background font-black uppercase text-sm rounded-md shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2",
                    status === 'loading' && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {status === 'loading' ? (
                    <><Loader2 className="animate-spin" size={20} /> Registering...</>
                  ) : (
                    'Initialize Registration'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BecomeDriver;
