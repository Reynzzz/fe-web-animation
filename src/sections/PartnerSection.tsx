import React from 'react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

export default function PartnerSection() {
  const { items } = useSiteContent();
  const partners = items.partner || [];

  if (partners.length === 0) return null;

  // Memecah array partners menjadi kelompok-kelompok berisi 3 item (untuk grid baris)
  const partnerRows = [];
  for (let i = 0; i < partners.length; i += 3) {
    partnerRows.push(partners.slice(i, i + 3));
  }

  return (
    <section className="py-24 bg-[#050505] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Kolom Kiri: Teks & Deskripsi */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-ayuta-pink text-xs tracking-[0.2em] uppercase mb-6 font-bold">
              / Our Client
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-6">
              Brands<br />We Collaborate With
            </h2>
            <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-md font-light">
              We partner with forward-thinking brands and organizations
              across industries to create meaningful experiences
              that connect and make an impact.
            </p>
          </div>

          {/* Kolom Kanan: Grid Logo Klien */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="flex flex-col border-t border-white/20">
              {partnerRows.map((row, rowIndex) => (
                <div 
                  key={rowIndex} 
                  className="flex flex-wrap justify-center border-b border-white/20"
                >
                  {row.map((partner, index) => (
                    <div 
                      key={partner.id || index} 
                      className="w-1/2 md:w-1/3 flex items-center justify-center py-8 md:py-0 px-3"
                    >
                      <img
                        src={resolveMediaUrl(partner.image)}
                        alt={partner.title || 'Partner Logo'}
                        loading="lazy"
                        className="h-20 md:h-28 lg:h-40 w-[95%] max-w-[240px] object-cover opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-500 filter grayscale hover:grayscale-0 contrast-200 brightness-200 hover:contrast-100 hover:brightness-100"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}