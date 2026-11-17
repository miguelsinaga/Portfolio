import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, useGSAP, EASE, prefersReducedMotion } from '../lib/gsap';

type TransitionContextValue = {
  /** False while the overlay covers the screen. Page intros wait for this. */
  ready: boolean;
  /** Navigate with the staff wipe. Accepts '/path', '/path#id' or '/#id'. */
  go: (to: string, title?: string, meta?: string) => void;
  /** Smooth-scroll to an element id on the current page. */
  scrollToId: (id: string) => void;
  scrollToTop: () => void;
  /** Freeze or release page scroll (used by the mobile menu). */
  lockScroll: (locked: boolean) => void;
  lenis: RefObject<Lenis | null>;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>');
  return ctx;
}

/** The count-in a band leader gives before the tune starts. */
const COUNT_IN = ['one', 'two', 'one', 'two', 'three', 'four'];
/** Seconds per beat for the count-in (200 BPM). */
const BEAT = 0.3;
const BANDS = [0, 1, 2, 3, 4];

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();

  const [ready, setReady] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const busy = useRef(true);
  const introSeen = useRef<boolean | null>(null);
  const covered = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const prevPath = useRef(location.pathname);
  const positions = useRef(new Map<string, number>());
  const pathRef = useRef(location.pathname);
  const keyRef = useRef(location.key);
  pathRef.current = location.pathname;
  keyRef.current = location.key;

  const bands = () => overlayRef.current?.querySelectorAll('.overlay__band') ?? [];

  const finish = useCallback(() => {
    busy.current = false;
    if (overlayRef.current) overlayRef.current.dataset.active = 'false';
    lenisRef.current?.start();
  }, []);

  /* Smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in step. */
  useEffect(() => {
    history.scrollRestoration = 'manual';
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (busy.current) lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* Remember where each history entry was scrolled to, for back and forward. */
  useEffect(() => {
    const onScroll = () => positions.current.set(keyRef.current, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* First load: the count-in, then the bands lift. */
  useGSAP(() => {
    document.getElementById('boot')?.remove();
    const overlay = overlayRef.current;
    if (!overlay) return;
    // Park the page-change label below its mask until a transition needs it.
    gsap.set([metaRef.current, titleRef.current], { yPercent: 115 });

    if (prefersReducedMotion()) {
      gsap.set(bands(), { scaleY: 0 });
      setReady(true);
      finish();
      return;
    }

    // Decided once per page load (a ref, so StrictMode's double run agrees with itself).
    if (introSeen.current === null) {
      introSeen.current = false;
      try {
        introSeen.current = sessionStorage.getItem('intro-seen') === '1';
        sessionStorage.setItem('intro-seen', '1');
      } catch {
        /* storage unavailable: play the intro */
      }
    }
    const seen = introSeen.current;

    const tl = gsap.timeline({ onComplete: finish });
    if (!seen) {
      const words = Array.from(overlay.querySelectorAll('.overlay__count span'));
      const caption = overlay.querySelector('.overlay__caption');
      // "one … two … one two three four": two half-time beats, then four in time.
      const at = [0, 2, 4, 5, 6, 7].map((b) => 0.25 + b * BEAT);
      tl.fromTo(caption, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: EASE.soft }, 0);
      words.forEach((word, i) => {
        if (i > 0) tl.set(words[i - 1], { autoAlpha: 0 }, at[i]);
        tl.set(word, { autoAlpha: 1 }, at[i]);
        tl.fromTo(word, { yPercent: 55 }, { yPercent: 0, duration: 0.3, ease: EASE.out }, at[i]);
      });
      const end = at[at.length - 1] + BEAT;
      tl.to([words[words.length - 1], caption], { autoAlpha: 0, duration: 0.2, ease: EASE.in }, end);
    }
    tl.add(() => setReady(true), seen ? 0.15 : '+=0.05').to(
      bands(),
      {
        scaleY: 0,
        transformOrigin: '50% 0%',
        duration: 1,
        ease: EASE.inOut,
        stagger: { each: 0.07, from: 'end' },
      },
      '<',
    );
  }, []);

  const jump = useCallback((target: number | HTMLElement) => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else if (typeof target === 'number') window.scrollTo(0, target);
    else target.scrollIntoView();
  }, []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView();
  }, []);

  const scrollToTop = useCallback(() => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo(0, 0);
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    document.documentElement.classList.toggle('is-locked', locked);
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locked) lenis.stop();
    else if (!busy.current) lenis.start();
  }, []);

  const go = useCallback(
    (to: string, title = '', meta = '') => {
      const [rawPath, hash] = to.split('#');
      const path = rawPath || '/';

      if (path === pathRef.current) {
        if (hash) scrollToId(hash);
        else scrollToTop();
        return;
      }
      if (busy.current) return;

      if (prefersReducedMotion()) {
        pendingHash.current = hash ?? null;
        navigate(path);
        return;
      }

      busy.current = true;
      lenisRef.current?.stop();
      const overlay = overlayRef.current;
      if (overlay) overlay.dataset.active = 'true';
      if (titleRef.current) titleRef.current.textContent = title;
      if (metaRef.current) metaRef.current.textContent = meta;
      const label = [metaRef.current, titleRef.current];

      gsap
        .timeline()
        .set(bands(), { transformOrigin: '50% 100%' })
        .to(bands(), {
          scaleY: 1,
          duration: 0.8,
          ease: EASE.inOut,
          stagger: { each: 0.06, from: 'end' },
        })
        .fromTo(
          label,
          { yPercent: 115 },
          { yPercent: 0, duration: 0.7, ease: EASE.out, stagger: 0.07 },
          '-=0.35',
        )
        .add(() => {
          covered.current = true;
          pendingHash.current = hash ?? null;
          setReady(false);
          navigate(path);
        }, '+=0.1');
    },
    [navigate, scrollToId, scrollToTop],
  );

  /* After the route has rendered: place the scroll, move focus, lift the bands. */
  useLayoutEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    const hash = pendingHash.current;
    pendingHash.current = null;
    const wasCovered = covered.current;
    covered.current = false;

    if (navType === 'POP' && !wasCovered) {
      jump(positions.current.get(location.key) ?? 0);
    } else {
      const el = hash ? document.getElementById(hash) : null;
      jump(el ?? 0);
    }
    document.getElementById('main')?.focus({ preventScroll: true });

    if (!wasCovered) {
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    }

    const label = [metaRef.current, titleRef.current];
    const tl = gsap
      .timeline({ delay: 0.25, onComplete: finish })
      .to(label, { yPercent: -115, duration: 0.5, ease: EASE.in, stagger: 0.05 })
      .add(() => setReady(true))
      .set(bands(), { transformOrigin: '50% 0%' })
      .to(bands(), {
        scaleY: 0,
        duration: 1,
        ease: EASE.inOut,
        stagger: { each: 0.06, from: 'end' },
      });
    return () => {
      // Only reached if the route changes again mid-reveal: finish instantly.
      tl.progress(1);
    };
  }, [location.pathname, location.key, navType, jump, finish]);

  const value = useMemo(
    () => ({ ready, go, scrollToId, scrollToTop, lockScroll, lenis: lenisRef }),
    [ready, go, scrollToId, scrollToTop, lockScroll],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div className="overlay" ref={overlayRef} data-active="true" aria-hidden="true">
        {BANDS.map((i) => (
          <span key={i} className="overlay__band" style={{ top: `${i * 20}%` }} />
        ))}
        <div className="overlay__count">
          {COUNT_IN.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
        <p className="overlay__caption">Miguel Sinaga — Portfolio</p>
        <div className="overlay__label">
          <span className="overlay__mask">
            <span className="overlay__meta" ref={metaRef} />
          </span>
          <span className="overlay__mask">
            <span className="overlay__title" ref={titleRef} />
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
