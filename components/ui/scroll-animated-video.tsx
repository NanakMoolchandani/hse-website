import React, { CSSProperties, ReactNode, useEffect, useMemo, useRef } from "react";

/* =========================
   Types
========================= */

type Source = { mp4?: string; webm?: string; ogg?: string };
type VideoLike = string | Source;

type Eases = {
  container?: string;
  overlay?: string;
  text?: string;
};

export type HeroScrollVideoProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  credits?: ReactNode;

  media?: VideoLike;
  poster?: string;
  mediaType?: "video" | "image";
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;

  overlay?: {
    caption?: ReactNode;
    heading?: ReactNode;
    paragraphs?: ReactNode[];
    extra?: ReactNode;
  };

  initialBoxSize?: number;
  targetSize?: { widthVw: number; heightVh: number; borderRadius?: number } | "fullscreen";
  scrollHeightVh?: number;
  showHeroExitAnimation?: boolean;
  sticky?: boolean;
  overlayBlur?: number;
  overlayRevealDelay?: number;
  eases?: Eases;

  smoothScroll?: boolean;
  lenisOptions?: Record<string, unknown>;

  headerBackground?: ReactNode;

  className?: string;
  style?: CSSProperties;
};

/* =========================
   Defaults
========================= */

const DEFAULTS = {
  initialBoxSize: 360,
  targetSize: "fullscreen" as const,
  scrollHeightVh: 280,
  overlayBlur: 10,
  overlayRevealDelay: 0.35,
  eases: {
    container: "expo.out",
    overlay: "expo.out",
    text: "power3.inOut",
  } as Eases,
};

/* =========================
   Helpers
========================= */

function isSourceObject(m?: VideoLike): m is Source {
  return !!m && typeof m !== "string";
}

/* =========================
   Component
========================= */

