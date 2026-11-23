// Source AltStore / FlareStore / SideStore pour la dernière build.
// Usage : node scripts/make-source.mjs <version> <tag> <ipa>
import { readFileSync, statSync, writeFileSync } from 'node:fs';

const [version, tag, ipa = 'calisthenie-unsigned.ipa'] = process.argv.slice(2);
const repo = process.env.GITHUB_REPOSITORY || 'nono7444/mon-programme-calisthenie';
const size = statSync(ipa).size;
const date = new Date().toISOString();
let notes = '';
try {
  notes = readFileSync('notes.md', 'utf8').trim();
} catch {}
const downloadURL = `https://github.com/${repo}/releases/download/${tag}/${ipa}`;
const iconURL = `https://raw.githubusercontent.com/${repo}/main/assets/images/icon.png`;
const app = {
  name: 'Calisthénie',
  bundleIdentifier: 'lol.wawanono.calisthenie',
  developerName: 'Norman',
  subtitle: 'Mon programme de calisthénie',
  localizedDescription: 'Phase 1 « Bien gérer les bases » : tractions, pompes, pistol squats, gainage, dips, L-sit, kettlebell. Séances guidées de 40 min.',
  iconURL,
  tintColor: '#4A302A',
  category: 'health',
  version,
  versionDate: date,
  downloadURL,
  size,
  versions: [{ version, buildVersion: version.split('.').pop(), date, size, downloadURL, minOSVersion: '16.4', localizedDescription: notes || `Build ${tag}` }],
  appPermissions: { entitlements: [], privacy: {} },
};
const source = {
  name: 'Calisthénie',
  identifier: 'lol.wawanono.calisthenie.source',
  sourceURL: `https://github.com/${repo}/releases/latest/download/altstore.json`,
  subtitle: 'Mon programme de calisthénie',
  iconURL,
  tintColor: '#4A302A',
  apps: [app],
  news: [],
};
writeFileSync('altstore.json', JSON.stringify(source, null, 2));
console.log(`altstore.json : ${version} → ${downloadURL} (${size} octets)`);
