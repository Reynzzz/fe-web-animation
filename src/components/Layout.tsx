import React, { useEffect, lazy } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { AnimatePresence, motion } from "motion/react";

// Lazy-load the heavy Three.js background so it doesn't block initial render
const BackgroundAtmosphere = lazy(() => import("@/components/BackgroundAtmosphere"));

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    // ScrollTrigger.refresh() is handled by SmoothScroll component on route changes
  }, [location.pathname]);

  return (
    <SiteContentProvider>
      <div className="relative min-h-screen bg-[#050505] text-white overflow-clip">
        <React.Suspense fallback={null}>
          <BackgroundAtmosphere />
        </React.Suspense>

        <div className="relative z-10">
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              className="min-h-screen"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <PageTransition />
              {outlet}
            </motion.div>
          </AnimatePresence>

          <Footer />
        </div>
      </div>
    </SiteContentProvider>
  );
}