import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticButton from '@/components/MagneticButton';
import { ShaderAnimation } from '@/components/ShaderAnimation';
import { ArrowRight, ArrowDown } from 'lucide-react';

import AnimatedMonopoShaderBackground from '@/components/BackgroundAnimation';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;

    const moveGlow = () => {
      rafId = 0;

      gsap.to(glow, {
        x: pendingX,
        y: pendingY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;

      if (!rafId) rafId = requestAnimationFrame(moveGlow);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
      });

      tl.fromTo(
        '.hero-badge',
        { y: 20, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1 }
      )
        .fromTo(
          '.hero-char',
          {
            y: 120,
            opacity: 0,
            rotateX: -70,
            filter: 'blur(10px)',
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.35,
            stagger: 0.03,
          },
          '-=0.35'
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.75'
        )
        .fromTo(
          '.hero-cta',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.6'
        )
        .fromTo(
          '.scroll-indicator',
          { opacity: 0, y: -10 },
          { opacity: 0.45, y: 0, duration: 1 },
          '-=0.2'
        );
    }, containerRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="hero-char inline-block whitespace-pre">
        {char}
      </span>
    ));
  };

  return (
<section className="monopo-hero relative h-screen w-full overflow-hidden bg-[#020204] text-white">
  <AnimatedMonopoShaderBackground />

  <div className="ui-layer">
    {/* header, headline, footer */}
  </div>

  {/* <div ref={lensRef} className="lens" /> */}
</section>




    
  );
}