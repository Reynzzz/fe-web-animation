import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
}

export default function MagneticButton({ children, className, onClick, ...props }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative py-4 px-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group overflow-hidden interactive",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
      <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-500">
        {children}
      </span>
    </motion.button>
  );
}
