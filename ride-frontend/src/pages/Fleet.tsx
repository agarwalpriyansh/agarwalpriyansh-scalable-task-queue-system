import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Briefcase, Zap, Shield, Car } from "lucide-react";

const Fleet = () => {
  const cars = [
    {
      name: "Standard Sedan",
      type: "ECONOMY",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
      passengers: 4,
      luggage: 2,
      price: "1.5/km",
      features: ["AC", "Leather Seats", "Fast Pickup"]
    },
    {
      name: "Premium SUV",
      type: "LUXURY",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      passengers: 6,
      luggage: 4,
      price: "2.5/km",
      features: ["WiFi", "Heated Seats", "Extra Space"]
    },
    {
      name: "Black Label",
      type: "EXECUTIVE",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      passengers: 3,
      luggage: 2,
      price: "4.0/km",
      features: ["Champagne", "Butler Service", "Privacy Glass"]
    },
    {
      name: "Electric S",
      type: "ECO",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
      passengers: 4,
      luggage: 3,
      price: "2.0/km",
      features: ["Zero Emission", "Quiet Ride", "Hi-Tech"]
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Our Premium Fleet</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our diverse selection of vehicles tailored to your journey, 
              from city commutes to executive travel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="py-24 px-6 md:px-12 bg-[#151515]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-primary text-background text-[10px] font-black px-2 py-1 rounded">
                  {car.type}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{car.name}</h3>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-primary" />
                    <span>{car.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} className="text-primary" />
                    <span>{car.luggage}</span>
                  </div>
                  <div className="ml-auto text-sm font-bold text-white">
                    ${car.price}
                  </div>
                </div>

                <ul className="space-y-2 mb-8">
                  {car.features.map(f => (
                    <li key={f} className="text-[11px] flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                       {f}
                    </li>
                  ))}
                </ul>

                <Link 
                  to={`/?fleet=${encodeURIComponent(car.name)}`} 
                  className="block w-full py-3 border border-white/10 rounded font-bold text-center text-sm hover:bg-primary hover:text-background transition-all"
                >
                    SELECT CAR
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Stats */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-2xl mx-auto border border-white/5">
                    <Zap className="text-primary" size={32} />
                </div>
                <h4 className="text-xl font-bold">Fast Dispatch</h4>
                <p className="text-sm text-muted-foreground">Average pickup time under 4 minutes across all NYC boroughs.</p>
            </div>
            <div className="space-y-4">
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-2xl mx-auto border border-white/5">
                    <Shield className="text-primary" size={32} />
                </div>
                <h4 className="text-xl font-bold">Vetted Drivers</h4>
                <p className="text-sm text-muted-foreground">Every driver undergoes rigorous background checks and safety training.</p>
            </div>
            <div className="space-y-4">
                <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-2xl mx-auto border border-white/5">
                    <Car className="text-primary" size={32} />
                </div>
                <h4 className="text-xl font-bold">New Models</h4>
                <p className="text-sm text-muted-foreground">Our fleet consists exclusively of vehicles aged 3 years or newer.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Fleet;
