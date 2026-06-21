import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

export default function GroupSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { items } = useSiteContent();
  const teamImages = (items.team || []).map((t) => resolveMediaUrl(t.image));

  useEffect(() => {
    if (teamImages.length === 0) return;
    let ctx = gsap.context(() => {
      const images = containerRef.current?.querySelectorAll('.group-img-card');
      if (!images) return;

      images.forEach((img, i) => {
        gsap.fromTo(img, 
          { y: 100 * (i + 1), opacity: 0, rotate: i % 2 === 0 ? 5 : -5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            scrollTrigger: {
              trigger: img,
              start: 'top bottom-=100',
              end: 'bottom center',
              scrub: true,
            }
          }
        );
      });

      gsap.fromTo(textRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom-=200',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [teamImages]);

  if (teamImages.length < 3) return null;

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-[#050505] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
        <div ref={textRef}>
          <span className="text-ayuta-pink text-sm uppercase tracking-[0.4em] font-bold mb-4 block">Unified Vision</span>
          <h2 className="text-5xl md:text-7xl font-display mb-8">The Creative Collective</h2>
          <p className="text-xl text-white/60 leading-relaxed max-w-lg mb-10">
            We are a blend of technologists, artists, and storytellers. 
            Rooted in Tokyo, reaching globally, we transform abstract ideas 
            into interactive masterpieces that resonate with the human soul.
          </p>
          
          <div className="flex gap-8 border-t border-white/10 pt-10">
            <div>
              <div className="text-4xl font-display text-white">24+</div>
              <div className="text-sm text-white/40 uppercase tracking-widest mt-1">Creative Minds</div>
            </div>
            <div>
              <div className="text-4xl font-display text-white">12</div>
              <div className="text-sm text-white/40 uppercase tracking-widest mt-1">Global Awards</div>
            </div>
          </div>
        </div>

        <div className="relative h-[450px] sm:h-[600px] lg:h-[700px] mt-12 lg:mt-0">
          <div className="group-img-card absolute top-0 left-0 w-[55%] sm:w-[45%] aspect-[3/4] rounded-2xl overflow-hidden z-10 cinematic-shadow rotate-[-2deg] transform-gpu border border-white/5 group">
            <img src={teamImages[0]} alt="Team" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale brightness-50 hover:brightness-100 transition-all duration-700 hover:scale-105" />
            <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-md">
              <span className="text-[8px] uppercase tracking-widest text-[#F5F5F5] font-bold">Creative Vision</span>
            </div>
          </div>
          <div className="group-img-card absolute bottom-5 sm:bottom-10 right-0 w-[58%] sm:w-[50%] aspect-[4/5] rounded-2xl overflow-hidden z-20 cinematic-shadow rotate-[3deg] transform-gpu border border-white/5 group">
            <img src={teamImages[1]} alt="Team" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale brightness-50 hover:brightness-100 transition-all duration-700 hover:scale-105" />
            <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-md">
              <span className="text-[8px] uppercase tracking-widest text-[#F5F5F5] font-bold">Design Strategy</span>
            </div>
          </div>
          <div className="group-img-card absolute top-[15%] right-[10%] w-[30%] aspect-square rounded-full overflow-hidden z-0 cinematic-shadow opacity-30 blur-[2px] hidden sm:block">
            <img src={teamImages[2]} alt="Team" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
