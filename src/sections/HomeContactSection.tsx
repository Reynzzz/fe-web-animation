import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/MagneticButton';
import { Mail, ArrowRight, Instagram, Twitter, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HomeContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-40 px-6 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-ayuta-primary/10 blur-[150px] rounded-full pointer-events-none opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-ayuta-pink font-bold mb-8 contact-reveal">STAY IN TOUCH</h2>
          <h3 className="text-6xl md:text-[8rem] font-display font-medium tracking-tighter text-[#F5F5F5] leading-[0.9] mb-12 contact-reveal">
            LATEST <br /> <span className="italic font-light">CHAPTER.</span>
          </h3>
          <p className="text-xl text-white/40 mb-16 max-w-md contact-reveal">
            Have a project in mind? We're currently accepting new collaborations for 2026. Let's make something extraordinary.
          </p>
          
          <div className="flex gap-8 contact-reveal">
            <a href="#" className="p-4 rounded-full border border-white/10 hover:border-white/30 transition-colors text-white/50 hover:text-white">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 rounded-full border border-white/10 hover:border-white/30 transition-colors text-white/50 hover:text-white">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 rounded-full border border-white/10 hover:border-white/30 transition-colors text-white/50 hover:text-white">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="contact-reveal">
          <form className="space-y-12">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-transparent border-b border-white/10 py-6 text-xl focus:border-white transition-colors outline-none placeholder:text-white/10"
              />
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-ayuta-primary transition-all group-focus-within:w-full" />
            </div>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-white/10 py-6 text-xl focus:border-white transition-colors outline-none placeholder:text-white/10"
              />
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-ayuta-primary transition-all group-focus-within:w-full" />
            </div>
            <div className="relative group">
              <textarea 
                placeholder="Tell us about your project" 
                rows={4}
                className="w-full bg-transparent border-b border-white/10 py-6 text-xl focus:border-white transition-colors outline-none placeholder:text-white/10 resize-none"
              />
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-ayuta-primary transition-all group-focus-within:w-full" />
            </div>
            
            <MagneticButton className="w-full bg-[#F5F5F5] text-black border-none py-8 text-sm font-bold uppercase tracking-[0.3em] flex justify-center items-center gap-4">
              Send Message <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </form>
          
          <div className="mt-16 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-4">Direct Email</span>
              <a href="mailto:hello@ayuta.studio" className="text-xl text-white/60 hover:text-white transition-colors flex items-center gap-3">
                <Mail className="w-5 h-5 text-ayuta-pink" />
                hello@ayuta.studio
              </a>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-4">Studio Location</span>
              <p className="text-xl text-white/60">Shibuya, Tokyo. JP</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
