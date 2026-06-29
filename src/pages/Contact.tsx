import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { API_URL } from '@/lib/api';

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
    <main className="pt-32 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          <div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-bold tracking-tighter mb-8 md:mb-12">
              LET'S <br /> <span className="text-ayuta-pink">TALK.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-white/50 font-light mb-10 md:mb-16 leading-relaxed">
              Whether you have a fully-fledged concept or just the seed of an idea, 
              we're here to help you bring it to life.
            </p>
 
            <div className="space-y-8 md:space-y-12">
              <div className="flex gap-4 sm:gap-6 items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-panel flex items-center justify-center text-ayuta-pink">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white/30 uppercase tracking-widest">Email Us</div>
                  <div className="text-lg sm:text-xl font-medium">mail@ayuta.id</div>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6 items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl glass-panel flex items-center justify-center text-ayuta-pink">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-white/30 uppercase tracking-widest">Visit Us</div>
                  <div className="text-lg sm:text-xl font-medium">Indonesia, Jakarta</div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="glass-panel p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-ayuta-pink/20 blur-3xl rounded-full" />
            
            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
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
    </main>
  );
}
