// Statistiques : régularité, temps passé, progression du 1er tour par exercice.
import { Text, View } from 'react-native';

import { Card, H2, P, Screen } from '@/components/ui';
import { C } from '@/constants/theme';
import { EXERCISES, type Exercise } from '@/data/programme';
import { bestKey, useStore, type Done } from '@/lib/store';

const DAY = 864e5;
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function mondayOf(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 0.5, borderColor: C.line }}>
      <Text style={{ color: C.brownDark, fontSize: 26, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Text style={{ color: C.textDim, fontSize: 13 }}>{label}</Text>
    </View>
  );
}

/** 8 dernières semaines : une case par jour, pleine si séance faite. */
function Calendar({ history }: { history: Done[] }) {
  const done = new Map<string, Done['type']>();
  for (const h of history) done.set(dayKey(new Date(h.date)), h.type);
  const start = mondayOf(new Date(Date.now() - 7 * 7 * DAY));
  const today = dayKey(new Date());
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', color: C.textDim, fontSize: 12, fontWeight: '700' }}>
            {d}
          </Text>
        ))}
      </View>
      {Array.from({ length: 8 }, (_, w) => (
        <View key={w} style={{ flexDirection: 'row', gap: 6 }}>
          {Array.from({ length: 7 }, (_, d) => {
            const day = new Date(start.getTime() + (w * 7 + d) * DAY);
            const k = dayKey(day);
            const t = done.get(k);
            const future = day.getTime() > Date.now();
            return (
              <View
                key={d}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t ? (t === 'B' ? C.brownSoft : C.brown) : future ? 'transparent' : C.cardAlt,
                  borderWidth: k === today ? 2 : 0,
                  borderColor: C.brownDark,
                }}>
                {t ? <Text style={{ color: C.white, fontSize: 11, fontWeight: '800' }}>{t}</Text> : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/** Barres des 12 dernières valeurs du 1er tour (une couleur par niveau) et trait de l'objectif du niveau actuel. */
function ExoChart({ e, history, level, best }: { e: Exercise; history: Done[]; level: number; best: number | undefined }) {
  const pts = history
    .flatMap((h) => h.results.filter((r) => r.exo === e.id).map((r) => ({ ...r, date: h.date })))
    .slice(-12);
  const L = e.levels[level];
  const max = Math.max(L.target, ...pts.map((p) => p.value), 1);
  const H = 110;
  const unit = L.unit === 'sec' ? ' s' : '';
  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <H2>{e.name}</H2>
        <Text style={{ color: C.textDim, fontSize: 13 }}>
          Niveau {L.num} · record {best ?? 0}/{L.target}
          {unit}
        </Text>
      </View>
      {pts.length ? (
        <View style={{ height: H + 22 }}>
          {/* objectif du niveau actuel */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: H - (L.target / max) * H, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: C.ok }} />
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: H, gap: 6 }}>
            {pts.map((p, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: H }}>
                <Text style={{ color: C.textDim, fontSize: 10, fontVariant: ['tabular-nums'] }}>{p.value}</Text>
                <View style={{ width: '100%', height: Math.max(3, (p.value / max) * (H - 14)), borderRadius: 4, backgroundColor: p.level === level ? C.brown : C.brownSoft, opacity: p.level === level ? 1 : 0.55 }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
            {pts.map((p, i) => (
              <Text key={i} style={{ flex: 1, textAlign: 'center', color: C.textDim, fontSize: 10 }}>
                N{e.levels[p.level].num.split(' ')[0]}
              </Text>
            ))}
          </View>
        </View>
      ) : (
        <P dim>Pas encore de séance : tes répétitions du 1er tour apparaîtront ici.</P>
      )}
    </Card>
  );
}

export default function Stats() {
  const { state } = useStore();
  const h = state.history;
  const minutes = h.reduce((a, x) => a + (x.min || 0), 0);
  const weekStart = mondayOf(new Date()).getTime();
  const thisWeek = h.filter((x) => Date.parse(x.date) >= weekStart).length;
  // Semaines d'affilée avec au moins une séance (la semaine en cours compte si elle en a une)
  let streak = 0;
  for (let w = thisWeek ? 0 : 1; w < 200; w++) {
    const a = weekStart - w * 7 * DAY;
    if (h.some((x) => Date.parse(x.date) >= a && Date.parse(x.date) < a + 7 * DAY)) streak++;
    else break;
  }
  const levelsDone = EXERCISES.reduce((a, e) => a + (state.levels[e.id] ?? 0), 0);
  const levelsAll = EXERCISES.reduce((a, e) => a + e.levels.length - 1, 0);

  return (
    <Screen title="Mes stats" subtitle="La régularité prime sur le temps passé.">
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat value={`${thisWeek}/${state.days}`} label="cette semaine" />
        <Stat value={String(streak)} label={`semaine${streak > 1 ? 's' : ''} d’affilée`} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat value={String(h.length)} label="séances" />
        <Stat value={minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60}` : `${minutes} min`} label="d’entraînement" />
      </View>
      <Card>
        <H2>Progression vers la phase 2</H2>
        <View style={{ height: 10, borderRadius: 5, backgroundColor: C.cardAlt, overflow: 'hidden' }}>
          <View style={{ width: `${(levelsDone / levelsAll) * 100}%`, height: 10, backgroundColor: C.ok }} />
        </View>
        <P dim>
          {levelsDone} niveau{levelsDone > 1 ? 'x' : ''} franchi{levelsDone > 1 ? 's' : ''} sur {levelsAll}
        </P>
      </Card>
      <Card>
        <H2>Mes 8 dernières semaines</H2>
        <Calendar history={h} />
      </Card>
      <H2>1er tour, séance après séance</H2>
      {EXERCISES.map((e) => (
        <ExoChart key={e.id} e={e} history={h} level={state.levels[e.id] ?? 0} best={state.best[bestKey(e.id, state.levels[e.id] ?? 0)]} />
      ))}
    </Screen>
  );
}
