import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RideStatusProps {
  taskId: string;
  onFinished: () => void;
}

interface StatusResponse {
  task_id: string;
  status: string;
  ride_id?: string;
  worker_id?: string;
  driver_id?: string;
  driver_name?: string;
  error?: string;
  created_at?: string;
}

const RideStatus: React.FC<RideStatusProps> = ({ taskId, onFinished }) => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [polling, setPolling] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${apiUrl}/api/status/${taskId}`);
      setStatus(response.data);

      const normalizedStatus = response.data.status?.toLowerCase();
      if (normalizedStatus === 'completed' || normalizedStatus === 'failed') {
        setPolling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        // Auto-return to home after 10 seconds if successful
        if (normalizedStatus === 'completed') {
          setTimeout(onFinished, 10000);
        }
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [taskId]);

  const getStatusDisplay = () => {
    switch (status?.status?.toLowerCase()) {
      case 'pending':
        return {
          icon: <RefreshCw className="animate-spin" size={48} color="#f7c02b" />,
          title: 'Finding Your Driver',
          desc: 'Connecting you with the closest yellow cab.',
          badge: 'Searching',
          badgeClass: 'bg-yellow-100 text-yellow-700'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 size={48} color="#22c55e" />,
          title: 'Ride Confirmed!',
          desc: `${status.driver_name || 'Your driver'} is on their way.`,
          badge: 'Assigned',
          badgeClass: 'bg-green-100 text-green-700'
        };
      case 'failed':
        return {
          icon: <AlertCircle size={48} color="#ef4444" />,
          title: 'Dispatch Failed',
          desc: 'No drivers available. Please try again.',
          badge: 'Error',
          badgeClass: 'bg-red-100 text-red-700'
        };
      default:
        return {
          icon: <Clock size={48} className="text-slate-300" />,
          title: 'Processing Request',
          desc: 'Initializing your ride request...',
          badge: 'Initializing',
          badgeClass: 'bg-slate-100 text-slate-500'
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="w-full max-w-[450px] bg-white p-6 md:p-12 rounded-lg shadow-2xl text-center text-slate-900 overflow-hidden relative">
      <div className={cn("absolute top-6 right-6 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest", display.badgeClass)}>
        {display.badge}
      </div>
      
      <div className="flex justify-center mb-8">
        {display.icon}
      </div>
      
      <h2 className="text-2xl font-black mb-2 tracking-tighter capitalize">{display.title}</h2>
      <p className="text-slate-500 text-sm mb-10 px-4">{display.desc}</p>

      <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 text-left mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking ID: {taskId.slice(0, 8)}...</span>
        </div>
        
        <AnimatePresence>
          {status?.status === 'completed' && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="flex items-center gap-4"
            >
              <div className="bg-primary p-3 rounded-full shadow-lg shadow-primary/30">
                <Car size={24} className="text-background" />
              </div>
              <div>
                <p className="font-black text-sm uppercase">{status.driver_name || 'Driver Found'}</p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary-dark uppercase">
                    Cab #{status.driver_id}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={onFinished}
        className={cn(
            "w-full py-4 text-sm font-black uppercase rounded-md transition-all shadow-md",
            status?.status === 'completed' 
                ? "bg-slate-900 text-white hover:bg-slate-800" 
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
        )}
      >
        {status?.status === 'completed' ? 'Return Home' : 'Cancel Request'}
      </button>
    </div>
  );
};

export default RideStatus;
