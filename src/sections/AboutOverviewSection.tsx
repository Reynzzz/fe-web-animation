import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/MagneticButton';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

function renderTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) {
    return title;
  }
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="italic font-light text-gradient-ayuta">{highlight}</span>
      {parts[1]}
    </>
  );
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { settings } = useSiteContent();
  const data = settings.about_overview;

  useEffect(() => {
    if (!data) return;
    let ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });

      gsap.from(imageRef.current, {
        x: 100,
        scale: 1.2,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });

      gsap.to('.about-parallax-img', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  if (!data) return null;

  const stats = data.stats || [];

  return (
    <section ref={containerRef} className="py-40 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div ref={textRef} className="order-2 lg:order-1">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-ayuta-primary font-bold mb-8">
            {data.eyebrow}
          </h2>
          <h3 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-10 text-white leading-[1.1]">
            {renderTitle(data.title, data.titleHighlight)}
          </h3>
          <p className="text-lg md:text-xl text-white/40 mb-12 leading-relaxed font-light">
            {data.body}
          </p>
          <div className="flex items-center gap-10">
            {stats.map((stat: { value: string; label: string }, i: number) => (
              <div key={i} className="flex flex-col">
                <span className="text-3xl font-display text-white">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">{stat.label}</span>
              </div>
            ))}
            <MagneticButton className="ml-auto">
              Our Story <ArrowRight className="w-4 h-4 ml-2" />
            </MagneticButton>
          </div>
        </div>

        <div ref={imageRef} className="order-1 lg:order-2 relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cinematic-shadow border border-white/5">
          <img
            src={resolveMediaUrl(data.image)}
            alt="Studio Environment"
            className="about-parallax-img w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {data.imageCaption && (
            <div className="absolute bottom-10 left-10 text-ayuta-primary/40 italic font-light tracking-[0.5em] text-[10px] uppercase rotate-90 origin-left">
              {data.imageCaption}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
