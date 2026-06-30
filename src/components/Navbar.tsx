import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MainLogo from '@/assets/Main_Logo.png';
const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Work', path: '/works' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 py-4 md:px-16 md:py-6 flex justify-between items-center transition-all duration-300 ${isOpen ? 'bg-transparent' : 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5'}`}>
        <Link to="/" className="interactive transition-opacity hover:opacity-80 relative z-50">
          <img 
            src={MainLogo} 
            alt="Ayuta Logo" 
            className="h-8 md:h-12 w-auto" // Sesuaikan tinggi (h) sesuai kebutuhan desain
          />
        </Link>

        <div className="hidden md:flex gap-16 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-[10px] font-bold uppercase tracking-[0.4em] relative group interactive text-white/50 hover:text-ayuta-primary transition-colors"
            >
              {link.label}
              <motion.span
                className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-ayuta-primary transition-all group-hover:w-full"
                initial={false}
                animate={{ width: location.pathname === link.path ? '100%' : '0%' }}
              />
            </Link>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden interactive text-[#F5F5F5] relative z-50"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">{isOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#050505]/50 backdrop-blur-md flex flex-col items-start justify-center px-12 md:hidden z-40"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl font-display font-light tracking-tighter"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-20 flex gap-8 text-[10px] tracking-[0.3em] uppercase text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span>INSTA</span>
              <span>TWIT</span>
              <span>LINKD</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
