import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * LoadingScreen that waits for the API data to be fetched before revealing the site.
 * It listens for a custom "site-content-ready" event dispatched by SiteContentContext
 * and shows a smooth progress animation while waiting.
 */
export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [dataReady, setDataReady] = useState(false);

  // Listen for the custom event dispatched when site content finishes loading
  useEffect(() => {
    const onReady = () => setDataReady(true);
    window.addEventListener('site-content-ready', onReady);

    // Fallback: if content loads before this component mounts
    if ((window as any).__siteContentReady) {
      setDataReady(true);
    }

    return () => window.removeEventListener('site-content-ready', onReady);
  }, []);

  // Simulate progress bar, but hold at 85% until data is actually ready
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (dataReady) {
          // Data is ready — rush to 100%
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setLoading(false), 400);
            return 100;
          }
          return Math.min(100, prev + 12);
        }

        // Data not ready — climb slowly and cap at 85%
        if (prev >= 85) return 85;
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [dataReady]);

  // Safety timeout: remove loading screen after 6 seconds no matter what
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 6000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-12"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-full max-w-lg px-6">
            <div className="overflow-hidden mb-12 text-center">
              <motion.h2
                className="text-2xl md:text-3xl font-display font-medium tracking-[0.5em] text-[#F5F5F5]"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                Loading Assets...
              </motion.h2>
            </div>

            <div className="relative h-[1px] w-full bg-white/5 overflow-hidden mb-8">
              <motion.div
                className="absolute inset-0 bg-[#F5F5F5] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between items-center text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-white/30">
         
              <div className="font-mono text-[#F5F5F5]">
                {Math.min(progress, 100).toString().padStart(3, '0')}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
