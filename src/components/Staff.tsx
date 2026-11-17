import { useRef } from 'react';
import { gsap, useGSAP, EASE, prefersReducedMotion } from '../lib/gsap';
import { pluck } from '../lib/audio';
import { useTransition } from '../context/Transition';

const LINES = [0, 1, 2, 3, 4];
/** Spring constants for a plucked line: stiffness and damping. */
const STIFFNESS = 720;
const DAMPING = 4.2;

type Line = { y: number; amp: number; vel: number; at: number };

/**
 * Five staff lines behind the name. Each behaves like a string: cross one
 * with the pointer (or tap near it) and it rings, visually and, if sound is on, audibly.
 * Fills its positioned parent; purely decorative.
 */
export function Staff() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { ready } = useTransition();

  useGSAP(
    () => {
      const svg = svgRef.current;
      const host = svg?.parentElement;
      if (!svg || !host || !ready) return;

      const paths = Array.from(svg.querySelectorAll('path'));
      const lines: Line[] = LINES.map(() => ({ y: 0, amp: 0, vel: 0, at: 0.5 }));
      let width = 0;
      let dirty = true;

      const draw = () => {
        paths.forEach((path, i) => {
          const l = lines[i];
          path.setAttribute(
            'd',
            `M0 ${l.y.toFixed(1)} Q${(l.at * width).toFixed(1)} ${(l.y + l.amp * 2).toFixed(1)} ${width} ${l.y.toFixed(1)}`,
          );
        });
        dirty = false;
      };

      const layout = () => {
        width = svg.clientWidth;
        const height = svg.clientHeight;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        lines.forEach((l, i) => (l.y = height * (0.16 + i * 0.17)));
        dirty = true;
        draw();
      };
      layout();
      const observer = new ResizeObserver(layout);
      observer.observe(svg);

      if (prefersReducedMotion()) return () => observer.disconnect();

      const tick = (_time: number, deltaMs: number) => {
        const dt = Math.min(deltaMs, 34) / 1000;
        let moving = false;
        for (const l of lines) {
          if (l.amp === 0 && l.vel === 0) continue;
          l.vel += (-STIFFNESS * l.amp - DAMPING * l.vel) * dt;
          l.amp += l.vel * dt;
          if (Math.abs(l.amp) < 0.04 && Math.abs(l.vel) < 0.6) {
            l.amp = 0;
            l.vel = 0;
          }
          moving = true;
        }
        if (moving || dirty) draw();
      };
      gsap.ticker.add(tick);

      const strike = (index: number, at: number, velocity: number, audible: boolean) => {
        const l = lines[index];
        l.at = gsap.utils.clamp(0.06, 0.94, at);
        l.vel += gsap.utils.clamp(-950, 950, velocity);
        if (audible) pluck(index, Math.abs(velocity) / 950);
      };

      let lastY: number | null = null;
      const onMove = (e: PointerEvent) => {
        const rect = svg.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const at = (e.clientX - rect.left) / rect.width;
        if (lastY !== null) {
          const from = lastY;
          lines.forEach((l, i) => {
            if ((from - l.y) * (y - l.y) < 0) strike(i, at, (y - from) * 55, true);
          });
        }
        lastY = y;
      };
      const onLeave = () => (lastY = null);
      const onDown = (e: PointerEvent) => {
        // Touch has no hover, so a tap rings the nearest line.
        const rect = svg.getBoundingClientRect();
        const y = e.clientY - rect.top;
        let nearest = 0;
        lines.forEach((l, i) => {
          if (Math.abs(l.y - y) < Math.abs(lines[nearest].y - y)) nearest = i;
        });
        if (Math.abs(lines[nearest].y - y) < 44) {
          strike(nearest, (e.clientX - rect.left) / rect.width, 620, true);
        }
      };
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      host.addEventListener('pointerdown', onDown);

      // Intro: the lines draw across, then a silent strum shows they are live.
      gsap.fromTo(
        paths,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.8, ease: EASE.inOut, stagger: 0.09, delay: 0.1 },
      );
      LINES.forEach((i) => {
        gsap.delayedCall(1.9 + i * 0.1, () => strike(i, 0.72, 430, false));
      });

      return () => {
        observer.disconnect();
        gsap.ticker.remove(tick);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerleave', onLeave);
        host.removeEventListener('pointerdown', onDown);
      };
    },
    { dependencies: [ready] },
  );

  return (
    <svg className="staff" ref={svgRef} aria-hidden="true" focusable="false">
      {LINES.map((i) => (
        <path key={i} pathLength={1} />
      ))}
    </svg>
  );
}
