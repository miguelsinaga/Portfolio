import type { ReactNode } from 'react';
import type { CoverKind } from '../data/projects';

/**
 * Generative cover art, one composition per project, drawn in the site's two inks.
 * These stand in for screenshots until real imagery is added. Each is an 800 square
 * with its subject inside the central 600, so it survives both landscape and
 * portrait crops (preserveAspectRatio="slice").
 */

/** Small seeded PRNG so the "random" layouts are identical on every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Syncopate: a layered graph of candidate notes on a staff, one path chosen. */
function SyncopateArt() {
  const gap = 56;
  const staff = [-2, -1, 0, 1, 2].map((n) => 400 + n * gap);
  const columns = [
    [-3, 1, 4],
    [-2, 0, 3],
    [-4, -1, 2],
    [-2, 1, 5],
    [-5, 0, 2],
    [-3, -1, 3],
    [-4, 1, 4],
    [-2, 0, 2],
  ];
  const chosen = [1, 1, 0, 1, 1, 2, 1, 1];
  const x = (i: number) => 150 + i * (500 / (columns.length - 1));
  const y = (step: number) => 400 - step * (gap / 2);

  const edges: ReactNode[] = [];
  for (let c = 0; c < columns.length - 1; c++) {
    columns[c].forEach((a, i) =>
      columns[c + 1].forEach((b, j) =>
        edges.push(
          <line key={`${c}-${i}-${j}`} x1={x(c)} y1={y(a)} x2={x(c + 1)} y2={y(b)} />,
        ),
      ),
    );
  }
  const route = columns.map((col, c) => `${x(c)},${y(col[chosen[c]])}`).join(' ');

  return (
    <>
      <g className="art-hair">
        {staff.map((sy) => (
          <line key={sy} x1={0} y1={sy} x2={800} y2={sy} />
        ))}
      </g>
      <g className="art-faint">{edges}</g>
      <polyline className="art-accent-line" points={route} />
      {columns.map((col, c) =>
        col.map((step, i) => (
          <ellipse
            key={`${c}-${i}`}
            className={i === chosen[c] ? 'art-accent-fill' : 'art-node'}
            cx={x(c)}
            cy={y(step)}
            rx={19}
            ry={14}
            transform={`rotate(-20 ${x(c)} ${y(step)})`}
          />
        )),
      )}
    </>
  );
}

/* Judol Detector: a page of text with the matches picked out. */
function JudolArt() {
  const rand = mulberry32(88);
  const rows: ReactNode[] = [];
  for (let r = 0; r < 11; r++) {
    const yy = 196 + r * 40;
    const limit = r === 10 ? 420 : 645;
    let xx = 155;
    let w = 0;
    while (xx < limit - 30) {
      const width = Math.min(34 + Math.floor(rand() * 84), limit - xx);
      const hit = rand() < 0.13 && width > 44;
      rows.push(
        hit ? (
          <g key={`${r}-${w}`}>
            <rect className="art-accent-fill" x={xx - 7} y={yy - 11} width={width + 14} height={36} rx={5} />
            <rect className="art-on-accent" x={xx} y={yy} width={width} height={14} rx={7} />
          </g>
        ) : (
          <rect key={`${r}-${w}`} className="art-soft" x={xx} y={yy} width={width} height={14} rx={7} />
        ),
      );
      xx += width + 16;
      w++;
    }
  }
  return <>{rows}</>;
}

/* Voxelizer 3000: a voxelised sphere in isometric view, one octant picked out. */
function VoxelArt() {
  const R = 4;
  const size = 34;
  const inside = (x: number, y: number, z: number) => {
    const cx = x + 0.5;
    const cy = y + 0.5;
    const cz = z + 0.5;
    return cx * cx + cy * cy + cz * cz <= 4.3 * 4.3;
  };
  const project = (x: number, y: number, z: number) =>
    `${(400 + (x - y) * size * 0.866).toFixed(1)},${(404 + (x + y) * size * 0.5 - z * size).toFixed(1)}`;

  const cells: [number, number, number][] = [];
  for (let x = -R - 1; x <= R; x++)
    for (let y = -R - 1; y <= R; y++)
      for (let z = -R - 1; z <= R; z++) if (inside(x, y, z)) cells.push([x, y, z]);
  cells.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));

  const faces: ReactNode[] = [];
  cells.forEach(([x, y, z]) => {
    const octant = x >= 0 && y >= 0 && z >= 0;
    const tone = octant ? 'art-vox-accent' : 'art-vox';
    const key = `${x},${y},${z}`;
    if (!inside(x, y, z + 1))
      faces.push(
        <polygon
          key={`${key}t`}
          className={`${tone}-top`}
          points={`${project(x, y, z + 1)} ${project(x + 1, y, z + 1)} ${project(x + 1, y + 1, z + 1)} ${project(x, y + 1, z + 1)}`}
        />,
      );
    if (!inside(x, y + 1, z))
      faces.push(
        <polygon
          key={`${key}l`}
          className={`${tone}-left`}
          points={`${project(x, y + 1, z + 1)} ${project(x + 1, y + 1, z + 1)} ${project(x + 1, y + 1, z)} ${project(x, y + 1, z)}`}
        />,
      );
    if (!inside(x + 1, y, z))
      faces.push(
        <polygon
          key={`${key}r`}
          className={`${tone}-right`}
          points={`${project(x + 1, y, z + 1)} ${project(x + 1, y + 1, z + 1)} ${project(x + 1, y + 1, z)} ${project(x + 1, y, z)}`}
        />,
      );
  });
  return <g className="art-vox-group">{faces}</g>;
}

