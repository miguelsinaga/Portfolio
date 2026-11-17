import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, finePointer, prefersReducedMotion } from '../lib/gsap';

/**
 * A follower that sits alongside the native cursor (never replaces it).
 * Elements opt in with data-cursor="view" | "link" and an optional data-cursor-label.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const label = el.querySelector('.cursor__label');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.dataset.visible = 'true';
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cursor]') : null;
      const state = target?.dataset.cursor ?? '';
      el.dataset.state = state;
      if (label) label.textContent = target?.dataset.cursorLabel ?? (state === 'view' ? 'View' : '');
    };
    const leave = () => {
      el.dataset.visible = 'false';
      visible = false;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  // The element under the pointer changes on navigation without a pointerover.
  useEffect(() => {
    if (ref.current) ref.current.dataset.state = '';
  }, [pathname]);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor__dot">
        <span className="cursor__label" />
      </span>
    </div>
  );
}
