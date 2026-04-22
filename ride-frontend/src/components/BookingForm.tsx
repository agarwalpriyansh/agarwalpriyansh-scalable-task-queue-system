import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Send } from 'lucide-react';
import { getOrGenerateUserId } from '../utils/user';
import { cn } from '@/utils/cn';

interface BookingFormProps {
  onBookingSuccess: (taskId: string) => void;
  selectedFleet?: string | null;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess, selectedFleet }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: getOrGenerateUserId(),
    pickup_location: '',
    dropoff_location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/request-ride`, formData);
      if (response.data.task_id) {
        onBookingSuccess(response.data.task_id);
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Failed to book ride. Please check if Services are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-white p-6 md:p-12 rounded-lg shadow-2xl text-slate-900">
      {selectedFleet && (
        <div className="mb-4 bg-primary/10 border border-primary/20 px-4 py-2 rounded flex items-center justify-between">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Selected Vehicle</span>
           <span className="text-xs font-black text-primary-dark">{selectedFleet}</span>
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Book a Ride</h2>
      <div className="w-12 h-1.5 bg-primary mb-8 rounded-full"></div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Pickup Point</label>
          <input
            type="text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-primary transition-colors"
            placeholder="Travel From..."
            value={formData.pickup_location}
            onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Destination</label>
          <input
            type="text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-primary transition-colors"
            placeholder="Travel To..."
            value={formData.dropoff_location}
            onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-3 items-start py-2">
          <input type="checkbox" id="terms" required className="mt-1" />
          <label htmlFor="terms" className="text-[11px] leading-relaxed text-slate-500">
            By using this form you agree with the storage and handling of your data by this website. *
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={cn(
            "w-full py-4 bg-primary text-background font-black uppercase text-sm rounded-md shadow-lg shadow-primary/20",
            "flex items-center justify-center gap-2 transition-all hover:bg-primary-dark hover:translate-y-[-2px] active:scale-[0.98]",
            loading && "opacity-70 cursor-not-allowed translate-y-0"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> Processing
            </>
          ) : (
            <>
              Submit <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
