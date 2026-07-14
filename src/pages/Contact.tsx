import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { API_URL, resolveMediaUrl } from '@/lib/api';
import { useSiteContent } from '@/context/SiteContentContext';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setStatus('success');
      setStatusMsg('Thank you! Your message has been sent successfully.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setStatusMsg(err.message || 'Unable to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-8 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          <div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tighter mb-4 md:mb-6">
              GET IN<br /> <span className="text-ayuta-pink">TOUCH.</span>
            </h1>
            <p className="text-base sm:text-xl text-white/50 font-light mb-6 md:mb-8 leading-relaxed">
         Let’s collaborate to ignite deep, authentic connections through emotionally engaging experiences.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-6 mt-8 pt-6 border-t border-white/10">
              <div className="group">
                <h4 className="text-[10px] font-bold tracking-widest text-ayuta-pink uppercase mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">WhatsApp</h4>
                <a 
                  href="https://wa.me/6285773672611" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
                >
                  0857-7367-2611
                </a>
              </div>
              
              <div className="group">
                <h4 className="text-[10px] font-bold tracking-widest text-ayuta-pink uppercase mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">Instagram</h4>
                <a 
                  href="https://instagram.com/ayuta.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
                >
                  @ayuta.id
                </a>
              </div>

              <div className="group">
                <h4 className="text-[10px] font-bold tracking-widest text-ayuta-pink uppercase mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">YouTube</h4>
                <a 
                  href="https://youtube.com/@ayutasamarthya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
                >
                  ayutasamarthya
                </a>
              </div>

              <div className="group">
                <h4 className="text-[10px] font-bold tracking-widest text-ayuta-pink uppercase mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">LinkedIn</h4>
                <a 
                  href="https://linkedin.com/company/ayuta-samarthya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
                >
                  Ayuta Samarthya
                </a>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-ayuta-pink/20 blur-3xl rounded-full" />

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              {status === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/30 ml-2 sm:ml-4">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-ayuta-pink outline-none transition-colors disabled:opacity-50 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/30 ml-2 sm:ml-4">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-ayuta-pink outline-none transition-colors disabled:opacity-50 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/30 ml-2 sm:ml-4">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-4 sm:px-6 focus:border-ayuta-pink outline-none transition-colors resize-none disabled:opacity-50 text-sm sm:text-base"
                />
              </div>

              <MagneticButton
                type="submit"
                disabled={loading}
                className="w-full bg-ayuta-pink border-none py-4 sm:py-6 text-base sm:text-lg justify-center disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" /> Sending...
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </MagneticButton>
            </form>
          </div>
        </div>
      </div>

      {/* ── Join the Growing List Section ── */}
      <BrandPartnersSection />
    </main>
  );
}

function BrandPartnersSection() {
  const { items } = useSiteContent();
  const partners = items.partner || [];

  if (partners.length === 0) return null;

  const doubled = [...partners, ...partners];

  return (
    <section className="w-full bg-[#080808]  py-12 md:py-16 mt-10">
      <div className="flex flex-col gap-8">
        {/* Heading */}
        <p className="text-center text-white text-xs sm:text-sm md:text-lg font-bold uppercase tracking-[0.35em] px-4">
          Join the growing list of brands partnering with us
        </p>

        {/* Divider */}
       

        {/* Auto-scrolling logos */}
        <div className="overflow-hidden w-full">
          <div
            className="flex items-center gap-12 md:gap-20 animate-marquee-logos whitespace-nowrap"
            style={{ willChange: 'transform' }}
          >
            {doubled.map((partner, i) => (
              <img
                key={i}
                src={resolveMediaUrl(partner.image)}
                alt={partner.title || 'Partner'}
                className="h-16 md:h-28 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale brightness-200 contrast-200 shrink-0 inline-block"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
