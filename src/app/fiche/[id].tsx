import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Bullets, Card, H2, P, PageImage, PageStrip, Screen } from '@/components/ui';
import { C } from '@/constants/theme';
import type { PageId } from '@/data/livre';
import { HIIT, KB_MOVES, RULES, STRETCH_FEELGOOD, STRETCH_PHASE1, WARMUP_LOWER, WARMUP_NOTE, WARMUP_UPPER, type Move } from '@/data/programme';
import { HIIT_ROUNDS } from '@/lib/session';

function MoveList({ list }: { list: Move[] }) {
  return (
    <View style={{ gap: 10 }}>
      {list.map((m, i) => (
        <Card key={m.name}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text style={{ color: C.brownDark, fontWeight: '800', fontSize: 16, flex: 1 }}>
              {i + 1}. {m.name}
            </Text>
            <Text style={{ color: C.brown, fontWeight: '800' }}>{m.dose}</Text>
          </View>
          <P>{m.how}</P>
          {m.variant ? <P dim>Variante débutant : {m.variant}</P> : null}
        </Card>
      ))}
    </View>
  );
}

export default function Fiche() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (id === 'regles')
    return (
      <Screen back title="Le travail technique" subtitle="6 exercices enchaînés · pause 45 à 60 s · pause entre les tours 2 min">
        <PageImage id="technique" height={360} />
        <Card>
          <H2>Les règles</H2>
          <Bullets items={RULES} />
        </Card>
        <Card>
          <H2>Dans tes séances de 40 min</H2>
          <P>Le livre prévoit 4 tours (35-40 min de travail technique seul). Pour tenir en 40 min avec l’échauffement et la kettlebell : 3 tours en séance A, 2 tours en séance B.</P>
        </Card>
        <PageStrip ids={['technique-tours', 'phase1-intro', 'planning'] as PageId[]} />
      </Screen>
    );

  if (id === 'echauffement')
    return (
      <Screen back title="Échauffement" subtitle={WARMUP_NOTE}>
        <PageStrip ids={['echauf-haut-1', 'echauf-haut-2', 'echauf-bas-1', 'echauf-bas-2']} />
        <H2>Haut du corps · 5 min max</H2>
        <MoveList list={WARMUP_UPPER} />
        <H2>Bas du corps · 3 min max</H2>
        <MoveList list={WARMUP_LOWER} />
      </Screen>
    );

  if (id === 'etirements')
    return (
      <Screen back title="Étirements" subtitle="À faire au minimum 2 ou 3 fois par semaine. Trois sont indispensables en phase 1 pour progresser sur le pistol squat et le L-sit sans se blesser.">
        <PageStrip ids={['etir-intro', 'etir-phase1', 'etir-toutes-1', 'etir-toutes-2']} />
        <H2>Pour la phase 1</H2>
        <P dim>« Toucher ses pieds » pendant le L-sit, entre deux essais ; squat profond après le pistol squat ; fléchisseurs des hanches après L-sit et pistol squat.</P>
        <MoveList list={STRETCH_PHASE1} />
        <H2>Pour toutes les phases (facultatifs)</H2>
        <MoveList list={STRETCH_FEELGOOD} />
      </Screen>
    );

  if (id === 'hiit')
    return (
      <Screen back title="Circuit HIIT" subtitle={`Livre : 4 tours · pause entre tours 1 min · pause entre exercices 15-20 s. Dans ta séance B : ${HIIT_ROUNDS} tours, avec des swings à la place des jumping jacks.`}>
        <PageStrip ids={['hiit-1', 'hiit-2']} />
        <MoveList list={HIIT} />
      </Screen>
    );

  if (id === 'kettlebell')
    return (
      <Screen back title="Kettlebell 12 kg" subtitle="Ajoutée au programme du livre : force des jambes et du dos, et cardio.">
        {Object.values(KB_MOVES).map((m) => (
          <Card key={m.name}>
            <H2>{m.name}</H2>
            <Text style={{ color: C.brown, fontWeight: '800' }}>
              {m.sets} séries × {m.reps} · pause {m.rest} s
            </Text>
            <Bullets items={m.how} />
            <P dim>⚠️ {m.safety}</P>
          </Card>
        ))}
        <Card style={{ backgroundColor: C.cardAlt }}>
          <P>Quand 2 × 10 goblet squats et 2 × 15 swings deviennent faciles avec 12 kg : passe à 3 séries, puis ajoute des pauses de 2 s en bas du goblet squat avant de penser à une kettlebell plus lourde.</P>
        </Card>
      </Screen>
    );

  return <Screen back title="Introuvable" />;
}
