import { useState } from 'react';
import BookingForm from './components/BookingForm';
import RideStatus from './components/RideStatus';
import { Car, CreditCard, Shield, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrGenerateUserId } from './utils/user';

function App() {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  return (
    <div className="app-container">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          width: '100%', 
          maxWidth: '1200px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '3rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '0.5rem', 
            borderRadius: '0.75rem',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Car color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            Swift<span style={{ color: 'var(--primary)' }}>Ride</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '0.75rem', 
            color: 'var(--text-dim)',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.4rem 0.8rem',
            borderRadius: '999px'
          }}>
            <UserIcon size={12} />
            <span>{getOrGenerateUserId()}</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '2rem', color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 500 }}>
            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Booking</a>
            <a href="#" style={{ textDecoration: 'none' }}>History</a>
            <a href="#" style={{ textDecoration: 'none' }}>Support</a>
          </nav>
        </div>
      </motion.header>

      <main style={{ width: '100%', maxWidth: '500px' }}>
        <AnimatePresence mode="wait">
          {!activeTaskId ? (
            <BookingForm 
              key="form"
              onBookingSuccess={(id) => setActiveTaskId(id)} 
            />
          ) : (
            <div key="status-container">
              <RideStatus 
                taskId={activeTaskId} 
                onFinished={() => console.log('Ride completed!')}
              />
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveTaskId(null)}
                style={{
                  marginTop: '1.5rem',
                  background: 'transparent',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-dim)',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Book Another Ride
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {/* Features / Social Proof */}
        {!activeTaskId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ 
              marginTop: '4rem', 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Shield size={20} color="var(--primary)" />
                <div style={{ fontSize: '0.75rem' }}>
                    <p style={{ fontWeight: 600 }}>Safe Travels</p>
                    <p style={{ color: 'var(--text-dim)' }}>Verified drivers only</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CreditCard size={20} color="var(--primary)" />
                <div style={{ fontSize: '0.75rem' }}>
                    <p style={{ fontWeight: 600 }}>Digital Pay</p>
                    <p style={{ color: 'var(--text-dim)' }}>Seamless transactions</p>
                </div>
            </div>
          </motion.div>
        )}
      </main>

      <footer style={{ marginTop: 'auto', paddingTop: '4rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
        &copy; 2026 SwiftRide Distributed Systems Inc.
      </footer>
    </div>
  )
}

export default App
