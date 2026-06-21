import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Marquee from '@/components/Marquee';

gsap.registerPlugin(ScrollTrigger);

import { useSiteContent } from '@/context/SiteContentContext';

export default function AchievementSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { settings } = useSiteContent();
  const stats = settings.achievements?.items || [];

  useEffect(() => {
    if (stats.length === 0) return;
    let ctx = gsap.context(() => {
      const statItems = sectionRef.current?.querySelectorAll('.stat-item');
      if (!statItems) return;

      statItems.forEach((item) => {
        const target = item.querySelector('.stat-value');
        if (!target) return;
        
        gsap.from(target, {
          innerText: 0,
          duration: 2.5,
          snap: { innerText: 1 },
          ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=50',
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  if (stats.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
          {stats.map((stat: { label: string; value: number; suffix: string }, i: number) => (
            <div key={i} className="stat-item">
              <div className="text-[10px] text-ayuta-pink uppercase tracking-[0.5em] font-bold mb-6">
                {stat.label}
              </div>
              <div className="text-6xl md:text-8xl font-display font-medium text-[#F5F5F5] tracking-tighter">
                <span className="stat-value" data-value={stat.value}>0</span>
                <span className="text-white/20">{stat.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dynamic kinetic typography background */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.03] pointer-events-none select-none">
        <Marquee 
          text="CREATIVE EXCELLENCE • DIGITAL ARTISTRY • CINEMATIC EXPERIENCE • " 
          speed={40} 
          className="text-[25vw] font-bold tracking-tighter leading-none text-white italic" 
        />
      </div>
    </section>
  );
}
