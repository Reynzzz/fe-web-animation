import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import PageTransition from "@/components/PageTransition";
import { SiteContentProvider } from "@/context/SiteContentContext";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // ScrollTrigger.refresh() is handled by SmoothScroll component on route changes
  }, [location.pathname]);

  return (
    <SiteContentProvider>
      <div className="relative min-h-screen bg-[#050505] text-white overflow-clip">
        <PageTransition />
        <BackgroundAtmosphere />

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