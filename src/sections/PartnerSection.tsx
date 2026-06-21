import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

export default function PartnerSection() {
  const { items } = useSiteContent();
  const partners = items.partner || [];

  if (partners.length === 0) return null;

  // Duplicate 4 times to guarantee full width coverage and seamless infinite looping
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-24 bg-[#050505] overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-center font-display text-sm uppercase tracking-widest text-white/30">
          Our Global Partners
        </h2>
      </div>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Soft edge blur gradients for high-end look */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap items-center select-none"
          animate={{ x: ['0%', '-25%'] }}
          transition={{
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id || index}-${index}`}
              className="inline-block px-12 md:px-16 flex-shrink-0"
            >
              <img
                src={resolveMediaUrl(partner.image)}
                alt={partner.title || 'Partner Logo'}
                className="h-8 md:h-12 w-auto object-contain opacity-25 hover:opacity-100 hover:scale-105 transition-all duration-300 filter brightness-0 invert"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
