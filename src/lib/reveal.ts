import { gsap, ScrollTrigger, SplitText, EASE, DUR } from './gsap';

/**
 * Wires up every [data-reveal] element inside `scope`.
 * Call inside a gsap context (useGSAP) so tweens and triggers are cleaned up;
 * the returned function reverts the text splits.
 *
 *   data-reveal="lines"    masked line-by-line rise (headings, paragraphs)
 *   data-reveal="words"    words brighten as the block scrolls through
 *   data-reveal="fade"     short rise and fade
 *   data-reveal="stagger"  direct children rise in sequence
 *   data-reveal="cover"    clip-path wipe with a settling inner layer
 *   data-reveal="rule"     hairline draws from the left
 *   data-delay="0.2"       seconds, on any of the above
 */
export function setupReveals(scope: HTMLElement): () => void {
  const all = (name: string) =>
    Array.from(scope.querySelectorAll<HTMLElement>(`[data-reveal="${name}"]`));
  const delayOf = (el: HTMLElement) => parseFloat(el.dataset.delay ?? '0') || 0;
  const splits: SplitText[] = [];

  all('lines').forEach((el) => {
    let shown = false;
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      aria: 'none',
      autoSplit: true,
      onSplit: (self) => {
        // Re-splits (font load, resize) after the reveal leave the lines in place.
        if (!shown) gsap.set(self.lines, { yPercent: 115 });
      },
    });
    splits.push(split);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 94%',
      once: true,
      onEnter: () => {
        shown = true;
        gsap.to(split.lines, {
          yPercent: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: 0.09,
          delay: delayOf(el),
        });
      },
    });
  });

  all('words').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'word', aria: 'none' });
    splits.push(split);
    gsap.fromTo(
      split.words,
      { opacity: 0.2 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 58%', scrub: true },
      },
    );
  });

  all('fade').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 20,
      duration: 1,
      ease: EASE.soft,
      delay: delayOf(el),
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
    });
  });

  all('stagger').forEach((el) => {
    gsap.from(el.children, {
      autoAlpha: 0,
      y: 20,
      duration: 0.9,
      ease: EASE.soft,
      stagger: 0.06,
      delay: delayOf(el),
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });

  all('cover').forEach((el) => {
    const inner = el.firstElementChild;
    const trigger = { trigger: el, start: 'top 90%', once: true };
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: DUR.long,
        ease: EASE.inOut,
        delay: delayOf(el),
        scrollTrigger: trigger,
      },
    );
    if (inner) {
      gsap.fromTo(
        inner,
        { scale: 1.22 },
        { scale: 1, duration: 1.9, ease: EASE.soft, delay: delayOf(el), scrollTrigger: trigger },
      );
      // A slow drift against the scroll once it is on screen.
      gsap.fromTo(
        inner,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }
  });

  all('rule').forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: '0% 50%',
      duration: DUR.long,
      ease: EASE.inOut,
      delay: delayOf(el),
      scrollTrigger: { trigger: el, start: 'top 96%', once: true },
    });
  });

  return () => splits.forEach((s) => s.revert());
}
