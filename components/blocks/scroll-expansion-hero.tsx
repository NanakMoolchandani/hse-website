'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  words?: string[];
  children?: ReactNode;
}

// Compute which word to show and its opacity based on scroll progress
function getActiveWord(
  scrollProgress: number,
  words: string[]
): { word: string; opacity: number } {
  if (!words.length) return { word: '', opacity: 0 };

  const WORD_START = 0.04;
  const WORD_END = 0.88;

  if (scrollProgress < WORD_START || scrollProgress >= WORD_END) {
    return { word: '', opacity: 0 };
  }

  const range = WORD_END - WORD_START;
  const normalized = (scrollProgress - WORD_START) / range;

  const segmentSize = 1 / words.length;
  const idx = Math.min(Math.floor(normalized / segmentSize), words.length - 1);
  const segmentProgress = (normalized - idx * segmentSize) / segmentSize;

  // Fade in 0→0.3, full 0.3→0.7, fade out 0.7→1
  let opacity = 0;
  if (segmentProgress < 0.3) {
    opacity = segmentProgress / 0.3;
  } else if (segmentProgress < 0.7) {
    opacity = 1;
  } else {
    opacity = (1 - segmentProgress) / 0.3;
  }

  return { word: words[idx], opacity: Math.max(0, Math.min(1, opacity)) };
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  words = [],
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => setTouchStartY(0);
    const handleScroll = (): void => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  const { word: activeWord, opacity: wordOpacity } = getActiveWord(scrollProgress, words);

  // Fade out the bottom hints as expansion progresses
  const hintOpacity = Math.max(0, 1 - scrollProgress * 5);

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>

          {/* Background image — fades out as media expands */}
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt='Background'
              className='w-screen h-screen object-cover object-center'
              loading='eager'
            />
            <div className='absolute inset-0 bg-black/30' />
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>

              {/* Expanding media box */}
              <div
                className='absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-none overflow-hidden'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0px 0px 60px rgba(0, 0, 0, 0.4)',
                  borderRadius: `${Math.max(0, 16 - scrollProgress * 16)}px`,
                }}
              >
                {mediaType === 'video' ? (
                  mediaSrc.includes('youtube.com') ? (
                    <div className='relative w-full h-full pointer-events-none'>
                      <iframe
                        width='100%'
                        height='100%'
                        src={
                          mediaSrc.includes('embed')
                            ? mediaSrc + (mediaSrc.includes('?') ? '&' : '?') +
                              'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                            : mediaSrc.replace('watch?v=', 'embed/') +
                              '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                              mediaSrc.split('v=')[1]
                        }
                        className='w-full h-full'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      />
                      <motion.div
                        className='absolute inset-0 bg-black/30'
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className='relative w-full h-full pointer-events-none'>
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay muted loop playsInline preload='auto'
                        className='w-full h-full object-cover'
                      />
                      <motion.div
                        className='absolute inset-0 bg-black/30'
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className='relative w-full h-full'>
                    <img
                      src={mediaSrc}
                      alt={title || 'Media content'}
                      className='w-full h-full object-cover object-center'
                    />
                    <motion.div
                      className='absolute inset-0 bg-black/40'
                      animate={{ opacity: 0.65 - scrollProgress * 0.45 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                {/* ── Scrolling quality words ── */}
                {words.length > 0 && (
                  <div className='absolute inset-0 z-20 flex items-center justify-center pointer-events-none'>
                    <AnimatePresence mode='wait'>
                      {activeWord && (
                        <motion.span
                          key={activeWord}
                          className='font-display text-white text-center select-none'
                          style={{
                            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
                            opacity: wordOpacity,
                          }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: wordOpacity, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.35 }}
                        >
                          {activeWord}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Date + scroll hint — fade out quickly on scroll */}
                <div
                  className='flex flex-col items-center text-center absolute bottom-6 left-0 right-0 z-10 transition-none'
                  style={{ opacity: hintOpacity }}
                >
                  {date && (
                    <p className='text-sm text-white/70 font-medium tracking-widest uppercase'>
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p className='text-white/50 text-xs tracking-widest uppercase mt-1'>
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* Split title — slides apart as media expands */}
              <div
                className={`flex items-center justify-center text-center gap-3 w-full relative z-10 transition-none flex-col ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
              >
                <motion.h1
                  className='font-display font-bold text-white drop-shadow-2xl transition-none'
                  style={{
                    transform: `translateX(-${textTranslateX}vw)`,
                    fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                    opacity: 1 - scrollProgress * 1.5,
                  }}
                >
                  {firstWord}
                </motion.h1>
                <motion.h1
                  className='font-display font-bold text-white drop-shadow-2xl transition-none'
                  style={{
                    transform: `translateX(${textTranslateX}vw)`,
                    fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                    opacity: 1 - scrollProgress * 1.5,
                  }}
                >
                  {restOfTitle}
                </motion.h1>
              </div>
            </div>

            {/* Content revealed after full expansion */}
            <motion.section
              className='flex flex-col w-full'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
