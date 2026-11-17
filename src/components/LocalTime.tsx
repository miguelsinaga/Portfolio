import { useEffect, useState } from 'react';
import { site } from '../data/site';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: site.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** The current time where Miguel is, refreshed twice a minute. */
export function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time dateTime={now.toISOString()}>
      {formatter.format(now)} {site.timeZoneLabel}
    </time>
  );
}