export const HeroScrollVideo: React.FC<HeroScrollVideoProps> = ({
  title = "Future Forms",
  subtitle = "Design in Motion",
  meta = "2025",
  credits = (
    <>
      <p>Crafted by</p>
      <p>Scott Clayton</p>
    </>
  ),

  media,
  poster,
  mediaType = "video",
  muted = true,
  loop = true,
  playsInline = true,
  autoPlay = false,

  overlay = {
    caption: "PROJECT • 07",
    heading: "Clarity in Motion",
    paragraphs: [
      "Scroll to expand the frame and reveal the story.",
      "Built with GSAP ScrollTrigger and optional Lenis smooth scroll.",
    ],
    extra: null,
  },

  initialBoxSize = DEFAULTS.initialBoxSize,
  targetSize = DEFAULTS.targetSize,
  scrollHeightVh = DEFAULTS.scrollHeightVh,
  showHeroExitAnimation = true,
  sticky = true,
  overlayBlur = DEFAULTS.overlayBlur,
  overlayRevealDelay = DEFAULTS.overlayRevealDelay,
  eases = DEFAULTS.eases,

  smoothScroll = true,
  lenisOptions,

  headerBackground,

  className,
  style,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayCaptionRef = useRef<HTMLDivElement | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);

  const isClient = typeof window !== "undefined";

  const cssVars: CSSProperties = useMemo(
    () => ({
      ["--initial-size" as string]: `${initialBoxSize}px`,
      ["--overlay-blur" as string]: `${overlayBlur}px`,
    }),
    [initialBoxSize, overlayBlur]
  );

  const lenisOptionsStr = JSON.stringify(lenisOptions);

  useEffect(() => {
    if (!isClient) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsap: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ScrollTrigger: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let heroTl: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mainTl: any;
    let overlayDarkenEl: HTMLDivElement | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rafCb: ((t: number) => void) | null = null;

    let cancelled = false;

    (async () => {
      const gsapPkg = await import("gsap");
      gsap = (gsapPkg as { gsap?: unknown; default?: unknown }).gsap || (gsapPkg as { default?: unknown }).default || gsapPkg;

      const ScrollTriggerPkg = await import("gsap/ScrollTrigger").catch(() =>
        import("gsap/dist/ScrollTrigger" as string)
      );
      ScrollTrigger =
        (ScrollTriggerPkg as { default?: unknown }).default ||
        (ScrollTriggerPkg as { ScrollTrigger?: unknown }).ScrollTrigger ||
        ScrollTriggerPkg;

      const CustomEasePkg = await import("gsap/CustomEase").catch(() =>
        import("gsap/dist/CustomEase" as string)
      );
      const CustomEase =
        (CustomEasePkg as { default?: unknown }).default ||
        (CustomEasePkg as { CustomEase?: unknown }).CustomEase ||
        CustomEasePkg;

      gsap.registerPlugin(ScrollTrigger, CustomEase);

      if (cancelled) return;

      if (smoothScroll) {
        const try1 = await import("lenis").catch(() => null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const LenisCtor = (try1 as any)?.default || (try1 as any)?.Lenis;
        if (LenisCtor) {
          lenis = new LenisCtor({
            duration: 0.8,
            smoothWheel: true,
            gestureOrientation: "vertical",
            ...(lenisOptions || {}),
          });
          rafCb = (time: number) => lenis?.raf(time * 1000);
          gsap.ticker.add(rafCb);
          gsap.ticker.lagSmoothing(0);
          lenis?.on?.("scroll", ScrollTrigger.update);
        }
      }

      const containerEase = eases.container ?? "expo.out";
      const overlayEase = eases.overlay ?? "expo.out";
      const textEase = eases.text ?? "power3.inOut";

      const container = containerRef.current!;
      const overlayEl = overlayRef.current!;
      const overlayCaption = overlayCaptionRef.current!;
      const overlayContent = overlayContentRef.current!;
      const headline = headlineRef.current!;

      if (container) {
        overlayDarkenEl = document.createElement("div");
        overlayDarkenEl.setAttribute("data-auto-darken", "true");
        overlayDarkenEl.style.position = "absolute";
        overlayDarkenEl.style.inset = "0";
        overlayDarkenEl.style.background = "rgba(0,0,0,0)";
        overlayDarkenEl.style.pointerEvents = "none";
        overlayDarkenEl.style.zIndex = "1";
        container.appendChild(overlayDarkenEl);
      }

      if (showHeroExitAnimation && headline) {
        heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: headline,
            start: "top top",
            end: "top+=420 top",
            scrub: 1.1,
          },
        });

        headline
          .querySelectorAll<HTMLElement>(".hsv-headline > *")
          .forEach((el: HTMLElement, i: number) => {
            heroTl.to(
              el,
              {
                rotationX: 80,
                y: -36,
                scale: 0.86,
                opacity: 0,
                filter: "blur(4px)",
                transformOrigin: "center top",
                ease: textEase,
              },
              i * 0.08
            );
          });
      }

      const triggerEl = rootRef.current?.querySelector(
        "[data-sticky-scroll]"
      ) as HTMLElement;

      if (!triggerEl || !container || !overlayEl) return;

      mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
        },
      });

      const target = (() => {
        if (targetSize === "fullscreen") {
          return { width: "92vw", height: "92vh", borderRadius: 0 };
        }
        return {
          width: `${targetSize.widthVw ?? 92}vw`,
          height: `${targetSize.heightVh ?? 92}vh`,
          borderRadius: targetSize.borderRadius ?? 0,
        };
      })();

      gsap.set(container, {
        width: initialBoxSize,
        height: initialBoxSize,
        borderRadius: 20,
        filter: "none",
        clipPath: "inset(0 0 0 0)",
      });
      gsap.set(overlayEl, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(overlayContent, {
        filter: `blur(var(--overlay-blur))`,
        scale: 1.05,
      });
      gsap.set([overlayContent, overlayCaption], { y: 30 });

      mainTl
        .to(
          container,
          {
            width: target.width,
            height: target.height,
            borderRadius: target.borderRadius,
            ease: containerEase,
          },
          0
        )
        .to(
          overlayDarkenEl,
          {
            backgroundColor: "rgba(0,0,0,0.4)",
            ease: "power2.out",
          },
          0
        )
        .to(
          overlayEl,
          {
            clipPath: "inset(0% 0 0 0)",
            backdropFilter: `blur(${overlayBlur}px)`,
            ease: overlayEase,
          },
          overlayRevealDelay
        )
        .to(overlayCaption, { y: 0, ease: overlayEase }, overlayRevealDelay + 0.05)
        .to(
          overlayContent,
          {
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            ease: overlayEase,
          },
          overlayRevealDelay + 0.05
        );

      const videoEl = container.querySelector("video") as HTMLVideoElement | null;
      if (videoEl) {
        const tryPlay = () => videoEl.play().catch(() => {});
        tryPlay();
        ScrollTrigger.create({
          trigger: triggerEl,
          start: "top top",
          onEnter: tryPlay,
        });
      }
    })();

    return () => {
      cancelled = true;
      try { heroTl?.kill?.(); } catch {}
      try { mainTl?.kill?.(); } catch {}
      try {
        if (ScrollTrigger?.getAll && rootRef.current) {
          ScrollTrigger.getAll().forEach((t: { trigger: Node; kill: (r: boolean) => void }) =>
            rootRef.current!.contains(t.trigger) && t.kill(true)
          );
        }
      } catch {}
      try {
        if (overlayDarkenEl?.parentElement) {
          overlayDarkenEl.parentElement.removeChild(overlayDarkenEl);
        }
      } catch {}
      try {
        if (rafCb && gsap?.ticker) {
          gsap.ticker.remove(rafCb);
          gsap.ticker.lagSmoothing(1000, 16);
        }
      } catch {}
      try {
        lenis?.off?.("scroll", ScrollTrigger?.update);
        lenis?.destroy?.();
      } catch {}
    };
  }, [
    isClient,
    initialBoxSize,
    targetSize,
    scrollHeightVh,
    overlayBlur,
    overlayRevealDelay,
    eases.container,
    eases.overlay,
    eases.text,
    showHeroExitAnimation,
    sticky,
    smoothScroll,
    lenisOptionsStr,
  ]);

  const renderMedia = () => {
    if (mediaType === "image") {
      const src = typeof media === "string" ? media : media?.mp4 || "";
      return (
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }

    const sources: React.JSX.Element[] = [];
    if (typeof media === "string") {
      sources.push(<source key="mp4" src={media} type="video/mp4" />);
    } else if (isSourceObject(media)) {
      if (media.webm) sources.push(<source key="webm" src={media.webm} type="video/webm" />);
      if (media.mp4) sources.push(<source key="mp4" src={media.mp4} type="video/mp4" />);
      if (media.ogg) sources.push(<source key="ogg" src={media.ogg} type="video/ogg" />);
    }

    return (
      <video
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        autoPlay={autoPlay || muted}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      >
        {sources}
      </video>
    );
  };

  return (
    <div
      ref={rootRef}
      className={["hsv-root", className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style }}
    >
      {/* Headline/hero area */}
      <div className="hsv-container" ref={headlineRef} style={{ position: "relative" }}>
        {headerBackground && (
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {headerBackground}
          </div>
        )}
        <div className="hsv-headline" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="hsv-title">{title}</h1>
          {subtitle ? <h2 className="hsv-subtitle">{subtitle}</h2> : null}
          {meta ? <div className="hsv-meta">{meta}</div> : null}
          {credits ? <div className="hsv-credits">{credits}</div> : null}
        </div>
      </div>

      {/* Sticky scroll section */}
      <div
        className="hsv-scroll"
        data-sticky-scroll
        style={{ height: `${Math.max(150, scrollHeightVh)}vh` }}
      >
        <div className={`hsv-sticky ${sticky ? "is-sticky" : ""}`}>
          <div className="hsv-media" ref={containerRef}>
            {renderMedia()}

            <div className="hsv-overlay" ref={overlayRef}>
              {overlay?.caption ? (
                <div className="hsv-caption" ref={overlayCaptionRef}>
                  {overlay.caption}
                </div>
              ) : null}
              <div className="hsv-overlay-content" ref={overlayContentRef}>
                {overlay?.heading ? <h3>{overlay.heading}</h3> : null}
                {overlay?.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {overlay?.extra}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hsv-root {
          --text: #111827;
          --muted: #6b7280;
          --muted-bg: rgba(15,17,21,0.06);
          --muted-border: rgba(15,17,21,0.12);
          --overlay-bg: rgba(10,10,14,0.50);
          --overlay-text: #ffffff;
          --accent: #1d4ed8;
          --accent-2: #0ea5e9;
          --shadow: 0 10px 40px rgba(0,0,0,0.12);

          background: #ffffff;
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          overflow-x: clip;
        }

        .hsv-container {
          position: relative;
          height: 100vh;
          display: grid;
          place-items: center;
          padding: clamp(16px, 3vw, 40px);
          perspective: 900px;
          overflow: hidden;
        }

        .hsv-headline {
          text-align: center;
          transform-style: preserve-3d;
          max-width: min(100%, 1100px);
        }
        .hsv-headline > * {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transform-origin: center top;
        }

        .hsv-title {
          margin: 0 0 .6rem 0;
          font-size: clamp(48px, 9vw, 110px);
          line-height: 0.95;
          font-weight: 900;
          letter-spacing: -0.03em;
          text-wrap: balance;
          color: #111827;
          filter: drop-shadow(0 2px 0 rgba(0,0,0,0.04));
        }
        .hsv-subtitle {
          margin: 0 0 1.25rem 0;
          font-size: clamp(14px, 2.5vw, 20px);
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6b7280;
        }
        .hsv-meta {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          padding: .4rem .9rem;
          border-radius: 999px;
          font-size: .85rem;
          font-weight: 600;
          letter-spacing: .04em;
          background: rgba(15,17,21,0.05);
          border: 1px solid rgba(15,17,21,0.10);
          color: #374151;
          margin: 1rem 0 0 0;
        }
        .hsv-meta::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--accent);
          display: inline-block;
        }
        .hsv-credits {
          margin-top: 1rem;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9ca3af;
        }

        .hsv-scroll { position: relative; }
        .hsv-sticky.is-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: grid;
          place-items: center;
        }

        .hsv-media {
          position: relative;
          width: var(--initial-size);
          height: var(--initial-size);
          border-radius: 20px;
          overflow: hidden;
          background: #111;
          display: grid;
          place-items: center;
          box-shadow: var(--shadow);
        }

        .hsv-overlay {
          position: absolute;
          inset: 0;
          background: var(--overlay-bg);
          color: var(--overlay-text);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(16px, 4vw, 48px);
          clip-path: inset(100% 0 0 0);
          backdrop-filter: blur(var(--overlay-blur));
          z-index: 2;
        }

        .hsv-caption {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          position: absolute;
          top: clamp(8px, 3vw, 28px);
          left: 0;
          width: 100%;
          text-align: center;
          opacity: 0.7;
        }

        .hsv-overlay-content {
          max-width: 60ch;
          display: grid;
          gap: 1rem;
          place-items: center;
        }
        .hsv-overlay-content h3 {
          font-size: clamp(28px, 5vw, 56px);
          line-height: 1.05;
          margin: 0;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-wrap: balance;
        }
        .hsv-overlay-content h3::after {
          content: "";
          display: block;
          width: 56px;
          height: 3px;
          border-radius: 999px;
          margin: 12px auto 0 auto;
          background: var(--accent-2);
          opacity: 0.9;
        }
        .hsv-overlay-content p {
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.8;
          margin: 0;
          color: rgba(255,255,255,0.82);
        }

        @media (max-width: 768px) {
          .hsv-overlay-content { max-width: 38ch; }
        }
      `}</style>
    </div>
  );
};

export default HeroScrollVideo;
