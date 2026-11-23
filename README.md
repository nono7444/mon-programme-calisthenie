# Mon programme de calisthénie

Appli iPhone / Android (Expo, React Native, TypeScript) qui suit la **Phase 1 « Bien gérer les bases »** de mon livre :
tractions, pompes, pistol squats, gainage, dips et L-sit, avec tous les niveaux, plus une kettlebell de 12 kg.

- `src/data/programme.ts` : le contenu (niveaux, objectifs, échauffement, HIIT, étirements, kettlebell, séances, planning)
- `src/data/livre.ts` + `assets/livre/` : les pages du livre (à remplacer par les originaux HD, mêmes noms de fichiers)
- `src/lib/session.ts` : la construction des séances de 40 min
- `src/app/seance.tsx` : la séance guidée (chrono des pauses, bips et voix)

Chaque push sur `main` construit l'IPA (non signée) et l'APK dans une Release (GitHub Actions).

**FlareStore** : ajoute la source `https://github.com/nono7444/mon-programme-calisthenie/releases/latest/download/altstore.json`

Les pages et photos du livre © l'auteur, Norman.
