"use client";

import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PartnerSection from "@/sections/PartnerSection";
import { useSiteContent } from "@/context/SiteContentContext";
import { resolveMediaUrl } from "@/lib/api";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Data structure updated based on the image content
type TeamMember = {
  id: string | number;
  title: string;
  body: string;
  image: string;
};

// TriangleSVG helper for visual indicators
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

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { items } = useSiteContent();

  const teamMembers = useMemo<TeamMember[]>(() => {
    if (!Array.isArray(items.member)) return [];
    return items.member.map((item) => ({
      id: item.id || `member-${item.slug}`,
      title: item.title,
      body: item.body,
      image: resolveMediaUrl(item.image),
    }));
  }, [items.member]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".about-stagger");

      if (!elements.length) return;

      gsap.from(elements, {
        y: 44,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, containerRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [teamMembers.length]); // Only refresh on data load

  // Perf: Refesh ScrollTrigger on image load for stable measurements
  useEffect(() => {
    let cancelled = false;

    const refreshOnce = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    const imgs = Array.from(containerRef.current?.querySelectorAll("img") ?? []);

    if (imgs.length === 0) {
      const t = setTimeout(refreshOnce, 300);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    let pending = imgs.length;
    const onDone = () => {
      pending -= 1;
      if (pending <= 0) refreshOnce();
    };

    imgs.forEach((img) => {
      if (img.complete) {
        onDone();
      } else {
        img.addEventListener("load", onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      }
    });

    const failSafe = setTimeout(refreshOnce, 2000);

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      imgs.forEach((img) => {
        img.removeEventListener("load", onDone);
        img.removeEventListener("error", onDone);
      });
    };
  }, [teamMembers.length]);

  return (
    <main ref={containerRef} className="bg-black pt-32 md:pt-40">
      {/* 1. Header Section - updated style like Arino image_da506e.png header */}
      <div className="mx-auto max-w-7xl px-6">
        <section className="about-stagger mb-16 text-center md:mb-20">
          <h1 className="font-display text-5xl font-bold tracking-tighter text-white sm:text-6xl md:text-7xl">
            Our Team
          </h1>
          <nav className="text-white/60 text-sm md:text-base mt-2 flex items-center justify-center gap-2">

            {/* <span className="text-ayuta-pink font-bold">OUR TEAM</span> */}
          </nav>
        </section>

        {/* 2. Intro Section - updated styling for "Awesome team members" */}
        <section className="about-stagger max-w-2xl mx-auto mb-20 text-center md:mb-28">

          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Awesome team members
          </h2>
        </section>

        {/* 3. Team Grid - repurposed to display member portraits with grayscale and hover effects */}
        {teamMembers.length > 0 && (
          <section className="mb-28 md:mb-40 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
            {teamMembers.map((member, i) => (
              <article
                key={member.id}
                className="about-stagger group relative overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <div className="absolute inset-0">
                  <img
                    src={member.image}
                    alt={member.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-start">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {member.title || "Untitled"}
                  </h3>
                  <p className="leading-relaxed text-white text-sm">
                    {member.body || ""}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {/* 4. CTA SECTION - full width section with background, graphic and link, using user color logic */}


      {/* 5. Partner Section - retained below the main photo content area */}

      <section className="w-full bg-[#080808] border-t border-white/5 py-24 relative px-6">
        {/* Replace red triangle indicators with pink ones */}
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 opacity-60">
          <TriangleSVG className="w-3 h-3 text-ayuta-pink" />
        </div>
        <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 opacity-60">
          <TriangleSVG className="w-3 h-3 text-ayuta-pink" />
        </div>
        <div className="absolute left-1/2 bottom-1/4 -translate-x-1/2 translate-y-1/2 opacity-60">
          <TriangleSVG className="w-3 h-3 text-ayuta-pink" />
        </div>

        <div className="about-stagger mx-auto max-w-4xl text-center">
          <h2 className="mb-10 font-display text-4xl font-medium leading-snug tracking-tighter text-white sm:text-5xl md:text-6xl">
            Let's disscuse make <br /> something{" "}
            <span className="bg-gradient-to-r from-ayuta-pink to-ayuta-primary bg-clip-text italic text-transparent">
              cool
            </span>{" "}
            together
          </h2>
          {/* Link uses pink and tracking updated */}
          <a
            href="#"
            className="group inline-flex items-center gap-2.5 text-ayuta-pink text-sm uppercase font-bold tracking-[0.3em] hover:text-white transition-colors"
          >
            Apply For Meeting
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </section>
    </main>
  );
}