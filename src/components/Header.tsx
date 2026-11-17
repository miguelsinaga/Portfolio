import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { useTransition } from '../context/Transition';
import { site } from '../data/site';
import { TLink } from './TLink';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export function Header() {
  const { pathname } = useLocation();
  const { ready, lockScroll } = useTransition();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  /* Step aside on the way down, come back on the way up. */
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header || !ready) return;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          header.dataset.scrolled = String(y > 24);
          header.dataset.hidden = String(self.direction === 1 && y > 160);
        },
      });
    },
    { dependencies: [ready, pathname] },
  );

  /* Mark the section in view; on a project page the answer is always Work. */
  useEffect(() => {
    if (pathname !== '/') {
      setActive(pathname.startsWith('/work') ? 'work' : null);
      return;
    }
    setActive(null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname, ready]);

  /* Mobile menu: lock scroll, hide the page from assistive tech, close on Escape. */
  useEffect(() => {
    lockScroll(open);
    const page = [document.getElementById('main'), document.querySelector<HTMLElement>('footer')];
    page.forEach((el) => {
      if (el) el.inert = open;
    });
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lockScroll]);

  useEffect(() => setOpen(false), [pathname]);

  /* If the viewport grows past the mobile layout, the menu has no reason to stay open. */
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 48rem)');
    const onChange = () => wide.matches && setOpen(false);
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header className="header" ref={headerRef} data-open={open}>
        <TLink to="/" className="wordmark" transitionTitle="Miguel Sinaga" transitionMeta="Home" data-cursor="link">
          {site.name}
          <span className="note" aria-hidden="true" />
        </TLink>

        <nav className="nav" aria-label="Primary">
          {NAV.map(({ id, label }) => (
            <TLink
              key={id}
              to={`/#${id}`}
              className="nav__link"
              transitionTitle={label}
              transitionMeta="Miguel Sinaga"
              aria-current={active === id ? 'true' : undefined}
              data-cursor="link"
            >
              {label}
            </TLink>
          ))}
        </nav>

        <div className="header__tools">
          <ThemeToggle />
          <button
            type="button"
            className="menu-btn"
            ref={menuButtonRef}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div id="menu" className="menu" data-open={open} role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Menu">
          <ul className="menu__list">
            {NAV.map(({ id, label }, i) => (
              <li key={id} className="menu__item">
                <TLink
                  to={`/#${id}`}
                  className="menu__link"
                  style={{ transitionDelay: open ? `${0.25 + i * 0.07}s` : '0s' }}
                  transitionTitle={label}
                  transitionMeta="Miguel Sinaga"
                  onClick={() => {
                    // Release the scroll before the link scrolls or navigates.
                    setOpen(false);
                    lockScroll(false);
                  }}
                  tabIndex={open ? undefined : -1}
                >
                  {label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="menu__socials">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer" tabIndex={open ? undefined : -1}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
