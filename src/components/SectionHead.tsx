/**
 * A section opener in the manner of a lead sheet: a boxed rehearsal mark,
 * the section name, and an expression marking set in italics on the right.
 */
export function SectionHead({
  id,
  mark,
  title,
  note,
}: {
  id: string;
  mark: string;
  title: string;
  note?: string;
}) {
  return (
    <header className="section-head">
      <div className="section-head__row" data-reveal="fade">
        <span className="mark" aria-hidden="true">
          {mark}
        </span>
        <h2 id={id} className="label section-head__title">
          {title}
        </h2>
        {note && <p className="section-head__note">{note}</p>}
      </div>
      <span className="rule" data-reveal="rule" aria-hidden="true" />
    </header>
  );
}
