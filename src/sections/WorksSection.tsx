import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 768;

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

export default function WorksSection() {
  const isMobile = useIsMobile();
  const { projects } = useSiteContent();
  const navigate = useNavigate();

  // Pick 5 random projects (stable per mount)
  const displayProjects = useMemo(() => {
    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [projects]);

  if (displayProjects.length === 0) return null;

  return (
    <>
      {isMobile ? (
        <WorksMobile projects={displayProjects} />
      ) : (
        <WorksDesktop projects={displayProjects} />
      )}

      {/* SEE ALL WORKS — appears after the card stack */}
      <section className="bg-[#050505] relative overflow-hidden py-24 flex flex-col items-center justify-center">
        {/* Aura that bleeds up from this section to visually connect with the stack above */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-ayuta-primary/10 blur-[160px] rounded-full" />
          <div className="absolute -bottom-20 right-[10%] w-[350px] h-[350px] bg-ayuta-pink/10 blur-[130px] rounded-full" />
        </div>

        {/* Label */}


        {/* CTA Button */}
        <button
          onClick={() => navigate('/works')}
          className="relative z-10 group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-sm md:text-base tracking-wide transition-all duration-300 hover:bg-ayuta-primary hover:text-white hover:scale-105 hover:shadow-[0_0_50px_rgba(147,51,234,0.4)]"
        >
          See All Works
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black/10 group-hover:bg-white/20 transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </button>


      </section>
    </>
  );
}

/* ----------------------------------------------------------------------- */
/* DESKTOP — pinned scroll-driven card stack                               */
/* ----------------------------------------------------------------------- */

function WorksDesktop({ projects }: { projects: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.work-card');
      if (!cards.length) return;

      gsap.set(cards, {
        willChange: 'transform, opacity, filter',
        transformOrigin: 'center center',
        force3D: true,
      });

      gsap.set(cards.slice(1), {
        yPercent: 105,
        scale: 0.88,
        rotate: 2.5,
        autoAlpha: 0,
        filter: 'blur(6px)',
      });

      // One slot of timeline "space" per transition.
      const SLOT = 1.4;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${cards.length * 70}%`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'sine.inOut' },
      });

      cards.forEach((card, i) => {
        const img = card.querySelector('.card-img');
        const content = card.querySelector('.card-content');
        const overlay = card.querySelector('.card-overlay');
        const position = i * SLOT;

        if (i === 0) {
          tl.to(
            img,
            { yPercent: -8, scale: 1.03, duration: SLOT, ease: 'none' },
            0
          );
        } else {
          tl.fromTo(
            card,
            {
              yPercent: 105,
              scale: 0.88,
              rotate: 2.5,
              autoAlpha: 0,
              filter: 'blur(6px)',
            },
            {
              yPercent: 0,
              scale: 1,
              rotate: 0,
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: SLOT * 0.85,
              ease: 'power2.out',
            },
            position
          );

          tl.fromTo(
            img,
            { yPercent: 14, scale: 1.1 },
            {
              yPercent: -8,
              scale: 1.02,
              duration: SLOT,
              ease: 'none',
            },
            position
          );

          tl.fromTo(
            content,
            { y: 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: SLOT * 0.6,
              ease: 'power3.out',
            },
            position + SLOT * 0.25
          );

          tl.fromTo(
            overlay,
            { opacity: 0.95 },
            { opacity: 0.65, duration: SLOT * 0.85, ease: 'power1.out' },
            position
          );

          tl.to(
            cards[i - 1],
            {
              scale: 0.92,
              opacity: 0.35,
              filter: 'blur(10px) grayscale(0.7)',
              yPercent: -16,
              rotate: -1.2,
              duration: SLOT,
              ease: 'sine.in',
            },
            position
          );

          tl.to(
            cards[i - 1].querySelector('.card-img'),
            { yPercent: -22, scale: 1.06, duration: SLOT, ease: 'none' },
            position
          );
        }
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-[#050505] will-change-transform"
    >
      {/* BACKGROUND AURA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[8%] w-[420px] h-[420px] bg-ayuta-primary/20 blur-[150px] rounded-full animate-float-slow" />
        <div className="absolute bottom-[8%] right-[8%] w-[360px] h-[360px] bg-ayuta-pink/20 blur-[150px] rounded-full animate-float" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-ayuta-royal/10 blur-[170px] rounded-full" />
      </div>

      {/* TITLE */}
      <div className="absolute top-10 left-6 md:top-16 md:left-16 z-20">
        <h2 className="text-[9px] md:text-[10px] uppercase tracking-[1.45em] text-ayuta-primary font-bold mb-3 md:mb-4">
          ARCHIVE OF CREATION
        </h2>
        <h3 className="text-4xl md:text-7xl lg:text-8xl font-display font-medium tracking-tighter text-[#F5F5F5] leading-[0.9]">
          SELECTED <br />
          <span className="italic font-light text-gradient-ayuta">WORKS</span>
        </h3>
      </div>

      {/* SCROLL INDICATOR CENTER */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none">
        <span className="text-[10px] tracking-[0.4em] uppercase text-white/45 font-medium">
          Scroll
        </span>
        <div className="relative w-[1px] h-20 bg-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-ayuta-pink to-ayuta-primary animate-scrollLine" />
        </div>
      </div>

      {/* SCROLL INDICATOR RIGHT */}
      <div className="absolute bottom-20 right-10 z-30 hidden lg:flex items-center gap-3 text-white/35 pointer-events-none">
        <div className="w-8 h-12 rounded-full border border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.35em]">Explore</span>
      </div>

      {/* CARDS */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20 overflow-hidden">
        {projects.map((project, i) => (
          <Link
            to={`/works/${project.slug}`}
            key={project.id || project.slug || i}
            className="work-card absolute w-[88%] md:w-[68%] h-[56vh] md:h-[65vh] rounded-[1.6rem] overflow-hidden border border-white/5 cinematic-shadow group interactive cursor-pointer pointer-events-auto bg-[#080808]"
            style={{
              zIndex: i + 10,
              opacity: i === 0 ? 1 : 0,
              visibility: i === 0 ? 'visible' : 'hidden',
            }}
          >
            <div className="card-img-container absolute inset-0 bg-[#080808] overflow-hidden">
              <img
                src={resolveMediaUrl(project.heroImage)}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className=" w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 pointer-events-none"
              />
              <div className="card-overlay absolute inset-0 bg-gradient-to-t from-[#050505] via-black/25 to-transparent opacity-80 pointer-events-none transition-all duration-1000" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-[2px]">
              <span className="px-5 py-2 rounded-full border border-ayuta-primary/30 bg-ayuta-primary/20 backdrop-blur-md text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-bold text-white">
                View Project
              </span>
            </div>

            <div className="card-content absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10 flex justify-between items-end gap-6 z-10">
              <div>
                <span className="text-ayuta-pink text-[9px] md:text-[10px] uppercase tracking-[0.35em] font-bold mb-3 block">
                  {project.category}
                </span>
                <h4 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium tracking-tighter text-[#F5F5F5] leading-none">
                  {project.title}
                </h4>
              </div>
              <div className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/10 backdrop-blur-xl flex items-center justify-center interactive overflow-hidden bg-white/5">
                <div className="absolute inset-0 bg-gradient-ayuta translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <ArrowUpRight className="relative z-10 w-5 h-5 md:w-7 md:h-7 text-white group-hover:text-white transition-all duration-500 group-hover:rotate-45" />
              </div>
            </div>

            <div
              className="absolute top-0 right-0 w-[1px] h-full"
              style={{ backgroundColor: project.color, opacity: 0.4 }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* MOBILE — simple vertical list, no pin, no stacking                      */
/* ----------------------------------------------------------------------- */

function WorksMobile({ projects }: { projects: any[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.work-card-mobile');

      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, listRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={listRef} className="relative bg-[#050505] py-16 px-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[260px] h-[260px] bg-ayuta-primary/15 blur-[110px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[220px] h-[220px] bg-ayuta-pink/15 blur-[110px] rounded-full" />
      </div>

      <div className="relative z-10 mb-10">
        <h2 className="text-[9px] uppercase tracking-[0.45em] text-ayuta-primary font-bold mb-3">
          ARCHIVE OF CREATION
        </h2>
        <h3 className="text-4xl font-display font-medium tracking-tighter text-[#F5F5F5] leading-[2]">
          SELECTED <br />
          <span className="italic font-light text-gradient-ayuta">WORKS</span>
        </h3>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        {projects.map((project, i) => (
          <Link
            to={`/works/${project.slug}`}
            key={project.id || project.slug || i}
            className="work-card-mobile block relative w-full h-[48vh] rounded-2xl overflow-hidden border border-white/5 cinematic-shadow bg-[#080808] active:scale-[0.98] transition-transform duration-200"
          >
            <div className="absolute inset-0 bg-[#080808] overflow-hidden">
              <img
                src={resolveMediaUrl(project.heroImage)}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-transparent" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end gap-4 z-10">
              <div>
                <span className="text-ayuta-pink text-[9px] uppercase tracking-[0.35em] font-bold mb-2 block">
                  {project.category}
                </span>
                <h4 className="text-3xl font-display font-medium tracking-tighter text-[#F5F5F5] leading-none">
                  {project.title}
                </h4>
              </div>
              <div className="relative shrink-0 w-11 h-11 rounded-full border border-white/10 backdrop-blur-xl flex items-center justify-center overflow-hidden bg-white/5">
                <ArrowUpRight className="relative z-10 w-5 h-5 text-white" />
              </div>
            </div>

            <div
              className="absolute top-0 right-0 w-[1px] h-full"
              style={{ backgroundColor: project.color, opacity: 0.4 }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}