/* SVD Timbre Synth: a tone at the top, its partials beneath in falling weight. */
function TimbreArt() {
  const amps = [46, 31, 21, 14, 9];
  const x0 = 110;
  const x1 = 690;
  const samples = 180;
  const wave = (yy: number, fn: (t: number) => number) => {
    let d = '';
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const env = Math.sin(Math.PI * t);
      d += `${i === 0 ? 'M' : 'L'}${(x0 + t * (x1 - x0)).toFixed(1)} ${(yy - fn(t) * env).toFixed(1)}`;
    }
    return d;
  };
  const phases = [0.4, 1.7, 0.2, 2.6, 1.1];
  const partial = (i: number) => (t: number) =>
    amps[i] * Math.sin(2 * Math.PI * (i + 1) * 2 * t + phases[i]);
  const sum = (t: number) => amps.reduce((acc, _a, i) => acc + partial(i)(t), 0) * 0.66;

  return (
    <>
      <path className="art-accent-line" d={wave(228, sum)} />
      {amps.map((_a, i) => (
        <path
          key={i}
          className="art-line"
          style={{ opacity: 1 - i * 0.15 }}
          d={wave(338 + i * 64, partial(i))}
        />
      ))}
    </>
  );
}

/* BandWith: four lanes, falling notes, one landing on its receptor. */
function BandwithArt() {
  const laneX = (lane: number) => 208 + lane * 96;
  const notes: [number, number][] = [
    [0, 176],
    [2, 222],
    [3, 300],
    [0, 372],
    [2, 430],
    [3, 486],
  ];
  return (
    <>
      <g className="art-hair">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={laneX(i)} y1={0} x2={laneX(i)} y2={800} />
        ))}
      </g>
      <rect className="art-soft" x={laneX(1) + 12} y={262} width={72} height={170} rx={12} />
      {notes.map(([lane, yy]) => (
        <rect key={`${lane}-${yy}`} className="art-ink" x={laneX(lane) + 12} y={yy} width={72} height={24} rx={12} />
      ))}
      {[0, 1, 2, 3].map((lane) => (
        <rect
          key={lane}
          className={lane === 1 ? 'art-accent-fill' : 'art-outline'}
          x={laneX(lane) + 12}
          y={548}
          width={72}
          height={24}
          rx={12}
        />
      ))}
      <rect className="art-accent-ring" x={laneX(1) - 2} y={534} width={100} height={52} rx={26} />
      <g className="art-text">
        {['D', 'F', 'J', 'K'].map((key, lane) => (
          <text key={key} x={laneX(lane) + 48} y={626} textAnchor="middle">
            {key}
          </text>
        ))}
      </g>
    </>
  );
}

/* Maison Safe: SOS in Morse, on a field of signal rings. */
function MaisonArt() {
  const dot = 22;
  const dash = 62;
  const gap = 16;
  const groupGap = 32;
  const pattern = [dot, dot, dot, dash, dash, dash, dot, dot, dot];
  let xx = 161;
  const marks = pattern.map((w, i) => {
    const el = <rect key={i} className="art-accent-fill" x={xx} y={389} width={w} height={22} rx={11} />;
    xx += w + ((i + 1) % 3 === 0 ? groupGap : gap);
    return el;
  });
  return (
    <>
      <g className="art-ring">
        {[110, 170, 230, 290, 350, 410].map((r) => (
          <circle key={r} cx={400} cy={400} r={r} />
        ))}
      </g>
      <rect className="art-surface" x={0} y={366} width={800} height={68} />
      {marks}
    </>
  );
}

const ART: Record<CoverKind, () => ReactNode> = {
  syncopate: SyncopateArt,
  judol: JudolArt,
  voxel: VoxelArt,
  timbre: TimbreArt,
  bandwith: BandwithArt,
  maison: MaisonArt,
};

export function Cover({ kind, label }: { kind: CoverKind; label?: string }) {
  const Art = ART[kind];
  return (
    <svg
      className="cover-art"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Art />
    </svg>
  );
}
