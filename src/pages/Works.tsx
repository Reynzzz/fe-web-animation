import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

// ── Infinite auto-scroll marquee for partner logos ──────────────────────────
function PartnerMarquee() {
  const { items } = useSiteContent();
  const partners = items.partner || [];
  const trackRef = useRef<HTMLDivElement>(null);

  if (partners.length === 0) return null;

  const doubled = [...partners, ...partners];

  return (
    <div className="w-full px-0 md:px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10">
      <div className="max-w-7xl mx-auto overflow-hidden bg-[#0a0a0a] border-t border-b border-white/10 py-3 sm:py-4 md:py-5 relative">
        {/* Left label */}
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-[#0a0a0a] pr-3 sm:pr-6 pl-3 sm:pl-4 md:pl-6 border-r border-white/10">
          <span className="text-white text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] whitespace-nowrap">
            BRANDS WE SERVE
          </span>
        </div>

        {/* Scrolling logo track */}
        <div className="flex items-center pl-[90px] sm:pl-[130px] md:pl-[200px]">
          <div
            ref={trackRef}
            className="flex items-center gap-4 sm:gap-6 md:gap-10 animate-marquee-logos whitespace-nowrap"
            style={{ willChange: 'transform' }}
          >
            {doubled.map((partner, i) => (
              <img
                key={i}
                src={resolveMediaUrl(partner.image)}
                alt={partner.title || 'Partner'}
                className="h-16 sm:h-10 md:h-32 w-auto object-cover shrink-0 inline-block"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { projects, loading } = useSiteContent();

  useEffect(() => {
    if (projects.length === 0) return;

    let ctx = gsap.context(() => {
      gsap.from('.work-item', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-16 px-4 sm:px-6 bg-[#050505] min-h-screen text-white">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-[7rem] text-center font-display font-bold tracking-tighter mb-0 leading-[0.95]">
          EXPERIENCES <span className="text-white/20 italic">WE BUILT </span>
        </h1>

        {loading ? (
          <div className="flex items-center justify-center p-10 md:p-20">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-ayuta-pink" />
            <span className="ml-4 font-display text-sm md:text-base">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-white/40 py-10 md:py-20 font-display text-sm md:text-base">
            No projects available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-4 md:gap-6 mt-8 sm:mt-10 md:mt-12">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/works/${project.slug}`}
                className="work-item group cursor-pointer interactive"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-3 border border-white/5 cinematic-shadow">
                  <img
                    src={resolveMediaUrl(project.heroImage)}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-bold text-white">
                        View
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-ayuta-pink pt-2 mb-2 flex items-center gap-1.5">
                  <span className="text-ayuta-pink text-[10px]">▸</span>
                  <span className="text-ayuta-pink text-[9px] uppercase tracking-[0.3em] font-bold">
                    {project.category}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-display font-medium uppercase tracking-tight leading-tight max-w-[80%]">
                    {project.title}
                  </h3>
                  <span className="text-white/20 font-display italic text-sm md:text-base shrink-0">
                    {project.year}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Partner logo ticker — rendered after the project cards */}
      <PartnerMarquee />
    </main>
  );
}