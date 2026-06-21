import React from 'react';
import { motion } from 'motion/react';

export default function PageTransition() {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-[#050505] z-[100] origin-top pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="fixed inset-0 bg-[#050505] z-[100] origin-bottom pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
    </>
  );
}
