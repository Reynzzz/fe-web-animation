'use client';

import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

export default function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	// Smooth the raw scroll progress before driving any transforms from it.
	// Without this, every micro-jitter of the scroll event (which can fire
	// many times per frame on some trackpads/devices) forces a fresh style
	// recalculation across all 7 image layers below. Springing it once,
	// here, means every useTransform downstream reads an already-smoothed
	// value instead of each doing its own jittery scale calculation.
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 240,
		damping: 40,
		mass: 0.4,
	});

	const scale4 = useTransform(smoothProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(smoothProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(smoothProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(smoothProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(smoothProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh] bg-[#050505]">
			<div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale, willChange: 'transform' }}
							className="absolute flex h-full w-full items-center justify-center pointer-events-none"
						>
							<div className={`relative ${
								index === 0 ? 'w-[40vw] md:w-[25vw] h-[30vh] md:h-[25vh] z-10' :
								index === 1 ? 'w-[35vw] h-[30vh] -top-[30vh] left-[15vw] md:left-[5vw]' :
								index === 2 ? 'w-[25vw] md:w-[20vw] h-[40vh] md:h-[45vh] -top-[10vh] -left-[30vw] md:-left-[25vw]' :
								index === 3 ? 'w-[30vw] md:w-[25vw] h-[25vh] left-[35vw] md:left-[27.5vw]' :
								index === 4 ? 'w-[25vw] md:w-[20vw] h-[25vh] top-[27.5vh] left-[10vw] md:left-[5vw]' :
								index === 5 ? 'w-[35vw] md:w-[30vw] h-[25vh] top-[27.5vh] -left-[30vw] md:-left-[22.5vw]' :
								'w-[20vw] md:w-[15vw] h-[15vh] top-[22.5vh] left-[30vw] md:left-[25vw]'
							} overflow-hidden rounded-xl border border-white/5 cinematic-shadow pointer-events-auto`}>
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									loading="lazy"
									decoding="async"
									className="h-full w-full object-cover"
								/>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}