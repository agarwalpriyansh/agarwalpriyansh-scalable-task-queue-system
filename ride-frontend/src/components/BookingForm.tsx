import React, { useState } from 'react';
import { MapPin, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { getOrGenerateUserId } from '../utils/user';

interface BookingFormProps {
  onBookingSuccess: (taskId: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess }) => {
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
      alert('Failed to book ride. Please check if API Gateway is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Book a Ride</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label><MapPin size={14} style={{ marginRight: 4 }} /> Pickup Location</label>
          <input
            type="text"
            className="input-control"
            placeholder="Search pickup point"
            value={formData.pickup_location}
            onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label><MapPin size={14} style={{ marginRight: 4 }} /> Drop-off Location</label>
          <input
            type="text"
            className="input-control"
            placeholder="Search destination"
            value={formData.dropoff_location}
            onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {loading ? 'Processing...' : 'Find a Ride'}
        </button>
      </form>
    </motion.div>
  );
};

export default BookingForm;
