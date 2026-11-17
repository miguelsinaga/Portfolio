/** A diagonal arrow for outbound links. Inherits the text colour. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 16 16"
      width="0.8em"
      height="0.8em"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
