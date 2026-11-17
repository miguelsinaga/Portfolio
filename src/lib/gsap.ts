import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Shared motion tokens. Every animation on the site draws from these. */
export const EASE = {
  /** Arrivals: fast start, long settle. */
  out: 'expo.out',
  /** Curtains and covers: symmetrical, weighty. */
  inOut: 'power4.inOut',
  /** Small fades and nudges. */
  soft: 'power3.out',
  /** Exits. */
  in: 'power3.in',
} as const;

export const DUR = {
  micro: 0.25,
  short: 0.6,
  base: 1.2,
  long: 1.5,
} as const;

export const NO_MOTION = '(prefers-reduced-motion: reduce)';
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(NO_MOTION).matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
