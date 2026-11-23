import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

import { Card, H2, P, Screen } from '@/components/ui';
import { C } from '@/constants/theme';
import { PAGES } from '@/data/livre';
import { EXERCISES } from '@/data/programme';
import { useStore } from '@/lib/store';

const SECTIONS = [
  { id: 'regles', title: 'Le travail technique', sub: 'Comment aborder le circuit, les règles', icon: 'list-outline' },
  { id: 'echauffement', title: 'Échauffement', sub: 'Haut du corps (5 min) + bas du corps (3 min)', icon: 'flame-outline' },
  { id: 'etirements', title: 'Étirements', sub: 'Les 3 indispensables de la phase 1 + « feel good »', icon: 'leaf-outline' },
  { id: 'hiit', title: 'Circuit HIIT', sub: 'Burpees, bateau, swings, twist russe…', icon: 'heart-outline' },
  { id: 'kettlebell', title: 'Kettlebell 12 kg', sub: 'Goblet squat et swing deux mains', icon: 'fitness-outline' },
] as const;

export default function Livre() {
  const { state } = useStore();
  return (
    <Screen title="Le livre" subtitle="Les 6 exercices fondamentaux, avec toutes les pages et leurs niveaux.">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {EXERCISES.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => router.push({ pathname: '/exercice/[id]', params: { id: e.id } })}
            style={({ pressed }) => ({ width: '47.5%', borderRadius: 16, overflow: 'hidden', backgroundColor: C.brown, opacity: pressed ? 0.85 : 1 })}>
            <Image source={PAGES[e.hero]} style={{ width: '100%', height: 150 }} resizeMode="cover" />
            <View style={{ padding: 10 }}>
              <Text style={{ color: C.white, fontWeight: '900', fontSize: 16 }}>{e.name}</Text>
              <Text style={{ color: '#D9C8BB', fontSize: 13 }}>
                Niveau {e.levels[state.levels[e.id] ?? 0].num}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <H2>Autour des exercices</H2>
      {SECTIONS.map((sct) => (
        <Card key={sct.id} onPress={() => router.push({ pathname: '/fiche/[id]', params: { id: sct.id } })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name={sct.icon} size={24} color={C.brown} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.brownDark, fontWeight: '800', fontSize: 16 }}>{sct.title}</Text>
              <P dim>{sct.sub}</P>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.textDim} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}
