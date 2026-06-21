import React, { useEffect, Suspense, lazy } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SiteContentProvider } from "@/context/SiteContentContext";

// Lazy-load the heavy Three.js background so it doesn't block initial render
const BackgroundAtmosphere = lazy(() => import("@/components/BackgroundAtmosphere"));

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // ScrollTrigger.refresh() is handled by SmoothScroll component on route changes
  }, [location.pathname]);

  return (
    <SiteContentProvider>
      <div className="relative min-h-screen bg-[#050505] text-white overflow-clip">
        <PageTransition />
        <Suspense fallback={null}>
          <BackgroundAtmosphere />
        </Suspense>

        <div className="relative z-10">
          <Navbar />

          <main className="min-h-screen">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SiteContentProvider>
  );
}