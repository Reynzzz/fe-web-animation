import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { motion } from "motion/react";
import { debouncedScrollRefresh } from "@/utils/scrollRefresh";
import { useSiteContent } from "@/context/SiteContentContext";
import { resolveMediaUrl } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function WorkDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { projects, loading } = useSiteContent();

  const project = projects.find(
    (p) => p.slug.toLowerCase() === slug?.toLowerCase()
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;

    const refreshScrollTrigger = () => debouncedScrollRefresh(200);

    window.addEventListener("load", refreshScrollTrigger);
    window.addEventListener("resize", refreshScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(".hero-image", {
        yPercent: 50,
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(".hero-content", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.from(".project-title span", {
        y: 200,
        rotate: 10,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "expo.out",
      });

      gsap.from(".detail-stagger", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".detail-stagger",
          start: "top 80%",
          invalidateOnRefresh: true,
        },
      });

      if (horizontalRef.current && horizontalContainerRef.current) {
        gsap.to(horizontalRef.current, {
          x: () => {
            if (!horizontalRef.current) return 0;
            return -(horizontalRef.current.scrollWidth - window.innerWidth);
          },
          ease: "none",
          scrollTrigger: {
            trigger: horizontalContainerRef.current,
            start: "top top",
            end: () => {
              if (!horizontalRef.current) return "+=0";
              return `+=${horizontalRef.current.scrollWidth - window.innerWidth}`;
            },
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray(".detail-stat-value").forEach((stat: any) => {
        gsap.from(stat, {
          innerText: 0,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            invalidateOnRefresh: true,
          },
        });
      });
    }, containerRef);

    debouncedScrollRefresh(500);

    return () => {
      window.removeEventListener("load", refreshScrollTrigger);
      window.removeEventListener("resize", refreshScrollTrigger);
      ctx.revert();
    };
  }, [project]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-ayuta-pink" />
        <p className="mt-4 font-display">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <h1 className="text-4xl mb-4 font-display">Project Not Found</h1>
        <p className="text-white/40">
          The project slug "{slug}" does not exist.
        </p>

        <button
          onClick={() => navigate("/works")}
          className="mt-8 text-white hover:text-ayuta-pink transition-colors"
        >
          Back to Works
        </button>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextIndex];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="bg-[#050505] min-h-screen text-[#F5F5F5]"
    >
      <button
        onClick={() => navigate(-1)}
        className="fixed top-10 left-10 z-50 p-4 rounded-full border border-white/10 glass-panel hover:bg-white hover:text-black transition-all duration-500 group overflow-hidden"
      >
        <ArrowLeft className="relative z-10 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="hero-image absolute inset-0">
          <img
            src={resolveMediaUrl(project.heroImage)}
            alt={project.title}
            decoding="async"
            onLoad={() => debouncedScrollRefresh()}
            className="w-full h-full object-cover grayscale brightness-50"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        <div className="hero-content absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-ayuta-pink text-xs md:text-sm uppercase tracking-[0.6em] font-bold mb-6 md:mb-8 opacity-60">
            {project.category} / {project.year}
          </span>

          <h1 className="project-title text-[12vw] sm:text-[10vw] font-display font-medium leading-[0.9] tracking-tighter flex flex-wrap justify-center overflow-hidden">
            {project.title.split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-[0.2em]">
                {word}
              </span>
            ))}
          </h1>
        </div>

        <div className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-12 md:right-12 flex justify-between items-end opacity-40 text-[8px] sm:text-[10px]">
          <div className="uppercase tracking-[0.4em] font-bold">
            Role: {project.role}
          </div>

          <div className="uppercase tracking-[0.4em] font-bold">
            Client: {project.client}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 md:py-40 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="detail-stagger">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-ayuta-pink font-bold mb-6 md:mb-8">
              THE CHALLENGE
            </h2>

            <p className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight tracking-tight text-white/80">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-12 detail-stagger">
            {project.stats.map((stat, i) => {
              const numberValue = parseInt(stat.value);
              const suffix = stat.value.includes("M")
                ? "M"
                : stat.value.includes("%")
                ? "%"
                : "";

              return (
                <div key={i}>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-white/30 block mb-3 md:mb-6">
                    {stat.label}
                  </span>

                  <div className="text-4xl sm:text-5xl md:text-7xl font-display font-medium italic">
                    <span
                      className="detail-stat-value"
                      data-value={numberValue}
                    >
                      {numberValue}
                    </span>
                    {suffix}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fullscreen Sticky Image */}
      <section className="h-[60vh] sm:h-screen relative overflow-hidden bg-white/5 border-y border-white/5 group">
        <motion.div
          initial={{ clipPath: "inset(10% 10% 10% 10%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-full"
        >
          <img
            src={resolveMediaUrl(project.gallery[0])}
            alt="Process"
            loading="lazy"
            decoding="async"
            onLoad={() => debouncedScrollRefresh()}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3000ms]"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h3 className="text-6xl sm:text-8xl md:text-[12rem] font-display font-bold tracking-tighter text-white/10 mix-blend-overlay">
            PROCESS.
          </h3>
        </div>
      </section>

      {/* Horizontal Gallery */}
      <section
        ref={horizontalContainerRef}
        className="h-auto md:h-screen bg-[#050505] overflow-hidden py-16 md:py-0"
      >
        {/* Mobile View: Vertical list of gallery images */}
        <div className="block md:hidden px-4 space-y-8">
          <div className="flex flex-col gap-4 mb-8">
            <h4 className="text-4xl font-display font-bold text-white/10 tracking-tighter">
              GALLERY /
            </h4>
            <p className="text-base text-white/40 font-light">
              We explored various textures and motion patterns to ensure the
              brand felt alive across all touchpoints.
            </p>
          </div>

          {project.gallery.slice(1).map((img, i) => (
            <div
              key={i}
              className="w-full h-[40vh] rounded-[1.5rem] overflow-hidden border border-white/5 cinematic-shadow"
            >
              <img
                src={resolveMediaUrl(img)}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                decoding="async"
                onLoad={() => debouncedScrollRefresh()}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          ))}

          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <span className="text-[9px] uppercase tracking-[0.8em] text-white/20">
              Next Evolution
            </span>
            <h4 className="text-3xl italic font-light tracking-tighter">
              FINISHING TOUCHES.
            </h4>
          </div>
        </div>

        {/* Desktop View: Horizontal scroll-driven gallery */}
        <div
          ref={horizontalRef}
          className="hidden md:flex h-full items-center px-[10vw] gap-[5vw] whitespace-nowrap"
        >
          <div className="min-w-[40vw] flex flex-col gap-8">
            <h4 className="text-[8vw] font-display font-bold text-white/10 tracking-tighter">
              GALLERY /
            </h4>

            <p className="text-xl text-white/40 max-w-md whitespace-normal font-light">
              We explored various textures and motion patterns to ensure the
              brand felt alive across all touchpoints.
            </p>
          </div>

          {project.gallery.slice(1).map((img, i) => (
            <div
              key={i}
              className="min-w-[60vw] h-[70vh]  overflow-hidden border border-white/5 cinematic-shadow"
            >
              <img
                src={resolveMediaUrl(img)}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                decoding="async"
                onLoad={() => debouncedScrollRefresh()}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          ))}

          <div className="min-w-[40vw] flex flex-col items-center justify-center gap-12">
            <span className="text-[10px] uppercase tracking-[1em] text-white/20">
              Next Evolution
            </span>

            <h4 className="text-6xl italic font-light tracking-tighter">
              FINISHING TOUCHES.
            </h4>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="py-32 md:py-60 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ayuta-primary/20 blur-[150px] rounded-full pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-5xl sm:text-7xl md:text-[8rem] font-display font-medium tracking-tighter mb-10 md:mb-16 leading-[0.9]">
            NEXT <br />
            <span className="italic font-light">PROJECT.</span>
          </h2>

          <MagneticButton
            onClick={() => navigate(`/works/${nextProject.slug}`)}
            className="bg-[#F5F5F5] text-black border-none px-10 md:px-16 py-6 md:py-8 text-lg md:text-xl font-bold"
          >
            {nextProject.title}
            <ArrowUpRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
          </MagneticButton>
        </div>
      </section>
    </motion.div>
  );
}