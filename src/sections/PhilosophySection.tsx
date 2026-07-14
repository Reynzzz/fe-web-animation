import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

const brandNames = [
  "Baitee Park",
  "Ayuta Bus Rental",
  "Tjikinii Lima",
  "Carita Merchandise",
  "Ayuta Workshop Production"
];

export default function PhilosophySection() {
  const { items } = useSiteContent();
  const philosophyItems = items.philosophy || [];

  // Pull up to 3 items from the CMS
  const displayItems = philosophyItems.slice(0, 3).map((item: any, idx: number) => ({
    id: item.id || `brand-${idx}`,
    name: item.subtitle || `-`,
    linkIg: item.title || '',
    linkWa: item.body || '',
    image: item.image || '',
  }));

  // Ensure there are always exactly 3 boxes (placeholders)
  while (displayItems.length < 3) {
    displayItems.push({
      id: `dummy-${displayItems.length}`,
      name: `-`,
      linkIg: '',
      linkWa: '',
      image: '',
    });
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Main Block: Full-width Black Rectangle */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full bg-[#080808] text-white px-6 md:px-12 lg:px-20 py-20 md:py-32 flex flex-col items-center justify-center relative shadow-2xl border-t border-b border-white/5"
      >
          {/* Subtle background circles for design flair */}
          <div className="absolute -right-10 top-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-ayuta-pink/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="font-serif text-center uppercase leading-[0.85] tracking-tighter text-6xl md:text-8xl lg:text-[8rem] mb-16 relative z-10 flex flex-col">
            <span>Our Ecosystem</span>
            
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 w-full max-w-4xl relative z-10">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + (i * 0.1), ease: "easeOut" }}
                className="group flex flex-col items-center gap-4"
              >
                {item.linkIg || item.linkWa ? (
                  <a 
                    href={item.linkIg || (item.linkWa.startsWith('http') ? item.linkWa : `https://wa.me/${item.linkWa.replace(/\\D/g, '')}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden relative border border-white/10 group-hover:border-ayuta-pink/50 transition-colors duration-500 block cursor-pointer"
                  >
                    {item.image ? (
                      <img 
                        src={resolveMediaUrl(item.image)} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm font-medium">
                        Foto Brand
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="w-full aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden relative border border-white/10 group-hover:border-ayuta-pink/50 transition-colors duration-500">
                    {item.image ? (
                      <img 
                        src={resolveMediaUrl(item.image)} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm font-medium">
                        Foto Brand
                      </div>
                    )}
                  </div>
                )}
              
                {/* Brand Name */}
               
              </motion.div>
            ))}
          </div>
        </motion.div>

    </section>
  );
}