// Bips du chrono (fin de pause) + vibration.
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type Player = { seekTo: (s: number) => Promise<void> | void; play: () => void; volume: number };
let players: { bip: Player; fin: Player } | null = null;

function load() {
  if (players) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createAudioPlayer, setAudioModeAsync } = require('expo-audio') as typeof import('expo-audio');
    // Le bip passe même en mode silencieux et se mélange à ta musique
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
    players = {
      bip: createAudioPlayer(require('../../assets/sons/bip.wav')) as unknown as Player,
      fin: createAudioPlayer(require('../../assets/sons/fin.wav')) as unknown as Player,
    };
  } catch {
    players = null;
  }
}

export function beep(kind: 'bip' | 'fin', soundOn: boolean) {
  if (Platform.OS !== 'web') Haptics.impactAsync(kind === 'fin' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  if (!soundOn) return;
  load();
  const p = players?.[kind];
  if (!p) return;
  try {
    Promise.resolve(p.seekTo(0))
      .catch(() => {})
      .finally(() => p.play());
  } catch {}
}

export function preloadSounds() {
  load();
}

// ——— Voix (synthèse vocale du téléphone, en français) ———
/** Rend une dose lisible à voix haute : « 10-15 / sens » → « 10 à 15 par sens ». */
export function speakable(t: string) {
  return t
    .replace(/(\d+)-(\d+)/g, '$1 à $2')
    .replace(/×\s*/g, '')
    .replace(/\s*\/\s*/g, ' par ')
    .replace(/rép\./g, 'répétitions')
    .replace(/(\d+) s\b/g, '$1 secondes');
}

export function say(text: string, voiceOn: boolean) {
  if (!voiceOn) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Speech = require('expo-speech') as typeof import('expo-speech');
    Speech.stop();
    Speech.speak(text, { language: 'fr-FR', rate: Platform.OS === 'ios' ? 0.52 : 1.0 });
  } catch {}
}
