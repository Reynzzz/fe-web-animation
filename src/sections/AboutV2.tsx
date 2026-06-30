import React, { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteContent } from "@/context/SiteContentContext";
import { resolveMediaUrl } from "@/lib/api";
import { ArrowUpRight, ArrowRight, Sparkles, Target, Users, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
type TeamMember = {
  id: string | number;
  title: string;
  body: string;
  image: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TriangleSVG = ({ className }: { className?: string }) => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6.5 0L12.9952 11.25H0.00480938L6.5 0Z" fill="currentColor" />
  </svg>
);

function useScrollReveal(ref: React.RefObject<HTMLElement | null>, selector: string, deps: unknown[] = []) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(selector);
      if (!elements.length) return;
      gsap.from(elements, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          once: true,
        },
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── Static fallback data ─────────────────────────────────────────────────────
const FALLBACK_STATS = [
  { value: "120+", label: "Projects Delivered" },
  { value: "80+",  label: "Happy Clients" },
  { value: "6",    label: "Years of Craft" },
  { value: "12",   label: "Awards Won" },
];

const COMPANY_VALUES = [
  {
    icon: Sparkles,
    title: "Creative Excellence",
    description:
      "We push past convention, blending art and technology to create work that genuinely surprises. Every pixel is intentional.",
  },
  {
    icon: Target,
    title: "Purposeful Precision",
    description:
      "Beautiful design must also perform. We obsess over every detail — from micro-interactions to load-time performance.",
  },
  {
    icon: Users,
    title: "True Collaboration",
    description:
      "Your vision is our brief. We work alongside you — not just for you — building transparency and trust at every step.",
  },
  {
    icon: Zap,
    title: "Relentless Impact",
    description:
      "We measure success by your outcomes: conversions, brand perception, and the moment someone says 'wow'.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function About() {
  const pageRef     = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLElement>(null);
  const missionRef  = useRef<HTMLElement>(null);
  const statsRef    = useRef<HTMLElement>(null);
  const valuesRef   = useRef<HTMLElement>(null);
  const teamRef     = useRef<HTMLElement>(null);
  const ctaRef      = useRef<HTMLElement>(null);

  const { items, settings } = useSiteContent();

  // ── Team members from CMS ──
  const teamMembers = useMemo<TeamMember[]>(() => {
    if (!Array.isArray(items.member)) return [];
    return items.member.map((item) => ({
      id:    item.id || `member-${item.slug}`,
      title: item.title,
      body:  item.body,
      image: resolveMediaUrl(item.image),
    }));
  }, [items.member]);

  // ── Stats: prefer CMS data, fallback to static ──
  const stats = useMemo(() => {
    const cmsStats = settings.achievements?.items;
    if (Array.isArray(cmsStats) && cmsStats.length) return cmsStats;
    return FALLBACK_STATS;
  }, [settings.achievements]);

  // ── Mission data from CMS overview (if available) ──
  const missionData = settings.about_overview;

  // ── Scroll animations ──
  useScrollReveal(heroRef,    ".hero-reveal",    []);
  useScrollReveal(missionRef, ".mission-reveal", [missionData]);
  useScrollReveal(statsRef,   ".stat-reveal",    [stats]);
  useScrollReveal(valuesRef,  ".value-reveal",   []);
  useScrollReveal(teamRef,    ".team-reveal",    [teamMembers.length]);
  useScrollReveal(ctaRef,     ".cta-reveal",     []);

  // ── Parallax on mission image ──
  useEffect(() => {
    if (!missionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".mission-parallax-img", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: missionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, missionRef);
    return () => ctx.revert();
  }, [missionData]);

  // ── ScrollTrigger refresh after images load ──
  useEffect(() => {
    let cancelled = false;
    const refreshOnce = () => { if (!cancelled) ScrollTrigger.refresh(); };
    const imgs = Array.from(pageRef.current?.querySelectorAll("img") ?? []);
    if (!imgs.length) { const t = setTimeout(refreshOnce, 300); return () => { cancelled = true; clearTimeout(t); }; }
    let pending = imgs.length;
    const onDone = () => { pending -= 1; if (pending <= 0) refreshOnce(); };
    imgs.forEach((img) => {
      if (img.complete) { onDone(); } else {
        img.addEventListener("load",  onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      }
    });
    const failSafe = setTimeout(refreshOnce, 2000);
    return () => {
      cancelled = true;
      clearTimeout(failSafe);
      imgs.forEach((img) => {
        img.removeEventListener("load",  onDone);
        img.removeEventListener("error", onDone);
      });
    };
  }, [teamMembers.length]);

  return (
    <main ref={pageRef} className="bg-black overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-end pb-20 pt-40 px-6 overflow-hidden bg-[#050505]"
      >
        {/* Background glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-ayuta-primary/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-ayuta-pink/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Eyebrow */}
        <div className="max-w-7xl mx-auto w-full">
          <p className="hero-reveal text-[10px] uppercase tracking-[0.6em] text-ayuta-pink font-bold mb-8">
            About Us
          </p>

          {/* Giant headline */}
          <h1 className="hero-reveal font-display text-[11vw] sm:text-[9vw] md:text-[7.5vw] font-semibold leading-[0.9] tracking-tighter text-white max-w-5xl">
            We craft digital{" "}
            <span className="italic font-light bg-gradient-to-r from-ayuta-primary to-ayuta-pink bg-clip-text text-transparent">
              experiences
            </span>{" "}
            that move people.
          </h1>

          {/* Sub text + scroll cue */}
          <div className="hero-reveal mt-12 flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-0 justify-between">
            <p className="text-lg md:text-xl text-white/40 max-w-sm leading-relaxed font-light">
              A creative studio at the intersection of design, motion, and technology — building brands that last.
            </p>
            <div className="flex items-center gap-3 text-white/20 text-[10px] uppercase tracking-[0.4em]">
              <span className="w-8 h-[1px] bg-white/20" />
              Scroll to explore
            </div>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. MISSION & STORY SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={missionRef}
        className="py-40 px-6 bg-black overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text side */}
          <div className="order-2 lg:order-1">
            <p className="mission-reveal text-[10px] uppercase tracking-[0.5em] text-ayuta-primary font-bold mb-8">
              {missionData?.eyebrow || "Our Mission"}
            </p>
            <h2 className="mission-reveal text-5xl md:text-6xl font-display font-medium tracking-tight mb-10 text-white leading-[1.1]">
              {missionData?.title
                ? missionData.title
                : <>Built to create <span className="italic font-light text-gradient-ayuta">meaningful</span> work.</>}
            </h2>
            <p className="mission-reveal text-lg md:text-xl text-white/40 mb-12 leading-relaxed font-light">
              {missionData?.body ||
                "We are a multidisciplinary creative studio founded on the belief that great design has the power to transform businesses. From brand strategy and identity to digital products and motion design — we partner with ambitious companies to tell their story in ways that resonate and endure."}
            </p>

            {/* Divider with label */}
            <div className="mission-reveal flex items-center gap-6 mb-12">
              <span className="w-12 h-[1px] bg-ayuta-pink/50" />
              <span className="text-[9px] uppercase tracking-[0.5em] text-white/20">Est. 2018 · Creative Studio</span>
            </div>

            <Link
              to="/contact"
              className="mission-reveal group inline-flex items-center gap-3 text-sm uppercase font-bold tracking-[0.3em] text-ayuta-pink hover:text-white transition-colors"
            >
              Work with us
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Image side */}
          <div className="order-1 lg:order-2 relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 cinematic-shadow">
            {missionData?.image ? (
              <img
                src={resolveMediaUrl(missionData.image)}
                alt="Studio environment"
                className="mission-parallax-img w-full h-[120%] object-cover"
              />
            ) : (
              /* Decorative placeholder when no image is set */
              <div className="w-full h-full bg-gradient-to-br from-ayuta-slate/30 via-ayuta-primary/10 to-ayuta-pink/5 flex items-center justify-center">
                <div className="text-center opacity-30 select-none">
                  <div className="text-[8vw] font-display font-bold tracking-tighter text-white leading-none">AY</div>
                  <div className="text-[8vw] font-display font-light italic tracking-tighter text-ayuta-pink leading-none">UTA</div>
                </div>
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {missionData?.imageCaption && (
              <div className="absolute bottom-10 left-10 text-ayuta-primary/40 italic font-light tracking-[0.5em] text-[10px] uppercase rotate-90 origin-left">
                {missionData.imageCaption}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. STATS SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="py-32 px-6 bg-[#050505] border-t border-b border-white/5 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-ayuta-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
            {stats.map((stat: { value: string | number; label: string; suffix?: string }, i: number) => (
              <div key={i} className="stat-reveal text-center md:text-left group">
                <div className="text-6xl md:text-8xl font-display font-medium tracking-tighter text-white mb-3 group-hover:text-gradient-ayuta transition-colors">
                  {stat.value}{stat.suffix || ""}
                </div>
                <div className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold">
                  {stat.label}
                </div>
                <div className="mt-6 w-8 h-[1px] bg-ayuta-pink/30 mx-auto md:mx-0 transition-all group-hover:w-16 group-hover:bg-ayuta-pink/60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. VALUES SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={valuesRef}
        className="py-40 px-6 bg-black relative overflow-hidden"
      >
        {/* Giant watermark text */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none opacity-[0.025]">
          <p className="text-[18vw] font-display font-bold tracking-tighter text-white whitespace-nowrap leading-none">
            VALUES
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section heading */}
          <div className="mb-20">
            <p className="value-reveal text-[10px] uppercase tracking-[0.5em] text-ayuta-primary font-bold mb-4">
              What We Stand For
            </p>
            <h2 className="value-reveal text-5xl md:text-7xl font-display font-medium tracking-tight text-white max-w-2xl leading-[1.05]">
              Principles that{" "}
              <span className="italic font-light text-gradient-ayuta">guide</span> every project.
            </h2>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <article
                  key={i}
                  className="value-reveal group relative rounded-2xl border border-white/8 bg-white/[0.02] p-8 hover:bg-white/[0.05] hover:border-ayuta-primary/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-ayuta-primary/0 via-transparent to-ayuta-pink/0 group-hover:from-ayuta-primary/5 group-hover:to-ayuta-pink/5 transition-all duration-500 pointer-events-none rounded-2xl" />

                  {/* Number */}
                  <div className="text-[10px] font-bold tracking-[0.4em] text-white/15 mb-6">
                    0{i + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-ayuta-primary/10 border border-ayuta-primary/20 flex items-center justify-center mb-6 group-hover:bg-ayuta-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-ayuta-primary" />
                  </div>

                  <h3 className="text-xl font-display font-semibold text-white mb-4 tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-light">
                    {val.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. TEAM MEMBERS SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      {teamMembers.length > 0 && (
        <section
          ref={teamRef}
          className="py-40 px-6 bg-[#050505] relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section heading */}
            <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <p className="team-reveal text-[10px] uppercase tracking-[0.5em] text-ayuta-primary font-bold mb-4">
                  The People
                </p>
                <h2 className="team-reveal text-5xl md:text-7xl font-display font-medium tracking-tight text-white leading-[1.05]">
                  Meet the{" "}
                  <span className="italic font-light text-gradient-ayuta">team.</span>
                </h2>
              </div>
              <p className="team-reveal text-base text-white/30 max-w-sm leading-relaxed font-light md:text-right">
                A diverse group of designers, developers, and strategists united by a shared obsession with craft.
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
              {teamMembers.map((member) => (
                <article
                  key={member.id}
                  className="team-reveal group relative overflow-hidden rounded-3xl aspect-[4/5] bg-white/5"
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img
                      src={member.image}
                      alt={member.title}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    {/* Accent line */}
                    <div className="w-0 h-[2px] bg-gradient-to-r from-ayuta-primary to-ayuta-pink mb-4 transition-all duration-500 group-hover:w-10 rounded-full" />
                    <h3 className="text-xl font-display font-bold text-white tracking-tight mb-1">
                      {member.title || "Untitled"}
                    </h3>
                    {member.body && (
                      <p className="text-sm text-white/50 font-light leading-snug">
                        {member.body}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          6. CTA SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative py-40 px-6 bg-[#080808] border-t border-white/5 overflow-hidden"
      >
        {/* Decorative triangles */}
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 opacity-40">
          <TriangleSVG className="w-3 h-3 text-ayuta-pink" />
        </div>
        <div className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 opacity-40">
          <TriangleSVG className="w-3 h-3 text-ayuta-pink" />
        </div>
        <div className="absolute left-1/2 bottom-1/4 -translate-x-1/2 translate-y-1/2 opacity-40">
          <TriangleSVG className="w-3 h-3 text-ayuta-pink" />
        </div>

        {/* Center ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-ayuta-primary/8 blur-[140px] rounded-full pointer-events-none" />

        <div className="cta-reveal mx-auto max-w-4xl text-center relative z-10">
          <p className="cta-reveal text-[10px] uppercase tracking-[0.5em] text-ayuta-primary font-bold mb-8">
            Let's Collaborate
          </p>
          <h2 className="cta-reveal mb-12 font-display text-5xl font-medium leading-snug tracking-tighter text-white sm:text-6xl md:text-7xl">
            Let's discuss and make <br />something{" "}
            <span className="bg-gradient-to-r from-ayuta-pink to-ayuta-primary bg-clip-text italic text-transparent">
              remarkable
            </span>{" "}
            together
          </h2>

          <div className="cta-reveal flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-white text-black text-sm uppercase font-bold tracking-[0.3em] px-10 py-5 rounded-full hover:bg-ayuta-pink hover:text-white transition-all duration-300"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:hello@ayuta.studio"
              className="group inline-flex items-center gap-2.5 text-white/50 text-sm uppercase font-bold tracking-[0.3em] hover:text-ayuta-pink transition-colors"
            >
              Or email us directly
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}