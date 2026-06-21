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

// Pisahkan layout ke dalam array agar JSX lebih bersih dan mudah dimaintain.
// Urutan: Base (Mobile) -> sm (Tablet) -> md (Desktop)
const imageLayouts = [
    // 0: Center (Gambar Utama)
    'w-[60vw] h-[30vh] sm:w-[50vw] sm:h-[35vh] md:w-[25vw] md:h-[25vh] z-10',
    // 1: Top Right
    'w-[40vw] h-[20vh] -top-[25vh] left-[10vw] sm:w-[35vw] sm:h-[25vh] sm:-top-[30vh] sm:left-[15vw] md:w-[35vw] md:h-[30vh] md:-top-[30vh] md:left-[5vw]',
    // 2: Top Left
    'w-[35vw] h-[25vh] -top-[15vh] -left-[30vw] sm:w-[30vw] sm:h-[30vh] sm:-top-[15vh] sm:-left-[35vw] md:w-[20vw] md:h-[45vh] md:-top-[10vh] md:-left-[25vw]',
    // 3: Right
    'w-[30vw] h-[20vh] left-[35vw] sm:w-[25vw] sm:h-[20vh] sm:left-[40vw] md:w-[25vw] md:h-[25vh] md:left-[27.5vw]',
    // 4: Bottom Right
    'w-[35vw] h-[20vh] top-[25vh] left-[15vw] sm:w-[30vw] sm:h-[25vh] sm:top-[25vh] sm:left-[15vw] md:w-[20vw] md:h-[25vh] md:top-[27.5vh] md:left-[5vw]',
    // 5: Bottom Left
    'w-[40vw] h-[20vh] top-[20vh] -left-[25vw] sm:w-[35vw] sm:h-[25vh] sm:top-[25vh] sm:-left-[30vw] md:w-[30vw] md:h-[25vh] md:top-[27.5vh] md:-left-[22.5vw]',
    // 6: Bottom Center-Right
    'w-[25vw] h-[15vh] top-[25vh] left-[35vw] sm:w-[20vw] sm:h-[15vh] sm:top-[30vh] sm:left-[35vw] md:w-[15vw] md:h-[15vh] md:top-[22.5vh] md:left-[25vw]'
];

export default function ZoomParallax({ images }: ZoomParallaxProps) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    // Smooth the raw scroll progress
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
                    // Mengambil layout berdasarkan index, loop kembali jika gambar lebih dari jumlah layout
                    const layoutClass = imageLayouts[index % imageLayouts.length];

                    return (
                        <motion.div
                            key={index}
                            style={{ scale, willChange: 'transform' }}
                            className="absolute flex h-full w-full items-center justify-center pointer-events-none"
                        >
                            <div className={`relative ${layoutClass} overflow-hidden rounded-xl border border-white/5 cinematic-shadow pointer-events-auto`}>
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