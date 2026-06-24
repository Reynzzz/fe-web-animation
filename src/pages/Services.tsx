import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { fetchServices, resolveMediaUrl } from '@/lib/api';

const defaultServicesList = [
  {
    title: "Strategy & Planning",
    description: "We help brands define their purpose and position in the market through in-depth research, cultural insights, and strategic frameworks that drive long-term growth and meaningful connections.",
    image: ""
  },
  {
    title: "Creative Development",
    description: "From visual identity to campaign conceptualization, our creative team crafts compelling narratives and stunning visuals that capture attention and resonate with your target audience.",
    image: ""
  },
  {
    title: "Brand Activation",
    description: "We bring brands to life through immersive experiences, experiential marketing, and targeted activations that engage consumers directly and create lasting impressions.",
    image: ""
  },
  {
    title: "Experience Design",
    description: "Our design approach focuses on the end-to-end customer journey, creating seamless, intuitive, and delightful interactions across all physical and digital touchpoints.",
    image: ""
  },
  {
    title: "Production & Execution",
    description: "With meticulous attention to detail, we manage the entire production process—from initial prototyping to final rollout—ensuring high-quality delivery on time and within budget.",
    image: ""
  }
];

export default function Services() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [dbServices, setDbServices] = useState<any[]>([]);

  useEffect(() => {
    fetchServices().then((data) => {
      setDbServices(data || []);
    }).catch((err) => {
      console.error('Failed to fetch services:', err);
    });
  }, []);

  const displayServices = dbServices.length > 0 
    ? dbServices.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image
      }))
    : defaultServicesList;

  const toggleAccordion = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <main className="w-full bg-[#050505] text-white min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20">
        {/* Top Indicators */}
        <div className="absolute top-32 left-6 md:left-12 flex flex-col gap-1 text-xs uppercase tracking-widest text-white/50 font-medium">
          <span>Creative</span>
          <span>studio</span>
        </div>
        
        <div className="absolute top-32 right-6 md:right-12">
          <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>

        {/* Hero Text */}
        <div className="flex-1 flex flex-col justify-center items-center text-center mt-12 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-5xl mx-auto w-full relative"
          >
            <h1 className="text-[12vw] md:text-[8vw] lg:text-[7vw] leading-[0.9] font-display uppercase tracking-tight flex flex-col items-center w-full">
              <span className="block text-white/90">WE ARE</span>
              <span className="block text-white">A FULL SERVICE</span>
              
              <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start gap-6 md:gap-12 mt-2 relative w-full px-4 md:px-20">
                <span className="font-serif italic font-light tracking-tighter text-white">AGENCY</span>
                
                {/* Paragraph next to AGENCY */}
                <p className="text-left text-sm md:text-base text-white/60 normal-case tracking-normal font-sans font-normal max-w-xs leading-relaxed md:pb-4">
                  We are a full service agency delivering experiences through strategy, creativity, production, and execution.
                </p>
              </div>
            </h1>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full border border-white/10"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] opacity-60">
              <defs>
                <path id="scroll-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="10.5" fill="currentColor" letterSpacing="2.5" className="uppercase font-medium">
                <textPath href="#scroll-circle" startOffset="0%">
                  Scroll to explore • Scroll to explore • 
                </textPath>
              </text>
            </svg>
            <ArrowDown className="w-5 h-5 text-white/80 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* SERVICES LIST SECTION */}
      <section className="relative px-6 md:px-12 py-24 border-t border-white/10">
        <div className="flex justify-between items-center mb-16 md:mb-24 text-sm font-semibold tracking-wide">
          <span className="text-white">/Services</span>
          <span className="text-white/50">(05)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* List */}
          <div className="lg:col-span-7 flex flex-col">
            {displayServices.map((service, idx) => {
              const isExpanded = expandedIndex === idx;

              return (
                <motion.div 
                  key={service.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                  className={`group flex flex-col py-6 md:py-8 border-b cursor-pointer transition-colors ${isExpanded ? 'border-ayuta-pink' : 'border-white/10 hover:border-ayuta-pink/50'}`}
                  onClick={() => toggleAccordion(idx)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight transition-all duration-300 ${isExpanded ? 'text-ayuta-pink' : 'text-white/90 group-hover:text-ayuta-pink'}`}>
                      {service.title}
                    </h3>
                    <motion.span 
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      className={`font-light text-3xl transition-colors duration-300 ${isExpanded ? 'text-ayuta-pink' : 'text-white/40 group-hover:text-ayuta-pink'}`}
                    >
                      +
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 md:pt-8 pb-2 flex flex-col gap-6">
                          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed max-w-2xl whitespace-pre-wrap">
                            {service.description}
                          </p>
                          <div className="w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden bg-white/5 border border-white/10 relative group-hover:border-ayuta-pink/30 transition-colors duration-500">
                            {service.image ? (
                              <img src={resolveMediaUrl(service.image)} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm tracking-widest uppercase">
                                  Project Showcase
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-ayuta-primary/20 to-ayuta-pink/10 opacity-50 mix-blend-overlay" />
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Description right side */}
          <div className="lg:col-span-5 flex items-center lg:pl-12">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-2xl lg:text-[22px] leading-relaxed text-white/60 font-light max-w-md"
            >
              We work closely with brands to create experiences that align with their vision, connect with audiences, and bring campaigns to life through thoughtful strategy and execution.
            </motion.p>
          </div>
        </div>
      </section>

    </main>
  );
}
