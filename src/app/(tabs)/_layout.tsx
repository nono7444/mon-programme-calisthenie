import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { C } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.brown,
        tabBarInactiveTintColor: C.textDim,
        tabBarStyle: { backgroundColor: C.card, borderTopColor: C.line },
        tabBarLabelStyle: { fontWeight: '700' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="exercices" options={{ title: 'Le livre', tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="reglages" options={{ title: 'Réglages', tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
