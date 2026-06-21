import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

export default function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { items } = useSiteContent();
  const philosophyItems = items.philosophy || [];

  useEffect(() => {
    if (philosophyItems.length === 0) return;
    const ctx = gsap.context(() => {
      const horizontalEl = horizontalRef.current;
      if (!horizontalEl) return;

      const horizontalWidth = horizontalEl.scrollWidth;
      const windowWidth = window.innerWidth;

      const horizontalTween = gsap.to(horizontalEl, {
        x: () => -(horizontalWidth - windowWidth + 200),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${horizontalWidth * 0.9}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.philosophy-card').forEach((card) => {
        const image = card.querySelector('.card-image');

        if (!image) return;

        gsap.fromTo(
          image,
          {
            scale: 1.15,
          },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'left center',
              end: 'right center',
              scrub: true,
              horizontal: true,
              containerAnimation: horizontalTween,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [philosophyItems]);

  if (philosophyItems.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative h-screen bg-[#050505] overflow-hidden"
    >
      <div className="absolute top-10 left-6 md:top-16 md:left-16 z-20">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-ayuta-pink font-bold mb-4">
          OUR ECOSYSTEM
        </h2>

        <h3 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium tracking-tighter text-[#F5F5F5] leading-[0.9]">
          AYUTA <br />
          <span className="italic font-light">GROUP</span>
        </h3>
      </div>

      <div
        ref={horizontalRef}
        className="flex h-full items-center pl-[10vw] md:pl-[18vw] pr-[10vw] md:pr-[18vw] gap-8 md:gap-28"
      >
        {philosophyItems.map((item, i) => (
          <div
            key={item.id || i}
            className="philosophy-card relative shrink-0 w-[280px] md:w-[500px] h-[400px] md:h-[620px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.03] group"
          >
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
  <img
    src={resolveMediaUrl(item.image)}
    alt={item.title}
    className="
      card-image
      w-[65%]
      md:w-[60%]
      object-contain
      opacity-90
      transition-all
      duration-700
      group-hover:scale-105
    "
  />

  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
</div>

            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 z-10">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-ayuta-pink font-bold mb-3 md:mb-4 block">
                AYUTA GROUP
              </span>

              <h4 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-white mb-4 leading-none">
                {item.title}
              </h4>

            
            </div>

            <div className="absolute inset-0 border border-white/5 rounded-[2rem]" />

            <div className="absolute -inset-[1px] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}