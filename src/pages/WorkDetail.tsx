import React, { useCallback, useEffect, useRef, useState } from "react";
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

// ─── YouTube Intersection Autoplay ───────────────────────────────────────────
function VideoSection({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Thumbnail URL from YouTube
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const sendCommand = useCallback((func: string, args?: any[]) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: args || [] }),
      '*'
    );
  }, []);

  // Intersection Observer: autoplay muted when in view, pause when out
  useEffect(() => {
    if (!containerRef.current || !iframeLoaded) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sendCommand('playVideo');
          setIsPlaying(true);
        } else {
          sendCommand('pauseVideo');
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [sendCommand, iframeLoaded]);

  // Aggressively crop to remove YouTube chrome: 110px top/bottom, 0px sides
  const CROP = 110;
  const src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&mute=1&fs=0&cc_load_policy=0`;

  const handleClick = () => {
    setHasInteracted(true);
    sendCommand('unMute');
    sendCommand('playVideo');
    setIsPlaying(true);
  };

  return (
    <section className="py-16 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex items-center gap-6">
          <h4 className="text-2xl md:text-4xl font-display font-bold text-white/30 tracking-tighter whitespace-nowrap">
            VIDEO HIGHLIGHT /
          </h4>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Outer clip container: hides YouTube chrome */}
        <div
          ref={containerRef}
          className="w-full aspect-video bg-black relative overflow-hidden cursor-pointer"
          style={{ borderRadius: '1.5rem' }}
          onClick={handleClick}
        >
          {/* YouTube thumbnail shown until iframe loads */}
          {!iframeLoaded && (
            <img
              src={thumbUrl}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Iframe: offset by CROP to hide top title bar & bottom bar */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: 0, left: 0,
              width: '100%',
              height: `calc(100% + ${CROP * 2}px)`,
              marginTop: `-${CROP}px`,
              borderRadius: '1.5rem',
            }}
          >
            <iframe
              ref={iframeRef}
              src={src}
              title="Project Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full"
            />
          </div>

          {/* Transparent blocker: prevents any YouTube UI from being clickable */}
          <div className="absolute inset-0 z-20" onClick={handleClick} />

          {/* Bottom gradient overlay for polish */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-30" style={{ borderRadius: '0 0 1.5rem 1.5rem' }} />

          {/* Custom play button overlay */}
          {!hasInteracted && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 group">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white/60 text-xs uppercase tracking-widest">Click to play with sound</span>
            </div>
          )}

          {/* Muted badge when autoplaying muted */}
          {hasInteracted === false && iframeLoaded && isPlaying && (
            <div className="absolute bottom-4 right-4 z-40 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/60 text-[10px] uppercase tracking-widest pointer-events-none">
              🔇 Muted – click to unmute
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

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

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
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
              scrub: true,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });

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
    const t1 = setTimeout(() => debouncedScrollRefresh(100), 1200);
    const t2 = setTimeout(() => debouncedScrollRefresh(100), 2500);

    const imgs = containerRef.current?.querySelectorAll("img") || [];
    let loadedCount = 0;
    const checkImages = () => {
      loadedCount++;
      if (loadedCount >= imgs.length) {
        debouncedScrollRefresh(200);
      }
    };
    
    if (imgs.length > 0) {
      imgs.forEach(img => {
        if (img.complete) {
          checkImages();
        } else {
          img.addEventListener("load", checkImages, { once: true });
          img.addEventListener("error", checkImages, { once: true });
        }
      });
    }

    return () => {
      window.removeEventListener("load", refreshScrollTrigger);
      window.removeEventListener("resize", refreshScrollTrigger);
      clearTimeout(t1);
      clearTimeout(t2);
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
        className="fixed top-30 left-10 z-50 p-4 rounded-full border border-white/10 glass-panel hover:bg-white hover:text-black transition-all duration-500 group overflow-hidden"
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

        <div className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-12 md:right-12 flex justify-end items-end opacity-40 text-[8px] sm:text-[10px]">
         

          <div className="uppercase tracking-[0.4em] font-bold">
            Client: {project.client}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 md:py-40 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="detail-stagger flex flex-col items-start w-full">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-ayuta-pink font-bold mb-6 md:mb-8">
            THE CHALLENGE
          </h2>

          <p className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight tracking-tight text-white/80 w-full">
            {project.description}
          </p>
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
            <h4 className="text-4xl font-display font-bold text-white/40 tracking-tighter">
              IN ACTION
            </h4>
            <p className="text-base text-white/65 font-light">
              We explored various textures and motion patterns to ensure the
              brand felt alive across all touchpoints.
            </p>
          </div>

          {project.gallery.slice(1).map((img, i) => (
            <div
              key={i}
              className="w-full h-[40vh]  overflow-hidden border border-white/5 cinematic-shadow"
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
            <h4 className="text-[8vw] font-display font-bold text-white/40 tracking-tighter">
              IN ACTION 
            </h4>

            <p className="text-xl text-white/65 max-w-md whitespace-normal font-light">
            From planning to execution, every frame tells part of the story.
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
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 pr-5"
              />
            </div>
          ))}

        </div>
      </section>

      {/* Video Embed Section */}
      <VideoSection videoId={project.video || 'JXHeS_GzJng'} />

      {/* Footer / CTA */}
      <section className="py-32 md:py-60 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ayuta-primary/20 blur-[150px] rounded-full pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[5rem] font-display font-medium tracking-tighter mb-8 md:mb-12 leading-[0.9]">
            NEXT <br />
            <span className="italic font-light">PROJECT.</span>
          </h2>

          <MagneticButton
            onClick={() => navigate(`/works/${nextProject.slug}`)}
            className="bg-[#F5F5F5] text-black border-none px-6 md:px-10 py-4 md:py-5 text-sm md:text-base font-bold"
          >
            {nextProject.title}
            <ArrowUpRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
          </MagneticButton>
        </div>
      </section>
    </motion.div>
  );
}