import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { Bullets, Button, Card, H2, P, PageImage, PageStrip, Photo, Screen } from '@/components/ui';
import { C } from '@/constants/theme';
import { exo, type ExoId } from '@/data/programme';
import { bestKey, useStore } from '@/lib/store';

export default function ExerciceScreen() {
  const { id } = useLocalSearchParams<{ id: ExoId }>();
  const e = exo(id);
  const { state, update } = useStore();
  const current = state.levels[e.id] ?? 0;

  const setLevel = (i: number) =>
    Alert.alert(`Passer au niveau ${e.levels[i].num} ?`, e.levels[i].name, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', onPress: () => update((s) => ({ ...s, levels: { ...s.levels, [e.id]: i } })) },
    ]);

  return (
    <Screen back title={e.name} subtitle={`Objectif phase 2 : ${e.phase2}`}>
      <PageImage id={e.hero} height={260} />
      <P>{e.intro}</P>
      {e.important ? (
        <Card style={{ backgroundColor: C.cardAlt }}>
          <Text style={{ color: C.brown, fontWeight: '900' }}>IMPORTANT</Text>
          <P>{e.important}</P>
        </Card>
      ) : null}
      {e.stretchTip ? (
        <Card style={{ backgroundColor: C.okSoft, borderColor: C.okSoft }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Ionicons name="leaf-outline" size={18} color={C.ok} />
            <P style={{ flex: 1 }}>{e.stretchTip}</P>
          </View>
        </Card>
      ) : null}
      <PageStrip ids={e.pages} />

      {e.levels.map((L, i) => {
        const on = i === current;
        const best = state.best[bestKey(e.id, i)];
        return (
          <Card key={i} style={on ? { borderColor: C.brown, borderWidth: 2 } : undefined}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: C.brownSoft, fontWeight: '800', letterSpacing: 1 }}>NIVEAU {L.num.toUpperCase()}</Text>
              {on ? (
                <View style={{ backgroundColor: C.brown, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Text style={{ color: C.white, fontWeight: '800', fontSize: 12 }}>MON NIVEAU</Text>
                </View>
              ) : i < current ? (
                <Ionicons name="checkmark-circle" size={22} color={C.ok} />
              ) : null}
            </View>
            <H2>{L.name}</H2>
            {L.photo ? <Photo id={L.photo} page={L.pages[0]} /> : <PageImage id={L.pages[0]} height={380} whole />}
            {L.extraPhoto ? <Photo id={L.extraPhoto} maxHeight={260} /> : null}
            <Bullets items={L.how} />
            {L.tips?.map((t) => (
              <P key={t} dim>
                💡 {t}
              </P>
            ))}
            <View style={{ backgroundColor: C.cardAlt, borderRadius: 12, padding: 12, gap: 4 }}>
              <Text style={{ color: C.brown, fontWeight: '900', fontSize: 12 }}>POUR VALIDER CE NIVEAU</Text>
              <P>Vous devez {L.goal}.</P>
              {L.extra ? <P>Et {L.extra.name.toLowerCase()} : {L.extra.goal}.</P> : null}
              {best != null ? (
                <P dim>
                  Mon record au 1er tour : {best}
                  {L.unit === 'sec' ? ' s' : ' rép.'}
                </P>
              ) : null}
            </View>
            {L.pages.length > 1 ? <PageStrip ids={L.pages.slice(1)} /> : null}
            {!on ? <Button title={`Je suis à ce niveau`} variant="secondary" onPress={() => setLevel(i)} /> : null}
          </Card>
        );
      })}
    </Screen>
  );
}
