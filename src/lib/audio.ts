/**
 * A tiny plucked-string voice for the staff in the hero.
 * The five lines of a bass-clef staff spell G B D F A, a G9 chord, so the
 * strings are tuned to exactly that (one octave up, so laptop speakers carry it).
 * Silent until the visitor switches sound on.
 */

// Top line first: A4, F4, D4, B3, G3.
const FREQUENCIES = [440.0, 349.23, 293.66, 246.94, 196.0];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
const lastPlayed = [0, 0, 0, 0, 0];

export async function setSound(on: boolean): Promise<boolean> {
  if (!on) {
    enabled = false;
    return false;
  }
  try {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    await ctx.resume();
    enabled = true;
  } catch {
    enabled = false;
  }
  return enabled;
}

export function pluck(line: number, strength = 0.6) {
  if (!enabled || !ctx || !master) return;
  const now = ctx.currentTime;
  if (now - lastPlayed[line] < 0.09) return;
  lastPlayed[line] = now;

  const level = 0.1 + 0.25 * Math.min(1, Math.max(0, strength));
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.value = FREQUENCIES[line] ?? FREQUENCIES[0];

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, now);
  filter.frequency.exponentialRampToValueAtTime(500, now + 1.1);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(level, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  osc.connect(filter).connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 1.7);
}
