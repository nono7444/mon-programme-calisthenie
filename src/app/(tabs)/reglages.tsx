import { Alert, Switch, Text, View } from 'react-native';

import { Button, Card, Chip, H2, P, Screen } from '@/components/ui';
import { C } from '@/constants/theme';
import { DAYS, EXERCISES, PLANS } from '@/data/programme';
import { useStore } from '@/lib/store';

export default function Reglages() {
  const { state, update } = useStore();
  const plan = PLANS[state.days];
  return (
    <Screen title="Réglages">
      <Card>
        <H2>Séances par semaine</H2>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([3, 4, 5] as const).map((d) => (
            <Chip key={d} label={`${d} séances`} on={state.days === d} onPress={() => update((s) => ({ ...s, days: d }))} />
          ))}
        </View>
        <P dim>
          {[1, 2, 3, 4, 5, 6, 0]
            .filter((d) => plan[d])
            .map((d) => `${DAYS[d]} ${plan[d]}`)
            .join(' · ')}
        </P>
        <P dim>Les jours sont indicatifs : tu peux faire ta séance n’importe quel jour depuis l’accueil. La régularité prime sur le temps passé.</P>
      </Card>
      <Card>
        <H2>Pause entre les exercices</H2>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([45, 60] as const).map((r) => (
            <Chip key={r} label={`${r} s`} on={state.restExo === r} onPress={() => update((s) => ({ ...s, restExo: r }))} />
          ))}
        </View>
        <P dim>Le livre conseille 45 à 60 s entre les exercices et 2 min entre les tours.</P>
      </Card>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <H2>Bips du chrono</H2>
            <P dim>3, 2, 1… et un bip long à la fin de la pause. Les vibrations restent actives.</P>
          </View>
          <Switch value={state.sound} onValueChange={(v) => update((s) => ({ ...s, sound: v }))} trackColor={{ true: C.brown }} />
        </View>
      </Card>
      <Card>
        <H2>Historique</H2>
        <P dim>{state.history.length ? `${state.history.length} séance${state.history.length > 1 ? 's' : ''} terminée${state.history.length > 1 ? 's' : ''}` : 'Aucune séance pour l’instant.'}</P>
        {state.history
          .slice(-8)
          .reverse()
          .map((h) => (
            <Text key={h.date} style={{ color: C.text, fontSize: 14 }}>
              {new Date(h.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} · séance {h.type} · {h.min} min
            </Text>
          ))}
      </Card>
      <Button
        title="Tout remettre au niveau 1"
        variant="secondary"
        icon="refresh"
        onPress={() =>
          Alert.alert('Tout remettre au niveau 1 ?', 'Les niveaux, records et l’historique seront effacés.', [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Effacer',
              style: 'destructive',
              onPress: () => update((s) => ({ ...s, levels: Object.fromEntries(EXERCISES.map((e) => [e.id, 0])) as typeof s.levels, best: {}, history: [] })),
            },
          ])
        }
      />
    </Screen>
  );
}
