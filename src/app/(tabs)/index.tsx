import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, Card, H2, P, Screen } from '@/components/ui';
import { C } from '@/constants/theme';
import { DAYS, EXERCISES, PLANS, SESSION_INFO, type SessionType } from '@/data/programme';
import { bestKey, useStore } from '@/lib/store';

export default function Home() {
  const { state } = useStore();
  const plan = PLANS[state.days];
  const today = new Date().getDay();
  const todayType = plan[today];
  const doneToday = state.history.some((h) => h.date.slice(0, 10) === new Date().toISOString().slice(0, 10));
  // Prochaine séance prévue après aujourd'hui
  let next = 1;
  while (next < 8 && !plan[(today + next) % 7]) next++;
  const nextDay = (today + next) % 7;
  const suggested: SessionType = todayType ?? 'A';
  const lastWeek = state.history.filter((h) => Date.now() - Date.parse(h.date) < 7 * 864e5).length;

  const start = (t: SessionType) => router.push({ pathname: '/seance', params: { type: t } });

  return (
    <Screen title="Mon programme de calisthénie" subtitle="Phase 1 · Bien gérer les bases">
      <Card dark>
        <Text style={{ color: '#D9C8BB', fontWeight: '700', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>
          {todayType ? (doneToday ? 'Séance du jour faite' : `Aujourd'hui · ${DAYS[today]}`) : `Repos aujourd'hui · prochaine séance ${DAYS[nextDay].toLowerCase()}`}
        </Text>
        <H2 light>
          Séance {suggested} · {SESSION_INFO[suggested].title}
        </H2>
        <P light>{SESSION_INFO[suggested].subtitle}</P>
        <View style={{ gap: 4 }}>
          {SESSION_INFO[suggested].blocks.map((b) => (
            <View key={b.name} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#EFE6DC', fontSize: 14 }}>{b.name}</Text>
              <Text style={{ color: '#D9C8BB', fontSize: 14, fontVariant: ['tabular-nums'] }}>{b.min} min</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 4 }} />
        <Button title={`Commencer la séance ${suggested} · 40 min`} icon="play" variant="secondary" big onPress={() => start(suggested)} />
        <Button title={`Faire plutôt la séance ${suggested === 'A' ? 'B (HIIT)' : 'A (kettlebell)'}`} variant="ghost" light onPress={() => start(suggested === 'A' ? 'B' : 'A')} />
      </Card>

      <Card>
        <H2>Ma semaine · {state.days} séances</H2>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <View key={d} style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ color: d === today ? C.brown : C.textDim, fontWeight: d === today ? '900' : '600', fontSize: 13 }}>{DAYS[d].slice(0, 3)}</Text>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: plan[d] ? (plan[d] === 'B' ? C.brownSoft : C.brown) : C.cardAlt,
                  borderWidth: d === today ? 2 : 0,
                  borderColor: C.brownDark,
                }}>
                <Text style={{ color: plan[d] ? C.white : C.textDim, fontWeight: '800' }}>{plan[d] ?? '–'}</Text>
              </View>
            </View>
          ))}
        </View>
        <P dim>
          A = technique + kettlebell · B = technique + HIIT · {lastWeek} séance{lastWeek > 1 ? 's' : ''} ces 7 derniers jours
        </P>
      </Card>

      <H2>Mes niveaux</H2>
      {EXERCISES.map((e) => {
        const lv = state.levels[e.id] ?? 0;
        const L = e.levels[lv];
        const best = state.best[bestKey(e.id, lv)] ?? 0;
        const pct = Math.min(1, best / L.target);
        return (
          <Card key={e.id} onPress={() => router.push({ pathname: '/exercice/[id]', params: { id: e.id } })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={e.icon as any} size={22} color={C.brown} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.brownDark, fontWeight: '800', fontSize: 16 }}>{e.name}</Text>
                <Text style={{ color: C.textDim, fontSize: 14 }}>
                  Niveau {L.num} · {L.name}
                </Text>
              </View>
              <Text style={{ color: C.brown, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
                {best}/{L.target}
                {L.unit === 'sec' ? ' s' : ''}
              </Text>
            </View>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: C.cardAlt, overflow: 'hidden' }}>
              <View style={{ width: `${pct * 100}%`, height: 6, backgroundColor: pct >= 1 ? C.ok : C.brown }} />
            </View>
          </Card>
        );
      })}

      <Card>
        <H2>Objectif : la phase 2</H2>
        <P dim>À atteindre au premier tour, quand tu es frais :</P>
        {EXERCISES.map((e) => {
          const ok = (state.levels[e.id] ?? 0) === e.levels.length - 1 && (state.best[bestKey(e.id, e.levels.length - 1)] ?? 0) >= e.levels[e.levels.length - 1].target;
          return (
            <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name={ok ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={ok ? C.ok : C.line} />
              <P>{e.phase2}</P>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
