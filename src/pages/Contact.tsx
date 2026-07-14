import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, ArrowRight, CheckCircle, AlertCircle, Loader2, Instagram, Youtube, Linkedin } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
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
                <a 
                  href="https://wa.me/6285773672611" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base text-white/70 hover:text-white transition-colors group/link"
                >
                  <WhatsAppIcon className="w-5 h-5 transition-transform group-hover/link:scale-110 text-ayuta-pink" />
                  0857-7367-2611
                </a>
              </div>
              
              <div className="group">
                <a 
                  href="https://instagram.com/ayuta.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base text-white/70 hover:text-white transition-colors group/link"
                >
                  <Instagram className="w-5 h-5 transition-transform group-hover/link:scale-110 text-ayuta-pink" />
                  @ayuta.id
                </a>
              </div>

              <div className="group">
                <a 
                  href="https://youtube.com/@samayutaja" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base text-white/70 hover:text-white transition-colors group/link"
                >
                  <Youtube className="w-5 h-5 transition-transform group-hover/link:scale-110 text-ayuta-pink" />
                  ayutasamarthya
                </a>
              </div>

              <div className="group">
                <a 
                  href="https://linkedin.com/company/ayuta-samarthya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm sm:text-base text-white/70 hover:text-white transition-colors group/link"
                >
                  <Linkedin className="w-5 h-5 transition-transform group-hover/link:scale-110 text-ayuta-pink" />
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
