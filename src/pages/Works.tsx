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
    <main className="pt-32 pb-16 px-4 sm:px-6 bg-[#050505] min-h-screen text-white">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-display font-bold tracking-tighter mb-10 md:mb-20">
          SELECTED <span className="text-white/20 italic">WORKS.</span>
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
       <div className="grid grid-cols-2 gap-3 md:gap-5">
  {projects.map((project) => (
    <Link 
      key={project.id} 
      to={`/works/${project.slug}`}
      className="work-item group cursor-pointer interactive"
    >
     

      {/* UBAH DI SINI: aspect-[3/4] diganti jadi aspect-[4/3] atau aspect-square agar lebih pendek */}
      <div className="relative aspect-[4/3] overflow-hidden mb-3 border border-white/5 cinematic-shadow">
        <img 
          src={resolveMediaUrl(project.heroImage)} 
          alt={project.title} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2">
            {/* Tombol view diperkecil sedikit */}
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
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
      <div className="flex justify-between items-start">
        {/* Ukuran teks judul diperkecil sedikit */}
        <h3 className="text-lg md:text-xl font-display font-medium uppercase tracking-tight leading-tight max-w-[80%]">
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
    </main>
  );
}
