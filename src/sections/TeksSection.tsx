import { useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { useSiteContent } from '@/context/SiteContentContext';

const AnimatedMonopoShaderBackground = lazy(() => import('@/components/BackgroundAnimation'));

const japaneseWords = [
  '創造',
  '集合',
  '感性',
  '未来',
  '光景',
  '美学',
  '東京',
  '造形',
  '映像',
  '世界',
];

// PERBAIKAN 1: Mapping terjemahan dibuat per-kata, bukan per-kalimat
const japaneseTranslations: Record<string, string> = {
  'We': '我々',
  'are': 'は',
  'a': 'と',
  'brand': '銘柄',
  'of': 'の',
  'collective': '集合',
  'creativity': '創造',
};

type WordData = {
  wrapper: HTMLSpanElement;
  originalEl: HTMLSpanElement;
  jpEl: HTMLSpanElement;
  original: string;
  targetWord: string;
  isActive: boolean;
};

const fadeUp = {
  initial: { opacity: 0, y: 18, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const DEFAULT_HERO = {
  lines: ['We are a brand', 'of collective', 'creativity'],
  footer: {
    left: { strong: 'Based in jakarta', text: 'Born in Indonesia' },
    center: { strong: 'Design-driven', text: 'creative agency' },
    right: { strong: 'Branding, digital', text: 'and communications' },
  },
};

export default function MonopoHero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const wordsRef = useRef<WordData[]>([]);
  const { settings } = useSiteContent();
  const hero = settings.hero || DEFAULT_HERO;
  const lines: string[] = hero.lines?.length ? hero.lines : DEFAULT_HERO.lines;
  const footer = hero.footer || DEFAULT_HERO.footer;
  const linesKey = lines.join('|');

  useEffect(() => {
    const headline = headlineRef.current;
    const lens = lensRef.current;

    if (!headline || !lens) return;

    const words: WordData[] = [];
    const lineEls = headline.querySelectorAll<HTMLSpanElement>('.line');

    lineEls.forEach((line) => {
      if (!line.dataset.rawText) {
        line.dataset.rawText = line.textContent || '';
      }

      const text = line.dataset.rawText;
      line.innerHTML = '';

      // PERBAIKAN 2: Memisahkan string berdasarkan spasi agar menjadi array kata
      const splitWords = text.trim().split(/\s+/);

      splitWords.forEach((word, index) => {
        const wrapper = document.createElement('span');
        const originalEl = document.createElement('span');
        const jpEl = document.createElement('span');

        wrapper.className =
          'word relative inline-flex items-center justify-center align-baseline overflow-visible whitespace-nowrap';

        originalEl.className =
          'word-original inline-block will-change-[opacity,filter,transform]';

        jpEl.className =
          'word-jp pointer-events-none absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 will-change-[opacity,filter,transform]';

        originalEl.textContent = word;
        jpEl.textContent = word;

        wrapper.appendChild(originalEl);
        wrapper.appendChild(jpEl);
        line.appendChild(wrapper);

        words.push({
          wrapper,
          originalEl,
          jpEl,
          original: word,
          targetWord: word,
          isActive: false,
        });

        if (index < splitWords.length - 1) {
          const space = document.createElement('span');
          space.className = 'inline-block w-[0.28em]';
          space.textContent = ' ';
          line.appendChild(space);
        }
      });
    });

    wordsRef.current = words;

    requestAnimationFrame(() => {
      wordsRef.current.forEach(({ wrapper, originalEl }) => {
        wrapper.style.width = 'auto';
        const width = originalEl.getBoundingClientRect().width;
        wrapper.style.width = `${width}px`;
      });
    });

    const getRandomJapaneseWord = () =>
      japaneseWords[Math.floor(Math.random() * japaneseWords.length)];

    const enterRadius = 115;
    const leaveRadius = 160;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ticking = false;
    let activeWordsCount = 0;

    const lensX = gsap.quickTo(lens, 'left', { duration: 0.22, ease: 'power3.out' });
    const lensY = gsap.quickTo(lens, 'top', { duration: 0.22, ease: 'power3.out' });
    const lensOpacity = gsap.quickTo(lens, 'opacity', { duration: 0.2, ease: 'power2.out' });

    const resetWords = () => {
      activeWordsCount = 0;
      gsap.to(lens, { scale: 1, duration: 0.34, ease: 'power3.out' });

      wordsRef.current.forEach((wordData) => {
        const { wrapper, originalEl, jpEl, original } = wordData;

        gsap.killTweensOf([wrapper, originalEl, jpEl]);

        wordData.isActive = false;
        wordData.targetWord = original;

        originalEl.textContent = original;
        jpEl.textContent = original;

        gsap.set(wrapper, { y: 0, scale: 1, rotate: 0, skewX: 0, filter: 'brightness(1)' });
        gsap.set(originalEl, { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 });
        gsap.set(jpEl, {
          opacity: 0,
          filter: 'blur(8px)',
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          color: '#ffffff',
          textShadow: 'none',
          fontFamily: '"Noto Sans JP", "Inter", sans-serif',
        });
      });

      lensOpacity(0);
    };

    const activateWord = (wordData: WordData, intensity: number) => {
      const { wrapper, originalEl, jpEl } = wordData;

      if (!wordData.isActive) {
        wordData.isActive = true;
        activeWordsCount++;

        if (activeWordsCount === 1) {
          gsap.to(lens, { scale: 1.8, duration: 0.28, ease: 'power3.out', overwrite: 'auto' });
        }

        const targetWord = japaneseTranslations[wordData.original] || getRandomJapaneseWord();
        wordData.targetWord = targetWord;
        jpEl.textContent = wordData.targetWord;

        gsap.killTweensOf([originalEl, jpEl]);

        gsap.set(jpEl, {
          fontFamily: '"Noto Sans JP", "Inter", sans-serif',
          color: '#ffffff',
          textShadow:
            '1.5px 0 0 rgba(241, 95, 165, 0.65), -1.5px 0 0 rgba(39, 87, 140, 0.65), 0 0 12px rgba(245, 245, 245, 0.22)',
        });

        gsap.to(originalEl, {
          opacity: 0,
          filter: 'blur(7px)',
          duration: 0.28,
          ease: 'power3.out',
          overwrite: true,
        });

        gsap.fromTo(
          jpEl,
          { opacity: 0, filter: 'blur(7px)', xPercent: -50, yPercent: -50, x: 0, y: 0 },
          { opacity: 1, filter: 'blur(0px)', duration: 0.38, ease: 'power3.out', overwrite: true }
        );
      }

      gsap.to(wrapper, {
        y: -intensity * 2,
        scale: 1,
        rotate: 0,
        skewX: 0,
        filter: `brightness(${1 + intensity * 0.12})`,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const deactivateWord = (wordData: WordData) => {
      const { wrapper, originalEl, jpEl } = wordData;

      if (!wordData.isActive) return;

      wordData.isActive = false;
      activeWordsCount--;

      if (activeWordsCount === 0) {
        gsap.to(lens, { scale: 1, duration: 0.34, ease: 'power3.out', overwrite: 'auto' });
      }

      gsap.killTweensOf([wrapper, originalEl, jpEl]);

      gsap.to(jpEl, { opacity: 0, filter: 'blur(7px)', duration: 0.24, ease: 'power3.out', overwrite: true });
      gsap.to(originalEl, { opacity: 1, filter: 'blur(0px)', duration: 0.36, ease: 'power3.out', overwrite: true });
      gsap.to(wrapper, { y: 0, scale: 1, rotate: 0, skewX: 0, filter: 'brightness(1)', duration: 0.34, ease: 'power3.out', overwrite: true });
    };

    const updateWords = () => {
      wordsRef.current.forEach((wordData) => {
        const rect = wordData.wrapper.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;

        const dx = mouseX - wordX;
        const dy = mouseY - wordY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enterRadius) {
          activateWord(wordData, 1 - distance / enterRadius);
          return;
        }

        if (distance > leaveRadius) {
          deactivateWord(wordData);
        }
      });
    };

    const animateLens = () => {
      lensX(mouseX);
      lensY(mouseY);
      lensOpacity(1);
      updateWords();
      ticking = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerWidth <= 900) return;
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!ticking) {
        requestAnimationFrame(animateLens);
        ticking = true;
      }
    };

    const handleMouseLeave = () => resetWords();

    const handleResize = () => {
      wordsRef.current.forEach(({ wrapper, originalEl }) => {
        wrapper.style.width = 'auto';
        const width = originalEl.getBoundingClientRect().width;
        wrapper.style.width = `${width}px`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      resetWords();

      lineEls.forEach((line) => {
        if (line.dataset.rawText) {
          line.textContent = line.dataset.rawText;
        }
      });

      wordsRef.current = [];

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [linesKey]);

  useEffect(() => {
    const updateTime = () => {
      if (!timeRef.current) return;
      const now = new Date();
      timeRef.current.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full cursor-none max-[900px]:cursor-auto overflow-hidden bg-[#020204] font-sans text-white antialiased">
      <Suspense fallback={<div className="absolute inset-0 bg-[#020204]" />}>
        <AnimatedMonopoShaderBackground />
      </Suspense>

      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.08, delayChildren: 0.25 }}
      >
        <motion.main
          variants={fadeUp}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="absolute left-1/2 top-1/2 z-[18] w-[min(1120px,90vw)] -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <h1
            ref={headlineRef}
            className="font-sans text-[clamp(56px,7vw,132px)] font-normal leading-[0.98] tracking-[-0.065em] text-white max-[900px]:text-[clamp(54px,14vw,92px)] max-[900px]:leading-[0.95]"
          >
            {lines.map((line, i) => (
              <span
                key={`${linesKey}-${i}`}
                className="line block whitespace-nowrap max-[900px]:whitespace-normal"
                data-raw-text={line}
              >
                {line}
              </span>
            ))}
          </h1>
        </motion.main>

        <motion.footer
          variants={fadeUp}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="absolute bottom-[34px] left-[38px] right-[38px] grid grid-cols-3 items-end text-[16px] tracking-[-0.02em] max-[900px]:left-[22px] max-[900px]:right-[22px] max-[900px]:grid-cols-1 max-[900px]:gap-3.5 max-[900px]:text-[13px]"
        >
          <div className="leading-[1.3] text-white/55">
            <strong className="block font-extrabold text-white">{footer.left?.strong}</strong>
            {footer.left?.text}
          </div>

          <div className="justify-self-center leading-[1.3] text-white/55 max-[900px]:justify-self-start">
            <strong className="block font-extrabold text-white">{footer.center?.strong}</strong>
            {footer.center?.text}
          </div>

          <div className="justify-self-end leading-[1.3] text-white/55 max-[900px]:justify-self-start">
            <strong className="block font-extrabold text-white">{footer.right?.strong}</strong>
            {footer.right?.text}
          </div>
        </motion.footer>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="absolute bottom-[42px] left-[38px] z-[22] flex opacity-65 max-[900px]:hidden"
        >
          <span className="-ml-0 h-[15px] w-[15px] rounded-full border border-white/75" />
          <span className="-ml-[5px] h-[15px] w-[15px] rounded-full border border-white/75" />
          <span className="-ml-[5px] h-[15px] w-[15px] rounded-full border border-white/75" />
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="absolute bottom-[35px] right-[42px] z-[22] h-[54px] w-px bg-white/45 after:absolute after:bottom-0 after:left-[-5px] after:h-[10px] after:w-[10px] after:rotate-45 after:border-b after:border-r after:border-white/55 max-[900px]:hidden"
        />
      </motion.div>

      {/* PERBAIKAN 3: Menambahkan class backdrop-blur-md agar lensa tampak mendistorsi background seperti kaca */}
     {/* KODE BARU: Tanpa backdrop-blur-md */}
      <div
        ref={lensRef}
        className="pointer-events-none fixed left-0 top-0 z-40 h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[1.5px] border-white/30 bg-transparent opacity-0 shadow-[inset_10px_12px_24px_rgba(255,255,255,0.15),0_16px_50px_rgba(0,0,0,0.42)] max-[900px]:hidden"
      />
    </section>
  );
}