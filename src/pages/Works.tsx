import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

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
    <main className="pt-40 pb-20 px-6 bg-[#050505] min-h-screen text-white">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        <h1 className="text-7xl md:text-[10rem] font-display font-bold tracking-tighter mb-20">
          SELECTED <span className="text-white/20 italic">WORKS.</span>
        </h1>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-10 h-10 animate-spin text-ayuta-pink" />
            <span className="ml-4 font-display">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-white/40 py-20 font-display">
            No projects available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project) => (
              <Link 
                key={project.id} 
                to={`/works/${project.slug}`}
                className="work-item group cursor-pointer interactive"
              >
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 border border-white/5 cinematic-shadow">
                  <img 
                    src={resolveMediaUrl(project.heroImage)} 
                    alt={project.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">View Project</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-ayuta-pink text-[10px] uppercase tracking-[0.4em] font-bold block mb-2">{project.category}</span>
                    <h3 className="text-4xl font-display font-medium tracking-tight">{project.title}</h3>
                  </div>
                  <span className="text-white/20 font-display italic text-2xl">{project.year}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
