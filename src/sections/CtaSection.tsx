import React from 'react';
import { ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

export default function CtaSection() {
  return (
    <section className="py-60 px-6 relative overflow-hidden bg-[#050505]">
      {/* Intense cinematic glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-ayuta-primary/20 blur-[180px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-ayuta-pink/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center z-10 relative">
        <h2 className="text-7xl md:text-[8rem] font-display font-medium tracking-tighter mb-16 leading-[0.9] text-[#F5F5F5]">
          LET'S UNIVERSE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F5F5] via-ayuta-pink to-ayuta-primary italic font-light">
            COLLIDE.
          </span>
        </h2>
        
        <p className="text-base md:text-xl text-white/30 mb-20 max-w-xl mx-auto leading-relaxed uppercase tracking-widest font-bold">
          Available for new creative collaborations starting in 2026.
        </p>
        
        <div className="flex justify-center items-center">
          <MagneticButton className="bg-[#F5F5F5] text-black border-none !px-16 py-8 text-xl font-bold">
            START JOURNEY <ArrowRight className="w-6 h-6 ml-2" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
