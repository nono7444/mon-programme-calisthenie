// Page du livre en plein écran (pincer pour zoomer sur iPhone).
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PAGES, type PageId } from '@/data/livre';

export default function PageViewer() {
  const { id } = useLocalSearchParams<{ id: PageId }>();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const h = Math.min(height - insets.top - insets.bottom, (width * 4) / 3);
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView
        maximumZoomScale={4}
        minimumZoomScale={1}
        centerContent
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}>
        <Image source={PAGES[id]} style={{ width, height: h }} resizeMode="contain" />
      </ScrollView>
      <Pressable onPress={() => router.back()} hitSlop={14} style={{ position: 'absolute', top: insets.top + 10, right: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8 }}>
        <Ionicons name="close" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}
