import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useTransition } from '../context/Transition';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  /** Shown on the overlay while the page changes. */
  transitionTitle?: string;
  transitionMeta?: string;
};

/** An internal link that plays the page transition instead of jumping. */
export function TLink({ to, transitionTitle, transitionMeta, onClick, children, ...rest }: Props) {
  const { go } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Leave new-tab and modified clicks to the browser.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to, transitionTitle, transitionMeta);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
