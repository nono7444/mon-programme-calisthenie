// Construit la liste des étapes d'une séance de 40 min.
import {
  EXERCISES,
  HIIT,
  KB_MOVES,
  STRETCH_PHASE1,
  WARMUP_LOWER,
  WARMUP_UPPER,
  type ExoId,
  type KbMove,
  type Move,
  type SessionType,
} from '@/data/programme';

export const HIIT_ROUNDS = 2;

export type Block = 'echauffement' | 'circuit' | 'kettlebell' | 'hiit' | 'etirements';

export type Step =
  | { kind: 'move'; block: Block; move: Move; index: number; count: number }
  | { kind: 'exo'; block: 'circuit'; exo: ExoId; level: number; round: number; rounds: number; pos: number }
  | { kind: 'kb'; block: 'kettlebell'; move: KbMove; set: number }
  | { kind: 'rest'; block: Block; sec: number; label: string };

export const BLOCK_NAMES: Record<Block, string> = {
  echauffement: 'Échauffement',
  circuit: 'Circuit technique',
  kettlebell: 'Kettlebell 12 kg',
  hiit: 'Circuit HIIT',
  etirements: 'Étirements',
};

export function buildSession(type: SessionType, levels: Record<ExoId, number>, restExo: number): Step[] {
  const steps: Step[] = [];
  const moves = (block: Block, list: Move[]) => list.forEach((move, index) => steps.push({ kind: 'move', block, move, index, count: list.length }));

  // 1. Échauffement haut (5 min max) puis bas (3 min max)
  moves('echauffement', WARMUP_UPPER);
  moves('echauffement', WARMUP_LOWER);

  // 2. Circuit technique : 3 tours (séance A) ou 2 tours (séance B)
  const rounds = type === 'A' ? 3 : 2;
  for (let r = 1; r <= rounds; r++) {
    EXERCISES.forEach((e, i) => {
      steps.push({ kind: 'exo', block: 'circuit', exo: e.id, level: levels[e.id] ?? 0, round: r, rounds, pos: i });
      const lastOfRound = i === EXERCISES.length - 1;
      if (!lastOfRound) steps.push({ kind: 'rest', block: 'circuit', sec: restExo, label: `Ensuite : ${EXERCISES[i + 1].name}` });
      else if (r < rounds) steps.push({ kind: 'rest', block: 'circuit', sec: 120, label: `Pause entre les tours · ensuite le tour ${r + 1}` });
    });
  }

  if (type === 'A') {
    // 3. Kettlebell : goblet squat puis swings, 2 séries chacun
    steps.push({ kind: 'rest', block: 'kettlebell', sec: 60, label: 'Prends ta kettlebell · ensuite : goblet squat' });
    for (const key of ['goblet', 'swing'] as const) {
      const m = KB_MOVES[key];
      for (let s = 1; s <= m.sets; s++) {
        steps.push({ kind: 'kb', block: 'kettlebell', move: m, set: s });
        if (s < m.sets || key === 'goblet') steps.push({ kind: 'rest', block: 'kettlebell', sec: m.rest, label: s < m.sets ? `Ensuite : ${m.name}, série ${s + 1}` : 'Ensuite : swings' });
      }
    }
    // 4. Retour au calme : squat profond + fléchisseurs des hanches
    moves('etirements', STRETCH_PHASE1.slice(1));
  } else {
    // 3. HIIT : le livre en prévoit 4 tours ; 2 tours pour tenir dans les 40 min (15 s entre exercices, 1 min entre tours)
    const H = HIIT_ROUNDS;
    steps.push({ kind: 'rest', block: 'hiit', sec: 60, label: `Prépare-toi pour le HIIT · ${H} tours` });
    for (let r = 1; r <= H; r++) {
      HIIT.forEach((m, i) => {
        steps.push({ kind: 'move', block: 'hiit', move: { ...m, name: `${m.name}` }, index: i, count: HIIT.length });
        const last = i === HIIT.length - 1;
        if (!last) steps.push({ kind: 'rest', block: 'hiit', sec: 15, label: `Tour ${r}/${H} · ensuite : ${HIIT[i + 1].name}` });
        else if (r < H) steps.push({ kind: 'rest', block: 'hiit', sec: 60, label: `Fin du tour ${r} · ensuite le tour ${r + 1}` });
      });
    }
    // 4. Étirements Phase 1
    moves('etirements', STRETCH_PHASE1);
  }
  return steps;
}

/** Durée estimée (min) d'une liste d'étapes, pour l'affichage. */
export function estimate(steps: Step[]) {
  let s = 0;
  for (const st of steps) {
    if (st.kind === 'rest') s += st.sec;
    else if (st.kind === 'move') s += st.move.sec ?? 25;
    else if (st.kind === 'exo') s += 45;
    else s += 40;
  }
  return Math.round(s / 60);
}
