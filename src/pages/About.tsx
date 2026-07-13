"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteContent } from "@/context/SiteContentContext";
import { resolveMediaUrl } from "@/lib/api";
import { ArrowUpRight } from "lucide-react";
import PhilosophySection from "@/sections/PhilosophySection";

gsap.registerPlugin(ScrollTrigger);

type TeamMember = {
  id: string | number;
  title: string;
  body: string;
  image: string;
};

const TriangleSVG = ({ className }: { className?: string }) => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6.5 0L12.9952 11.25H0.00480938L6.5 0Z" fill="currentColor" />
  </svg>
);

const AUTOPLAY_INTERVAL = 2500; // ms — advance one photo every 2.5s
const RESUME_DELAY = 2000; // ms — pause autoplay this long after user interacts

function MarqueeCarousel({
  members,
  isDark = true,
  autoplayOffset = 0,
}: {
  members: TeamMember[];
  isDark?: boolean;
  /** Extra delay (ms) before this carousel's first auto-advance, so multiple
   * carousels on the same page don't all shift at the exact same moment. */
  autoplayOffset?: number;
}) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLElement[]>([]);
  const xPos = useRef(0);
  const currentIndex = useRef(0);
  const singleSetWidth = useRef(0);
  const stepWidth = useRef(0);

  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startX = useRef(0);

  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const textColor = isDark ? "text-white" : "text-black";
  const subtextColor = isDark ? "text-white/60" : "text-black/60";
  const bgPlaceholder = isDark ? "bg-[#1a1a1a]" : "bg-gray-100";

  // Measure the exact distance between two consecutive items (item width + gap)
  // so each step shifts precisely one photo — no drift from averaging.
  const measureStep = useCallback(() => {
    if (itemRefs.current.length < 2) return 0;
    const a = itemRefs.current[0];
    const b = itemRefs.current[1];
    if (!a || !b) return 0;
    return b.offsetLeft - a.offsetLeft;
  }, []);

  const measure = useCallback(() => {
    if (!itemRefs.current.length || members.length === 0) return 0;
    const first = itemRefs.current[0];
    const last = itemRefs.current[members.length - 1];
    if (!first || !last) return 0;
    return last.offsetLeft + last.offsetWidth - first.offsetLeft;
  }, [members.length]);

  const goToNext = useCallback(
    (smooth = true) => {
      if (!marqueeRef.current || members.length === 0) return;
      const width = singleSetWidth.current || measure();
      const step = stepWidth.current || measureStep();
      if (!width || !step) return;
      singleSetWidth.current = width;
      stepWidth.current = step;

      currentIndex.current += 1;
      let target = -(currentIndex.current * step);

      tween.current?.kill();
      tween.current = gsap.to(xPos, {
        current: target,
        duration: smooth ? 0.7 : 0,
        ease: "power3.inOut",
        onUpdate: () => {
          if (!marqueeRef.current) return;
          marqueeRef.current.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
        },
        onComplete: () => {
          // Seamless wrap: once we've scrolled a full set, reset instantly
          if (Math.abs(xPos.current) >= width) {
            xPos.current += width;
            currentIndex.current = 0;
            if (marqueeRef.current) {
              gsap.set(marqueeRef.current, { x: xPos.current });
            }
          }
        },
      });
    },
    [members.length, measure, measureStep]
  );

  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    autoplayTimer.current = setInterval(() => goToNext(true), AUTOPLAY_INTERVAL);
  }, [goToNext]);

  const pauseAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(startAutoplay, RESUME_DELAY);
  }, [startAutoplay]);

  useEffect(() => {
    if (members.length === 0) return;
    // Let layout settle before measuring
    const raf = requestAnimationFrame(() => {
      singleSetWidth.current = measure();
      stepWidth.current = measureStep();
      // Stagger the first advance so multiple carousels don't move together,
      // then settle into the normal fixed-interval autoplay.
      resumeTimer.current = setTimeout(() => {
        goToNext(true);
        startAutoplay();
      }, AUTOPLAY_INTERVAL + autoplayOffset);
    });

    const onResize = () => {
      singleSetWidth.current = measure();
      stepWidth.current = measureStep();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      tween.current?.kill();
    };
  }, [members.length, measure, measureStep, startAutoplay, autoplayOffset, goToNext]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    tween.current?.kill();
    pauseAutoplay();
    startMouseX.current = e.clientX;
    startX.current = xPos.current;
    if (marqueeRef.current) {
      marqueeRef.current.style.cursor = "grabbing";
      marqueeRef.current.style.userSelect = "none";
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !marqueeRef.current) return;
    const delta = e.clientX - startMouseX.current;
    xPos.current = startX.current + delta;

    const width = singleSetWidth.current;
    if (width) {
      if (xPos.current <= -width) xPos.current += width;
      if (xPos.current > 0) xPos.current -= width;
    }
    marqueeRef.current.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
  };

  const handlePointerUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (marqueeRef.current) {
      marqueeRef.current.style.cursor = "grab";
      marqueeRef.current.style.userSelect = "auto";
    }
    pauseAutoplay();
  };

  if (members.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden relative cursor-grab touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrLeave}
      onPointerLeave={handlePointerUpOrLeave}
    >
      <div ref={marqueeRef} className="flex w-max will-change-transform">
        {[...Array(2)].map((_, wrapperIndex) => (
          <div key={wrapperIndex} className="flex gap-6 md:gap-8 px-3 md:px-4 shrink-0">
            {members.map((member, i) => (
              <article
                key={`${wrapperIndex}-${member.id}-${i}`}
                ref={(el) => {
                  if (wrapperIndex === 0 && el) itemRefs.current[i] = el;
                }}
                className="group flex flex-col w-[280px] md:w-[350px] shrink-0"
              >
                <div className={`relative overflow-hidden aspect-[4/5] mb-5 ${bgPlaceholder}`}>
                  <img
                    src={member.image}
                    alt={member.title || "Team Member"}
                    loading="lazy"
                    draggable="false"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col text-start">
                  <h3 className={`text-lg font-bold mb-1 pointer-events-none ${textColor}`}>
                    {member.title || "Member Name"}
                  </h3>
                  <p className={`text-sm font-light pointer-events-none ${subtextColor}`}>
                    {member.body || "Role"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const words = ["extraordinary", "meaningful", "unforgettable", "iconic"];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { items } = useSiteContent();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const { executiveTeam, leadershipTeam } = useMemo(() => {
    const rawTeam = items.member;
    if (!Array.isArray(rawTeam)) return { executiveTeam: [], leadershipTeam: [] };

    // Parse and naturally sort based on API's sortOrder
    const formattedTeam = rawTeam
      .map((item) => ({
        id: item.id || `member-${item.slug}`,
        title: item.title || "",
        body: item.subtitle || item.body || "",
        image: resolveMediaUrl(item.image),
        sortOrder: item.sortOrder || 0
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const execs: TeamMember[] = [];
    const leads: TeamMember[] = [];

    // Dynamically separate based on the API data (e.g. Directors go to Executive)
    formattedTeam.forEach(member => {
      const roleLower = member.body.toLowerCase();
      if (roleLower.includes("director")) {
        execs.push(member);
      } else {
        leads.push(member);
      }
    });

    return { executiveTeam: execs, leadershipTeam: leads };
  }, [items.member]);

  // Entrance animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".about-stagger");
      if (!elements.length) return;

      gsap.from(elements, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [executiveTeam.length, leadershipTeam.length]);

  return (
    <main ref={containerRef} className="bg-black pt-24 min-h-screen overflow-hidden">

      {/* Styles for Infinite Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 40s linear infinite;
        }
      `}</style>

      {/* 1. Top Text Marquee (Light Background) */}
      <div className="w-full overflow-hidden whitespace-nowrap py-10 md:py-20 border-b border-black/10">
        <div className="text-center">

          <span className="text-5xl md:text-8xl font-display text-center font-bold text-white" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}>
            &nbsp;AYUTA LEADERSHIP
          </span>

        </div>
      </div>



      {/* 3. Dark Executive Section */}
      <section className="bg-black py-10 md:py-20 w-full relative">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-12 lg:px-20 mb-5 about-stagger">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white uppercase  leading-tight">
              EXECUTIVE TEAM 
            </h2>
          </div>
        </div>
        <MarqueeCarousel members={executiveTeam} isDark={true} autoplayOffset={0} />
      </section>

      {/* 4. Light Leadership Section */}
      <section className="bg-black py-20 md:py-32 w-full relative border-t border-black/10">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-12 lg:px-20 mb-16 about-stagger">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <h2 className="font-display text-white text-4xl font-bold tracking-tight text-black uppercase max-w-xs leading-tight">
              LEADERSHIP TEAM
            </h2>
          </div>
        </div>
        <MarqueeCarousel members={leadershipTeam} isDark={true} autoplayOffset={2500} />
      </section>

      {/* 5. Bottom Text Marquee (Dark Background) */}
      <div className="w-full bg-black overflow-hidden ">
        {/* <div className="inline-block animate-marquee-slow">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="text-5xl md:text-8xl font-display font-bold text-transparent italic" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
              &nbsp;WORK WITH US - WORK WITH US - WORK WITH US - WORK WITH US - WORK WITH US -
            </span>
          ))}
        </div> */}
        <PhilosophySection/>
      </div>

      {/* 6. CTA SECTION */}
      <section className="w-full bg-[#080808] border-t border-white/10 py-32 relative px-6 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 opacity-30">
          <TriangleSVG className="w-4 h-4 text-white" />
        </div>
        <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 opacity-30">
          <TriangleSVG className="w-4 h-4 text-white" />
        </div>
        

        <div className="about-stagger mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center">
          <h2 className="mb-10 font-display text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl md:text-6xl flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            <span>Let's make something</span>
            <span className="relative inline-block w-[300px] md:w-[450px] h-[1.2em] ">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={words[wordIndex]}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 italic text-transparent bg-clip-text bg-gradient-to-r from-ayuta-pink to-purple-500 font-bold"
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>together.</span>
          </h2>
          <a
            href="/contact"
            className="group inline-flex items-center gap-3 text-white text-sm uppercase font-bold tracking-[0.2em] hover:text-white/70 transition-colors mt-4"
          >
            Contact Us
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </section>
    </main>
  );
}