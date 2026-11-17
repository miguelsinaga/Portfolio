import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, finePointer, prefersReducedMotion } from '../lib/gsap';

/** Pulls its child toward the pointer and springs back on leave. Mouse only. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.4)' });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Measure from the resting position, not the displaced one.
      const cx = r.left + r.width / 2 - Number(gsap.getProperty(el, 'x'));
      const cy = r.top + r.height / 2 - Number(gsap.getProperty(el, 'y'));
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <span ref={ref} className={['magnetic', className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
