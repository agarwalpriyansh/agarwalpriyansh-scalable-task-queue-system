import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import RideStatus from '@/components/RideStatus';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Home = () => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const selectedFleet = searchParams.get('fleet');

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center py-24 px-6 md:px-12 hero-bg-overlay">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center gap-12 lg:gap-24">
          {/* Form Side */}
          <div className="w-full lg:w-auto flex-shrink-0 z-10">
            <AnimatePresence mode="wait">
              {!activeTaskId ? (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <BookingForm 
                    onBookingSuccess={(id) => setActiveTaskId(id)} 
                    selectedFleet={selectedFleet}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <RideStatus 
                    taskId={activeTaskId} 
                    onFinished={() => setActiveTaskId(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Side */}
          <div className="flex-1 text-white z-10">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-7xl font-extrabold leading-tight mb-8"
            >
              Your Reliable <br />
              Taxi Service in <br />
              New York City
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl opacity-90 mb-12 border-l-8 border-primary pl-8 max-w-2xl font-medium"
            >
              Experience the city that never sleeps with a ride that never fails. 
              Safe, professional, and available 24/7.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/fleet"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-background px-8 py-4 rounded font-extrabold text-lg transition-all hover:translate-x-2"
              >
                DISCOVER OUR FLEET <ChevronRight size={24} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Mini Features */}
      <section className="bg-background py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-2xl font-bold italic tracking-tighter">SAFE TRAVELS</div>
            <div className="flex items-center gap-2 text-2xl font-bold italic tracking-tighter">FAST RELIABLE</div>
            <div className="flex items-center gap-2 text-2xl font-bold italic tracking-tighter">PREMIUM FLEET</div>
            <div className="flex items-center gap-2 text-2xl font-bold italic tracking-tighter">CITYWIDE COVERAGE</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
