// Séance guidée de 40 min : échauffement, circuit technique, kettlebell ou HIIT, étirements.
import Ionicons from '@expo/vector-icons/Ionicons';
import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bullets, Button, Card, H2, P, PageImage, Photo } from '@/components/ui';
import { C } from '@/constants/theme';
import { EXERCISES, exo, type ExoId, type SessionType } from '@/data/programme';
import { beep, preloadSounds, say, speakable } from '@/lib/sound';
import { BLOCK_NAMES, buildSession, type Step } from '@/lib/session';
import { bestKey, useStore } from '@/lib/store';

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.max(0, Math.floor(sec % 60))).padStart(2, '0')}`;

/** Compte à rebours basé sur l'heure (reste juste même si l'écran se met en veille). */
function useCountdown(onEnd: () => void, soundOn: boolean) {
  const [end, setEnd] = useState<number | null>(null);
  const [paused, setPaused] = useState<number | null>(null); // secondes restantes en pause
  const [, tick] = useState(0);
  const lastBeep = useRef(-1);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  useEffect(() => {
    if (end == null) return;
    const t = setInterval(() => {
      const left = Math.ceil((end - Date.now()) / 1000);
      if (left <= 3 && left > 0 && lastBeep.current !== left) {
        lastBeep.current = left;
        beep('bip', soundOn);
      }
      if (left <= 0) {
        clearInterval(t);
        setEnd(null);
        lastBeep.current = -1;
        beep('fin', soundOn);
        endRef.current();
      }
      tick((n) => n + 1);
    }, 200);
    return () => clearInterval(t);
  }, [end, soundOn]);
  const left = end != null ? Math.max(0, Math.ceil((end - Date.now()) / 1000)) : paused;
  return {
    left,
    running: end != null,
    start: (sec: number) => {
      lastBeep.current = -1;
      setPaused(null);
      setEnd(Date.now() + sec * 1000);
    },
    pause: () => {
      if (end == null) return;
      setPaused(Math.max(0, Math.ceil((end - Date.now()) / 1000)));
      setEnd(null);
    },
    add: (sec: number) => setEnd((e) => (e != null ? e + sec * 1000 : e)),
    stop: () => {
      setEnd(null);
      setPaused(null);
    },
  };
}

export default function Seance() {
  useKeepAwake();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type: SessionType }>();
  const t: SessionType = type === 'B' ? 'B' : 'A';
  const { state, update } = useStore();
  const steps = useMemo(() => buildSession(t, state.levels, state.restExo), [t]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [startedAt] = useState(Date.now());
  const [value, setValue] = useState(0);
  const [watch, setWatch] = useState<number | null>(null); // chrono montant (maintiens)
  const [, tick] = useState(0);
  const scroll = useRef<ScrollView>(null);
  const saved = useRef(false);

  useEffect(() => preloadSounds(), []);
  const step: Step | undefined = steps[idx];
  const next = () => {
    cd.stop();
    setWatch(null);
    setIdx((i) => i + 1);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const cd = useCountdown(next, state.sound);

  // Pause : le chrono démarre tout seul. Mouvement chronométré : au toucher de « Démarrer ».
  useEffect(() => {
    // Annonce à voix haute de chaque étape
    const v = state.voice;
    if (!step) say('Séance terminée. Bravo !', v);
    else if (step.kind === 'rest') say(`Pause, ${step.sec} secondes. ${step.label.replace(/·/g, '.')}`, v);
    else if (step.kind === 'move') say(`${step.move.name}. ${speakable(step.move.dose)}`, v);
    else if (step.kind === 'kb') say(`${step.move.name}, série ${step.set}. ${step.move.reps} répétitions`, v);
    else if (step.kind === 'exo') {
      const L = exo(step.exo).levels[step.level];
      say(`Tour ${step.round}. ${L.name}. Objectif : ${L.target} ${L.unit === 'sec' ? 'secondes' : 'répétitions'}${L.perSide ? ' de chaque côté' : ''}`, v);
    }
    if (step?.kind === 'rest') cd.start(step.sec);
    if (step?.kind === 'exo') {
      const prev = results[`${step.exo}:${step.round - 1}`];
      setValue(prev ?? 0);
    }
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chrono montant pour les maintiens (gainage, suspension, L-sit)
  useEffect(() => {
    if (watch == null) return;
    const i = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(i);
  }, [watch]);
  const watchSec = watch != null ? Math.floor((Date.now() - watch) / 1000) : 0;
  const lastTarget = useRef(false);
  useEffect(() => {
    if (step?.kind !== 'exo' || watch == null) return;
    const L = exo(step.exo).levels[step.level];
    if (watchSec >= L.target && !lastTarget.current) {
      lastTarget.current = true;
      beep('fin', state.sound);
      say('Objectif atteint !', state.voice);
    }
  }, [watchSec]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fin de séance : enregistre les records du 1er tour et l'historique (une seule fois)
  useEffect(() => {
    if (step || saved.current) return;
    saved.current = true;
    const min = Math.round((Date.now() - startedAt) / 60000);
    update((s) => {
      const best = { ...s.best };
      const res = EXERCISES.flatMap((e) => {
        const v = results[`${e.id}:1`];
        if (v == null) return [];
        const lv = s.levels[e.id] ?? 0;
        best[bestKey(e.id, lv)] = Math.max(best[bestKey(e.id, lv)] ?? 0, v);
        return [{ exo: e.id, level: lv, value: v }];
      });
      return { ...s, best, history: [...s.history, { date: new Date().toISOString(), type: t, min, results: res }].slice(-200) };
    });
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const said10 = useRef(-1);
  useEffect(() => {
    if (step?.kind === 'rest' && cd.running && cd.left === 10 && said10.current !== idx && step.sec > 15) {
      said10.current = idx;
      say('Encore 10 secondes', state.voice);
    }
  });

  const quit = () =>
    Alert.alert('Arrêter la séance ?', 'Ta progression de cette séance ne sera pas enregistrée.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Arrêter', style: 'destructive', onPress: () => router.back() },
    ]);

  const total = steps.length;
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);

  // ——— Fin de séance ———
  if (!step) {
    const round1 = EXERCISES.map((e) => {
      const lv = state.levels[e.id] ?? 0;
      const v = results[`${e.id}:1`];
      return { e, lv, v, L: e.levels[lv] };
    });
    const ups = round1.filter((r) => r.v != null && r.v >= r.L.target && r.lv < r.e.levels.length - 1);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40, gap: 16 }}>
        <Text style={{ fontSize: 44, textAlign: 'center' }}>💪</Text>
        <Text style={{ color: C.brownDark, fontSize: 28, fontWeight: '900', textAlign: 'center' }}>Séance terminée !</Text>
        <P dim style={{ textAlign: 'center' }}>
          Séance {t} · {Math.round(elapsed / 60)} min
        </P>
        {ups.length ? (
          <Card style={{ borderColor: C.ok, borderWidth: 2 }}>
            <H2>Objectif atteint au premier tour 🎉</H2>
            <P dim>Le livre dit : quand vous atteignez l’objectif, passez au niveau supérieur.</P>
            {ups.map((r) => (
              <LevelUp key={r.e.id} id={r.e.id} from={r.lv} />
            ))}
          </Card>
        ) : null}
        <Card>
          <H2>Premier tour</H2>
          {round1.map((r) => (
            <View key={r.e.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <P>
                {r.e.name} · {r.L.name}
              </P>
              <Text style={{ color: r.v != null && r.v >= r.L.target ? C.ok : C.brown, fontWeight: '800' }}>
                {r.v ?? '–'} / {r.L.target}
                {r.L.unit === 'sec' ? ' s' : ''}
              </Text>
            </View>
          ))}
        </Card>
        <Button title="Terminer" icon="checkmark" big onPress={() => router.back()} />
      </ScrollView>
    );
  }

  // ——— En-tête ———
  const header = (
    <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 18, paddingBottom: 10, gap: 8, backgroundColor: C.brown }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={quit} hitSlop={12}>
          <Ionicons name="close" size={26} color={C.white} />
        </Pressable>
        <Text style={{ color: C.white, fontWeight: '800', fontSize: 16 }}>
          {BLOCK_NAMES[step.block]}
          {step.kind === 'exo' ? ` · tour ${step.round}/${step.rounds}` : ''}
        </Text>
        <Text style={{ color: '#D9C8BB', fontWeight: '700', fontVariant: ['tabular-nums'] }}>{fmt(elapsed)}</Text>
      </View>
      <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
        <View style={{ height: 4, width: `${(idx / total) * 100}%`, backgroundColor: C.white, borderRadius: 2 }} />
      </View>
    </View>
  );

  // ——— Pause ———
  if (step.kind === 'rest') {
    return (
      <View style={{ flex: 1, backgroundColor: C.brownDark }}>
        {header}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
          <Text style={{ color: '#D9C8BB', fontSize: 16, fontWeight: '800', letterSpacing: 2 }}>PAUSE</Text>
          <Text style={{ color: C.white, fontSize: 110, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{fmt(cd.left ?? step.sec)}</Text>
          <Text style={{ color: '#EFE6DC', fontSize: 18, textAlign: 'center' }}>{step.label}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Button title="+15 s" variant="secondary" onPress={() => cd.add(15)} />
            {cd.running ? <Button title="Pause" variant="secondary" icon="pause" onPress={cd.pause} /> : <Button title="Reprendre" variant="secondary" icon="play" onPress={() => cd.start(cd.left ?? step.sec)} />}
            <Button title="Passer" variant="secondary" icon="play-skip-forward" onPress={next} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {header}
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 18, paddingBottom: insets.bottom + 30, gap: 14 }}>
        {step.kind === 'move' ? <MoveStep step={step} cd={cd} /> : null}
        {step.kind === 'kb' ? <KbStep step={step} /> : null}
        {step.kind === 'exo' ? (
          <ExoStep
            step={step}
            value={value}
            setValue={setValue}
            watch={watch}
            watchSec={watchSec}
            startWatch={() => {
              lastTarget.current = false;
              setWatch(Date.now());
            }}
            stopWatch={() => {
              setValue(watchSec);
              setWatch(null);
            }}
          />
        ) : null}
        {step.kind === 'exo' ? (
          <Button
            title="Valider et passer à la suite"
            icon="arrow-forward"
            big
            onPress={() => {
              setResults((r) => ({ ...r, [`${step.exo}:${step.round}`]: watch != null ? watchSec : value }));
              next();
            }}
          />
        ) : step.kind === 'move' && step.move.sec ? (
          <Button title="Passer" variant="ghost" icon="play-skip-forward" onPress={next} />
        ) : (
          <Button title="C’est fait" icon="arrow-forward" big onPress={next} />
        )}
      </ScrollView>
    </View>
  );
}

function MoveStep({ step, cd }: { step: Extract<Step, { kind: 'move' }>; cd: ReturnType<typeof useCountdown> }) {
  const m = step.move;
  return (
    <>
      <Text style={{ color: C.brownSoft, fontWeight: '800' }}>
        {step.index + 1} / {step.count}
      </Text>
      <Text style={{ color: C.brownDark, fontSize: 28, fontWeight: '900' }}>{m.name}</Text>
      <Text style={{ color: C.brown, fontSize: 20, fontWeight: '800' }}>{m.dose}</Text>
      <P>{m.how}</P>
      {m.variant ? <P dim>Variante : {m.variant}</P> : null}
      {m.sec ? (
        <Card style={{ alignItems: 'center' }}>
          <Text style={{ color: C.brownDark, fontSize: 64, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{fmt(cd.left ?? m.sec)}</Text>
          {cd.running ? (
            <Button title="Pause" variant="secondary" icon="pause" onPress={cd.pause} />
          ) : (
            <Button title={cd.left != null ? 'Reprendre' : 'Démarrer'} icon="play" big onPress={() => cd.start(cd.left ?? m.sec!)} />
          )}
        </Card>
      ) : null}
      {m.photo ? <Photo id={m.photo} page={m.page} /> : <PageImage id={m.page} height={420} whole />}
    </>
  );
}

function KbStep({ step }: { step: Extract<Step, { kind: 'kb' }> }) {
  const m = step.move;
  return (
    <>
      <Text style={{ color: C.brownSoft, fontWeight: '800' }}>
        Série {step.set} / {m.sets}
      </Text>
      <Text style={{ color: C.brownDark, fontSize: 28, fontWeight: '900' }}>{m.name}</Text>
      <Text style={{ color: C.brown, fontSize: 22, fontWeight: '800' }}>{m.reps} répétitions · 12 kg</Text>
      <Card>
        <Bullets items={m.how} />
        <P dim>⚠️ {m.safety}</P>
      </Card>
    </>
  );
}

function ExoStep({
  step,
  value,
  setValue,
  watch,
  watchSec,
  startWatch,
  stopWatch,
}: {
  step: Extract<Step, { kind: 'exo' }>;
  value: number;
  setValue: (v: number) => void;
  watch: number | null;
  watchSec: number;
  startWatch: () => void;
  stopWatch: () => void;
}) {
  const e = exo(step.exo);
  const L = e.levels[step.level];
  const prev = step.level > 0 ? e.levels[step.level - 1] : null;
  const low = L.unit === 'sec' ? value > 0 && value <= 5 : value > 0 && value <= 3;
  return (
    <>
      <Text style={{ color: C.brownSoft, fontWeight: '800' }}>
        {e.name.toUpperCase()} · NIVEAU {L.num.toUpperCase()} · {step.pos + 1}/6
      </Text>
      <Text style={{ color: C.brownDark, fontSize: 28, fontWeight: '900' }}>{L.name}</Text>
      <View style={{ backgroundColor: C.cardAlt, borderRadius: 12, padding: 12 }}>
        <Text style={{ color: C.brown, fontWeight: '900', fontSize: 12 }}>MAXIMUM DE RÉPÉTITIONS PROPRES · OBJECTIF DU NIVEAU</Text>
        <P>
          {L.target}
          {L.unit === 'sec' ? ' secondes' : ' répétitions'}
          {L.perSide ? ' de chaque côté' : ''}
        </P>
        {L.extra ? (
          <P>
            Puis {L.extra.name.toLowerCase()} : {L.extra.target}
            {L.extra.unit === 'sec' ? ' s' : ' rép.'}
          </P>
        ) : null}
      </View>
      {L.photo ? <Photo id={L.photo} page={L.pages[0]} /> : <PageImage id={L.pages[0]} height={420} whole />}
      {L.extraPhoto && L.extra ? (
        <>
          <Text style={{ color: C.brownSoft, fontWeight: '800' }}>{L.extra.name.toUpperCase()}</Text>
          <Photo id={L.extraPhoto} maxHeight={260} />
        </>
      ) : null}
      <Bullets items={L.how} />
      {L.tips?.map((t) => (
        <P key={t} dim>
          💡 {t}
        </P>
      ))}
      {e.stretchTip ? <P dim>🌿 {e.stretchTip}</P> : null}

      <Card style={{ alignItems: 'center', gap: 12 }}>
        <Text style={{ color: C.textDim, fontWeight: '700' }}>
          {step.round === 1 ? 'Combien as-tu fait proprement ? (1er tour : sert à valider le niveau)' : 'Combien as-tu fait proprement ?'}
        </Text>
        {L.unit === 'sec' ? (
          watch != null ? (
            <>
              <Text style={{ color: watchSec >= L.target ? C.ok : C.brownDark, fontSize: 64, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{watchSec} s</Text>
              <Button title="Stop" icon="stop" big onPress={stopWatch} />
            </>
          ) : (
            <>
              <Stepper value={value} setValue={setValue} unit="s" />
              <Button title="Chrono : démarrer le maintien" variant="secondary" icon="timer-outline" onPress={startWatch} />
            </>
          )
        ) : (
          <Stepper value={value} setValue={setValue} unit={L.perSide ? 'par côté' : 'rép.'} />
        )}
      </Card>
      {low && prev ? (
        <Card style={{ backgroundColor: '#FBE9DF', borderColor: '#FBE9DF' }}>
          <P>
            Peu de répétitions : complète la série avec le maximum du niveau précédent ({prev.name.toLowerCase()}).
          </P>
        </Card>
      ) : null}
    </>
  );
}

function Stepper({ value, setValue, unit }: { value: number; setValue: (v: number) => void; unit: string }) {
  const btn = (d: number, label: string) => (
    <Pressable onPress={() => setValue(Math.max(0, value + d))} style={({ pressed }) => ({ width: 56, height: 56, borderRadius: 28, backgroundColor: pressed ? C.brownSoft : C.brown, alignItems: 'center', justifyContent: 'center' })}>
      <Text style={{ color: C.white, fontSize: 24, fontWeight: '900' }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
      {btn(-1, '−')}
      <View style={{ alignItems: 'center', minWidth: 90 }}>
        <Text style={{ color: C.brownDark, fontSize: 52, fontWeight: '900', fontVariant: ['tabular-nums'] }}>{value}</Text>
        <Text style={{ color: C.textDim }}>{unit}</Text>
      </View>
      {btn(1, '+')}
    </View>
  );
}

function LevelUp({ id, from }: { id: ExoId; from: number }) {
  const { state, update } = useStore();
  const e = exo(id);
  const done = (state.levels[id] ?? 0) > from;
  const to = e.levels[from + 1];
  return (
    <View style={{ gap: 6, paddingVertical: 6 }}>
      <P>
        {e.name} : {e.levels[from].name} → <Text style={{ fontWeight: '800' }}>{to.name}</Text>
        {to.optional ? ' (optionnel)' : ''}
      </P>
      {done ? (
        <Text style={{ color: C.ok, fontWeight: '800' }}>✓ Niveau {to.num} activé</Text>
      ) : (
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button title={`Passer au niveau ${to.num}`} variant="ok" onPress={() => update((s) => ({ ...s, levels: { ...s.levels, [id]: from + 1 } }))} />
          {to.optional && e.levels[from + 2] ? (
            <Button title={`Aller au niveau ${e.levels[from + 2].num}`} variant="secondary" onPress={() => update((s) => ({ ...s, levels: { ...s.levels, [id]: from + 2 } }))} />
          ) : null}
        </View>
      )}
    </View>
  );
}
