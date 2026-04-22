import { motion } from "framer-motion";
import { History, Target, TrendingUp, Users2 } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="pt-24 min-h-screen bg-background">
      {/* ... Hero Section omitted for brevity ... */}
      <section className="py-24 px-6 bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-6 transform origin-top-left"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
            >
              Driving the <br /><span className="text-primary">Future</span> of NYC
            </motion.h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Founded in 2012, NYC Taxi started with a simple mission: to provide the 
              most reliable, professional, and technology-driven transport experience in New York.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-black text-primary mb-2">12+</div>
                <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Years Experience</div>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center mt-8">
                <div className="text-4xl font-black text-primary mb-2">500k+</div>
                <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Happy Riders</div>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-black text-primary mb-2">2k+</div>
                <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Vetted Drivers</div>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/5 text-center mt-8">
                <div className="text-4xl font-black text-primary mb-2">4.9</div>
                <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Philosophy</h2>
                <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="flex gap-6">
                    <History className="text-primary shrink-0" size={40} />
                    <div>
                        <h4 className="text-xl font-bold mb-3">Honoring Heritage</h4>
                        <p className="text-muted-foreground">
                            We embrace the iconic history of the New York Yellow Cab while evolving 
                            with modern technology to meet today's demands.
                        </p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <Users2 className="text-primary shrink-0" size={40} />
                    <div>
                        <h4 className="text-xl font-bold mb-3">Driver First</h4>
                        <p className="text-muted-foreground">
                            We believe that happy, well-supported drivers provide a safer and 
                            more professional experience for our passengers.
                        </p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <Target className="text-primary shrink-0" size={40} />
                    <div>
                        <h4 className="text-xl font-bold mb-3">Reliability Focus</h4>
                        <p className="text-muted-foreground">
                            In a city that never stops, we ensure our dispatch system is always 
                            up and our routes are always optimized.
                        </p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <TrendingUp className="text-primary shrink-0" size={40} />
                    <div>
                        <h4 className="text-xl font-bold mb-3">Innovation Driven</h4>
                        <p className="text-muted-foreground">
                            From distributed task queues to real-time coordinate tracking, we use 
                            cutting-edge tech to stay ahead of the curve.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="bg-primary py-20 px-6 mt-12">
          <div className="max-w-4xl mx-auto text-center text-background">
              <h2 className="text-4xl font-extrabold mb-6">Want to Join the Squad?</h2>
              <p className="text-xl font-bold mb-10 opacity-80">
                  We're always looking for professional drivers and tech innovators to help us redefine urban transport.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/become-driver" className="bg-background text-white px-10 py-4 rounded font-black uppercase text-sm block">Become a Driver</Link>
                  <Link to="/careers" className="bg-background/20 border-2 border-background/50 px-10 py-4 rounded font-black uppercase text-sm block">View Careers</Link>
              </div>
          </div>
      </section>
    </div>
  );
};

export default About;
