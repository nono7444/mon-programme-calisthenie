import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, R } from '@/constants/theme';
import { PAGES, type PageId } from '@/data/livre';

export function Screen({ children, title, subtitle, back }: { children?: ReactNode; title?: string; subtitle?: string; back?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 110, paddingHorizontal: 18, gap: 16 }}>
      {back ? (
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="chevron-back" size={22} color={C.brown} />
          <Text style={{ color: C.brown, fontSize: 16, fontWeight: '600' }}>Retour</Text>
        </Pressable>
      ) : null}
      {title ? (
        <View style={{ gap: 4 }}>
          <Text style={s.h1}>{title}</Text>
          {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
        </View>
      ) : null}
      {children}
    </ScrollView>
  );
}

export function Card({ children, style, dark, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; dark?: boolean; onPress?: () => void }) {
  const st = [s.card, dark && { backgroundColor: C.brown }, style];
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...st, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  return <View style={st}>{children}</View>;
}

export function H2({ children, light }: { children: ReactNode; light?: boolean }) {
  return <Text style={[s.h2, light && { color: C.white }]}>{children}</Text>;
}

export function P({ children, light, dim, style }: { children: ReactNode; light?: boolean; dim?: boolean; style?: StyleProp<any> }) {
  return <Text style={[s.p, dim && { color: C.textDim }, light && { color: '#EFE6DC' }, style]}>{children}</Text>;
}

export function Bullets({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={[s.p, { color: light ? '#EFE6DC' : C.brownSoft, fontWeight: '800' }]}>{i + 1}.</Text>
          <Text style={[s.p, { flex: 1 }, light && { color: '#EFE6DC' }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export function Button({ title, onPress, icon, variant = 'primary', big, disabled, light }: { title: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary' | 'ghost' | 'ok'; big?: boolean; disabled?: boolean; light?: boolean }) {
  const bg = variant === 'primary' ? C.brown : variant === 'ok' ? C.ok : variant === 'secondary' ? C.cardAlt : 'transparent';
  const fg = variant === 'primary' || variant === 'ok' || light ? C.white : C.brown;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, paddingVertical: big ? 18 : 13, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }]}>
      {icon ? <Ionicons name={icon} size={big ? 22 : 18} color={fg} /> : null}
      <Text style={{ color: fg, fontSize: big ? 18 : 15, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, on && { backgroundColor: C.brown, borderColor: C.brown }]}>
      <Text style={{ color: on ? C.white : C.brown, fontWeight: '700', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

/** Page du livre : appui pour l'ouvrir en plein écran (zoom). */
export function PageImage({ id, height = 300, radius = 14, whole }: { id: PageId; height?: number; radius?: number; whole?: boolean }) {
  return (
    <Pressable onPress={() => router.push({ pathname: '/page', params: { id } })} style={{ borderRadius: radius, overflow: 'hidden', backgroundColor: C.cardAlt }}>
      <Image source={PAGES[id]} style={{ width: '100%', height }} resizeMode={whole ? 'contain' : 'cover'} />
      <View style={s.zoom}>
        <Ionicons name="expand-outline" size={14} color={C.white} />
        <Text style={{ color: C.white, fontSize: 12, fontWeight: '700' }}>Voir la page</Text>
      </View>
    </Pressable>
  );
}

export function PageStrip({ ids }: { ids: PageId[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
      {ids.map((id) => (
        <Pressable key={id} onPress={() => router.push({ pathname: '/page', params: { id } })} style={{ borderRadius: 10, overflow: 'hidden' }}>
          <Image source={PAGES[id]} style={{ width: 120, height: 160 }} resizeMode="cover" />
        </Pressable>
      ))}
    </ScrollView>
  );
}

export const s = StyleSheet.create({
  h1: { color: C.brownDark, fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  h2: { color: C.brownDark, fontSize: 19, fontWeight: '800' },
  sub: { color: C.textDim, fontSize: 15, lineHeight: 21 },
  p: { color: C.text, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: C.card, borderRadius: R.card, padding: 16, gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingHorizontal: 18 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.chip, borderWidth: 1.5, borderColor: C.line, backgroundColor: C.card },
  zoom: { position: 'absolute', right: 8, bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(46,30,26,0.75)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
});
