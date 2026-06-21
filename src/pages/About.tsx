"use client";

import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ZoomParallax from "@/components/ZoomParallax";
import ExpandOnHoverLamp from "@/components/MemberBackground";
import PartnerSection from "@/sections/PartnerSection";
import { useSiteContent } from "@/context/SiteContentContext";
import { resolveMediaUrl } from "@/lib/api";

gsap.registerPlugin(ScrollTrigger);

type AboutValue = {
  id?: string | number;
  title?: string;
  body?: string;
};

type ParallaxImage = {
  src: string;
  alt: string;
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { items } = useSiteContent();

  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  const values = useMemo<AboutValue[]>(() => {
    return Array.isArray(items.about_value) ? items.about_value : [];
  }, [items.about_value]);

  const parallaxImages = useMemo<ParallaxImage[]>(() => {
    if (!Array.isArray(items.about_parallax)) return [];

    return items.about_parallax
      .map((item: any) => {
        const src = resolveMediaUrl(item.image);

        return {
          src,
          alt: item.metadata?.alt || item.title || "About image",
        };
      })
      .filter((item) => Boolean(item.src))
      // ZoomParallax's layout positions are hand-tuned for exactly 7
      // slots (index 0-6). Anything beyond that loops back via
      // `index % scales.length` inside ZoomParallax and stacks extra
      // motion.div + useTransform scroll listeners on top of the
      // existing 7, with no extra layout room for them — pure added
      // scroll-tracking cost with a visually broken result. Cap here.
      .slice(0, 7);
  }, [items.about_parallax]);

  const heroImage = parallaxImages[0]?.src;
  const hasTeamSection = Array.isArray(items.member) && items.member.length > 0;
  const hasParallaxSection = parallaxImages.length > 0;

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
  }, [values.length, parallaxImages.length, hasTeamSection, hasParallaxSection]);

  // Refresh ScrollTrigger once content/images are likely settled, instead
  // of repeatedly: refresh() is a full re-measure of every ScrollTrigger
  // on the page, and calling it 4x in the first 1.5s on top of whatever
  // ZoomParallax/ExpandOnHoverLamp register themselves compounds fast as
  // more triggers exist further down the page — this was the main reason
  // scroll lag got worse the further down you scrolled.
  useEffect(() => {
    let cancelled = false;

    const refreshOnce = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    // Wait for images to finish loading (or fail) rather than guessing
    // with fixed timeouts. Falls back to a single delayed refresh if
    // there are no images to wait on.
    const imgs = Array.from(
      containerRef.current?.querySelectorAll("img") ?? []
    );

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

    // Safety net in case some image neither loads nor errors in time.
    const failSafe = setTimeout(refreshOnce, 2000);

    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      imgs.forEach((img) => {
        img.removeEventListener("load", onDone);
        img.removeEventListener("error", onDone);
      });
    };
  }, [values.length, parallaxImages.length, hasTeamSection, hasParallaxSection]);

  return (
    <main ref={containerRef} className="bg-black px-6 pb-20 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <section className="mb-28 md:mb-40">
            <h1 className="about-stagger mb-10 font-display text-6xl font-bold leading-none tracking-tighter text-white sm:text-7xl md:mb-12 md:text-[12rem]">
              OUR <br />
              <span className="bg-gradient-to-r from-ayuta-pink to-ayuta-primary bg-clip-text italic text-transparent">
                ESSENCE.
              </span>
            </h1>

            <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-2 md:gap-20">
              <p className="about-stagger max-w-2xl text-xl font-light leading-relaxed text-white/60 md:text-2xl">
                AYUTA is a Tokyo-based digital creative agency. Since 2024,
                we've been redefining how humans interact with brands through
                cinematic digital art.
              </p>

              {heroImage && (
                <div className="about-stagger relative aspect-video overflow-hidden rounded-3xl bg-white/[0.04]">
                  {!isHeroLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />
                  )}

                  <img
                    src={heroImage}
                    alt="Studio"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onLoad={() => setIsHeroLoaded(true)}
                    className={[
                      "h-full w-full object-cover grayscale transition-all duration-700",
                      isHeroLoaded
                        ? "opacity-100 blur-0"
                        : "opacity-0 blur-md",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>
          </section>

          {values.length > 0 && <CorePhilosophy values={values} />}
        </div>

        {hasTeamSection && (
          <section className="w-full">
            <ExpandOnHoverLamp />
          </section>
        )}
     <PartnerSection />
        {hasParallaxSection && (
          <section className="relative w-full">
            <ZoomParallax images={parallaxImages} />
          </section>
        )}

   
      </main>
  );
}

const CorePhilosophy = memo(function CorePhilosophy({
  values,
}: {
  values: AboutValue[];
}) {
  return (
    <section className="mb-28 md:mb-40">
      <h2 className="about-stagger mb-12 text-center font-display text-3xl text-white md:mb-20 md:text-4xl">
        Core Philosophy
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {values.map((val, i) => (
          <article
            key={val.id || `about-value-${i}`}
            className="about-stagger group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md md:p-8"
          >
            <div className="absolute inset-0 bg-ayuta-primary opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

            <div className="relative z-10">
              <div className="mb-4 font-display text-4xl text-ayuta-pink">
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {val.title || "Untitled"}
              </h3>

              <p className="leading-relaxed text-white/45">
                {val.body || ""}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
});