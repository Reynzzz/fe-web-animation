import React from 'react';
import { motion } from 'motion/react';
import { useSiteContent } from '@/context/SiteContentContext';
import { resolveMediaUrl } from '@/lib/api';

export default function PhilosophySection() {
  const { items } = useSiteContent();
  const philosophyItems = items.philosophy || [];

  if (philosophyItems.length === 0) return null;

  // 1. Menyiapkan array dinamis untuk menampilkan semua data
  const bottomRow = [];
  
  // Mencari titik tengah untuk meletakkan tombol CTA
  const middleIndex = Math.floor(philosophyItems.length / 2);

  philosophyItems.forEach((item, index) => {
    // Sisipkan tombol CTA tepat saat mencapai titik tengah array
    if (index === middleIndex) {
      bottomRow.push({ type: 'cta', id: 'cta-button' });
    }

    // Masukkan data gambar dengan bentuk selang-seling (genap = lingkaran, ganjil = kotak lengkung)
    bottomRow.push({
      type: 'image',
      shape: index % 2 === 0 ? 'circle' : 'rect',
      item: item,
      id: item.id || `img-${index}`,
    });
  });

  return (
    <section className="relative min-h-screen bg-[#050505] overflow-hidden flex flex-col justify-between pt-24 pb-12">
      
      {/* TOP SECTION (Teks Kiri & Tombol Kanan) */}
      <div className="relative z-20 flex flex-col-reverse md:flex-row justify-between items-start px-6 md:px-12 gap-8 md:gap-0">
        
        {/* Teks Deskripsi (Kiri) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 md:gap-12 max-w-2xl mt-4 md:mt-12"
        >
          <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-[240px] font-light">
            We are a creative agency that helps brands stand out through cinematic digital art and meaningful experiences.
          </p>
          <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-[240px] font-light">
            Our ecosystem is built on innovation, strategic design, and pushing the boundaries of digital interactions.
          </p>
        </motion.div>

        {/* Tombol Lingkaran (Kanan) */}
        <motion.a 
          href="#" 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
          className="group w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/20 flex flex-col items-center justify-center text-center p-4 hover:border-ayuta-pink transition-colors duration-500 shrink-0 self-end md:self-auto"
        >
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest group-hover:text-ayuta-pink transition-colors">
              Explore
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-ayuta-pink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
          <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest group-hover:text-ayuta-pink transition-colors">
            New <br /> Collection
          </span>
        </motion.a>
      </div>

      {/* GIANT TITLE (Tengah) */}
      <div className="relative z-10 flex justify-center w-full px-4 mt-8 md:-mt-12 mb-12 md:mb-0">
        <motion.h1 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="font-serif text-white text-center leading-[0.8] tracking-tighter text-[16vw] md:text-[14vw] select-none uppercase"
        >
          Ecosystem
        </motion.h1>
      </div>

      {/* AVATAR STRIP (Bawah) - Menggunakan flex-wrap agar aman jika data sangat banyak */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
        className="relative z-20 flex justify-center items-end gap-3 md:gap-5 px-6 flex-wrap md:-mt-10"
      >
        {bottomRow.map((el) => {
          
          // Render Tombol CTA
          if (el.type === 'cta') {
            return (
              <motion.a
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 30 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "backOut" } }
                }}
                key={el.id}
                href="#"
                className="group w-32 h-32 md:w-44 md:h-44 rounded-full bg-ayuta-pink flex flex-col items-center justify-center text-white shrink-0 hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(255,105,180,0.3)] z-30"
              >
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  <div className="absolute top-6 right-8 w-6 h-6 md:w-10 md:h-10 bg-black/20 rounded-full" />
                  
                  <div className="flex items-start gap-1 z-10">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-center leading-tight mt-4">
                      See <br /> Catalog
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </motion.a>
            );
          }

          // Render Gambar (Lingkaran atau Kotak Melengkung)
          const isCircle = el.shape === 'circle';
          return (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              key={el.id}
              className={`overflow-hidden border border-white/10 shrink-0 bg-white/5 relative group ${
                isCircle 
                  ? 'w-24 h-24 md:w-50 md:h-50 rounded-full' 
                  : 'w-24 h-32 md:w-50 md:h-50 rounded-[2rem]'
              }`}
            >
              <img
                src={resolveMediaUrl(el.item.image)}
                alt={el.item.title || 'Philosophy Image'}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110"
              />
            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
}