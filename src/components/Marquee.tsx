import React from 'react';
import { motion } from 'motion/react';

interface MarqueeProps {
  text: string;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export default function Marquee({ text, speed = 20, direction = 'left', className }: MarqueeProps) {
  const containerVariants = {
    animate: {
      x: direction === 'left' ? [0, -1000] : [-1000, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: speed,
          ease: "linear" as const,
        },
      },
    },
  };

  return (
    <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div 
        className="flex"
        variants={containerVariants}
        animate="animate"
      >
        <span className="inline-block pr-10">{text}</span>
        <span className="inline-block pr-10">{text}</span>
        <span className="inline-block pr-10">{text}</span>
        <span className="inline-block pr-10">{text}</span>
      </motion.div>
    </div>
  );
}
