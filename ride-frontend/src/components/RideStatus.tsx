import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Navigation } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface RideStatusProps {
  taskId: string;
  onFinished?: () => void;
}

const RideStatus: React.FC<RideStatusProps> = ({ taskId, onFinished }) => {
  const [rideDetails, setRideDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;

    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${apiUrl}/api/status/${taskId}`);
        setRideDetails(response.data);
        setError(null);

        if (response.data.status === 'COMPLETED') {
          clearInterval(interval);
          if (onFinished) onFinished();
        }
      } catch (err) {
        console.error('Error fetching status:', err);
        // We don't set error here because 404 is expected while pending
        if ((err as any).response?.status === 404) {
             setRideDetails({ status: 'PENDING' });
        } else {
            setError('Error connecting to service');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [taskId]);

  if (loading && !rideDetails) {
    return (
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <RefreshCw className="animate-spin" size={32} color="#6366f1" />
      </div>
    );
  }

  const status = rideDetails?.status || 'PENDING';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Ride</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Task ID: {taskId}</p>
        </div>
        <div className={`status-badge status-${status.toLowerCase()}`}>
          {status === 'PENDING' && <Clock size={14} style={{ marginRight: 4 }} />}
          {status === 'COMPLETED' && <CheckCircle2 size={14} style={{ marginRight: 4 }} />}
          {status}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'PENDING' ? (
          <motion.div 
            key="pending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '1rem 0' }}
          >
            <Navigation className="animate-pulse" size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-dim)' }}>Searching for the nearest driver...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '1rem' }}
          >
             <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Driver ID</p>
                        <p style={{ fontWeight: 600 }}>{rideDetails.driver_id || 'N/A'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Status</p>
                        <p style={{ color: 'var(--success)', fontWeight: 600 }}>Arrived</p>
                    </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>From</p>
                    <p style={{ marginBottom: '0.5rem' }}>{rideDetails.pickup_location}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>To</p>
                    <p>{rideDetails.dropoff_location}</p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div style={{ marginTop: '1rem', color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </motion.div>
  );
};

export default RideStatus;
