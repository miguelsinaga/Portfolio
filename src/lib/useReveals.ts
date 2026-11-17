import { useEffect, type RefObject } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';
import { setupReveals } from './reveal';
import { useTransition } from '../context/Transition';

/**
 * Per-page motion. Waits until the overlay has started to lift, then wires up the
 * [data-reveal] elements in `scope` and runs the page's own intro, if any.
 * Everything is skipped under prefers-reduced-motion: the page simply appears.
 */
export function useReveals(scope: RefObject<HTMLElement | null>, intro?: () => void) {
  const { ready } = useTransition();

  useGSAP(
    () => {
      const root = scope.current;
      if (!ready || !root) return;
      const mm = gsap.matchMedia(root);
      mm.add(MOTION_OK, () => {
        const revertSplits = setupReveals(root);
        intro?.();
        return revertSplits;
      });
    },
    { dependencies: [ready], scope },
  );
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
