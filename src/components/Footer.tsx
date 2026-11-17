import { site } from '../data/site';
import { useTransition } from '../context/Transition';
import { LocalTime } from './LocalTime';

export function Footer() {
  const { scrollToTop } = useTransition();
  return (
    <footer className="footer">
      <p className="label">
        © {site.year} {site.name}
      </p>
      <p className="label footer__place">
        {site.location} · <LocalTime />
      </p>
      <button type="button" className="label footer__top link" onClick={scrollToTop} data-cursor="link">
        Back to top
        <span aria-hidden="true"> ↑</span>
      </button>
      <p className="footer__fine" aria-hidden="true">
        Fine.
      </p>
    </footer>
  );
}
