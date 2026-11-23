// Contenu du programme Phase 1 « Bien gérer les bases » (tiré du livre) + kettlebell 12 kg.
import type { PageId } from './livre';

export type Unit = 'reps' | 'sec';

export type Level = {
  num: string; // « 1 », « 1 bis », « 2 (optionnel) »…
  name: string;
  target: number; // objectif pour valider le niveau
  unit: Unit;
  perSide?: boolean;
  goal: string; // phrase « Pour valider ce niveau »
  how: string[]; // étapes d'exécution
  tips?: string[];
  extra?: { name: string; target: number; unit: Unit; goal: string }; // exercice à faire en plus au même niveau (suspension, relevés de jambes)
  optional?: boolean;
  pages: PageId[];
};

export type Exercise = {
  id: ExoId;
  name: string;
  short: string;
  icon: string; // Ionicons
  intro: string;
  important?: string;
  phase2: string; // objectif pour passer en phase 2
  stretchTip?: string;
  levels: Level[];
  pages: PageId[]; // pages d'introduction
  hero: PageId;
};

export type ExoId = 'tractions' | 'pompes' | 'pistol' | 'gainage' | 'dips' | 'lsit';

export const EXERCISES: Exercise[] = [
  {
    id: 'tractions',
    name: 'Tractions',
    short: 'Tractions',
    icon: 'barbell-outline',
    intro:
      "Le meilleur exercice pour développer le dos et les bras. Elles améliorent la posture, la longévité des épaules et le grip, et se transfèrent à quantité de sports. On ne progresse pas en perdant du poids ou en soulevant de la fonte, mais avec les progressions.",
    phase2: '10 tractions',
    levels: [
      {
        num: '1',
        name: 'Tractions australiennes',
        target: 15,
        unit: 'reps',
        goal: '15 répétitions presque à l’horizontale par rapport au support',
        how: [
          'Pieds au sol, corps incliné, mains accrochées au support (barre basse, branche, ou support vertical jambes de part et d’autre).',
          'Bras tendus, corps droit : gainez les abdos.',
          'Pliez les bras jusqu’à ce que le support frôle la poitrine, puis revenez.',
        ],
        tips: ['Plus vous progressez, plus vous descendez vers l’horizontale, degré par degré, ou passez à un support plus bas.'],
        extra: { name: 'Suspension (niveau 1 bis)', target: 30, unit: 'sec', goal: 'tenir 30 secondes confortablement, sans glisser' },
        pages: ['tractions-intro', 'tractions-suspension-elastique'],
      },
      {
        num: '2 (optionnel)',
        name: 'Tractions avec élastique',
        target: 6,
        unit: 'reps',
        optional: true,
        goal: 'sentir que vous maîtrisez le mouvement, 6 répétitions suffisent',
        how: ['L’élastique aide beaucoup en bas et très peu en haut : utilisez-le quelques semaines seulement, entre les australiennes et les négatives.'],
        tips: ['Ne vous attardez pas sur ce niveau !'],
        pages: ['tractions-suspension-elastique'],
      },
      {
        num: '3',
        name: 'Tractions négatives',
        target: 6,
        unit: 'reps',
        goal: '6 répétitions d’au moins 10 secondes chacune, et pouvoir stopper 2-3 s la descente en tout point',
        how: [
          'Démarrez menton légèrement au-dessus de la barre.',
          'Dépliez les bras en ralentissant au maximum la descente. Abdos contractés, mains serrées de toutes vos forces.',
          'Finissez bras tendus. Gardez les coudes rentrés.',
        ],
        tips: [
          'Commencez par 1 ou 2 répétitions : les aborder trop vite risque tendinites et découragement.',
          'Ne vous laissez pas « tomber » : peu de répétitions, très lentement. Si c’est infernal, c’est bon signe !',
        ],
        pages: ['tractions-negatives'],
      },
      {
        num: '4',
        name: 'Tractions',
        target: 10,
        unit: 'reps',
        goal: '10 répétitions en amplitude complète',
        how: [
          'Corps droit, jambes tendues, pieds joints, abdos gainés tout au long de la montée.',
          'Astuce mentale : imaginez que vous voulez « casser la barre ».',
          'Pour préparer le muscle up : paumes de plus en plus au-dessus de la barre, et visez la poitrine avec la barre.',
        ],
        pages: ['tractions-n4', 'tractions-photo'],
      },
    ],
    pages: ['tractions-photo', 'tractions-intro'],
    hero: 'tractions-photo',
  },
  {
    id: 'pompes',
    name: 'Pompes',
    short: 'Pompes',
    icon: 'body-outline',
    intro:
      'Tout aussi fondamentales que les tractions. Une pompe ne compte que si on démarre bras tendus, qu’on descend jusqu’à frôler le sol du torse (pas de la tête) et qu’on revient bras tendus, le corps parfaitement droit.',
    important: 'Pour tous les niveaux : tête, hanches, genoux et pieds sur une même ligne, abdos gainés.',
    phase2: '20 pompes',
    levels: [
      {
        num: '1',
        name: 'Pompes mains surélevées',
        target: 20,
        unit: 'reps',
        goal: '20 répétitions sur un support bas, le corps presque à l’horizontale',
        how: [
          'Commencez debout contre un mur, ou sur un support haut (rebord, branche…).',
          'Baissez progressivement : table, chaise, marche d’escalier, jusqu’au sol.',
        ],
        tips: ['Au tout début, beaucoup de répétitions faciles. Soyez humble. Diminuez les répétitions quand le support descend, avant de les augmenter à nouveau.'],
        pages: ['pompes-n1-n2'],
      },
      {
        num: '2',
        name: 'Pompes à genoux',
        target: 20,
        unit: 'reps',
        goal: '20 répétitions en amplitude complète',
        how: ['À genoux, pieds et mollets relevés, bras tendus.', 'Descendez lentement jusqu’à frôler le sol de la poitrine, puis remontez bras tendus.'],
        tips: ['Gardez les coudes rentrés.'],
        pages: ['pompes-n1-n2'],
      },
      {
        num: '3',
        name: 'Pompes négatives',
        target: 12,
        unit: 'reps',
        goal: '12 répétitions en amplitude complète, et stopper 2-3 s la descente en tout point',
        how: ['Descendez en position de pompe, bras et jambes tendus, aussi lentement que possible jusqu’à ce que la poitrine frôle le sol.', 'En bas, posez les genoux pour remonter.'],
        pages: ['pompes-n3-n4'],
      },
      {
        num: '4',
        name: 'Pompes',
        target: 20,
        unit: 'reps',
        goal: '20 répétitions en amplitude complète',
        how: ['Corps droit, mains environ à largeur d’épaules.', 'Le torse frôle le sol (« ceci n’est pas une pompe » si le torse reste loin du sol).'],
        tips: [
          'Pendant la montée, un léger effort de rotation des épaules vers l’extérieur, comme si les mains voulaient faire pivoter le sol.',
          'Imaginez repousser la terre entière plutôt que soulever votre poids.',
        ],
        pages: ['pompes-n3-n4'],
      },
    ],
    pages: ['pompes-intro'],
    hero: 'pompes-intro',
  },
  {
    id: 'pistol',
    name: 'Pistol squats',
    short: 'Pistol',
    icon: 'walk-outline',
    intro:
      'Le seul pistol squat donne une force honorable dans les jambes, équilibre les deux jambes, et fait gagner en mobilité et en stabilité des chevilles, genoux et hanches.',
    phase2: '10 pistol squats (ou 10 pistol squats assistés)',
    stretchTip: 'Après le pistol squat : étirement « squat profond » (30 s en bas).',
    levels: [
      {
        num: '1',
        name: 'Demi-squats',
        target: 20,
        unit: 'reps',
        goal: '20 répétitions',
        how: [
          'Debout, pieds à largeur d’épaules, fléchissez les genoux jusqu’à 90°, cuisses parallèles au sol. Remontez.',
          'Si c’est difficile : sur une chaise ou un banc, la descente reste un effort actif.',
        ],
        tips: ['Quand vous descendez, tirez les fesses en arrière en tirant les genoux vers l’avant.', 'Quand vous remontez, imaginez repousser le sol.'],
        pages: ['pistol-intro'],
      },
      {
        num: '2',
        name: 'Squats profonds',
        target: 20,
        unit: 'reps',
        goal: '20 répétitions',
        how: [
          'Descendez jusqu’à frôler le sol des fesses, talons ancrés au sol.',
          'Accroché des deux mains à un support fixe, pause de 3-4 s tout en bas en contractant fessiers et abdos.',
          'À 10 squats profonds de face, placez-vous de profil et ne tenez plus que d’une main, puis de moins en moins.',
        ],
        tips: ['Variante : contrepoids de plus en plus légers tenus à bout de bras (ta kettlebell de 12 kg marche très bien).'],
        pages: ['pistol-squats-profonds'],
      },
      {
        num: '3',
        name: 'Pistol squats assistés',
        target: 10,
        unit: 'reps',
        perSide: true,
        goal: '10 répétitions de chaque côté, avec aussi peu d’assistance que possible',
        how: [
          'Sur une seule jambe, l’autre tendue devant vous, bras tendus pour l’équilibre.',
          'D’abord sur une chaise ou un banc (descente active), puis en tenant une barre, puis d’une seule main, ou avec un contrepoids.',
          'Contraction maximale des abdos en bas, et « repoussez » le sol pour remonter.',
        ],
        tips: ['Pieds nus si possible.', 'Travaillez autant chaque jambe ; commencez par la plus faible.'],
        pages: ['pistol-assistes'],
      },
      {
        num: '4',
        name: 'Pistol squats',
        target: 6,
        unit: 'reps',
        perSide: true,
        goal: '6 répétitions de chaque côté',
        how: ['Sans aide. Au moment de remonter, imaginez faire pivoter le sol vers la droite avec le pied droit, vers la gauche avec le pied gauche.'],
        pages: ['pistol-assistes', 'pistol-photo'],
      },
    ],
    pages: ['pistol-photo', 'pistol-intro'],
    hero: 'pistol-photo',
  },
  {
    id: 'gainage',
    name: 'Gainage',
    short: 'Gainage',
    icon: 'remove-outline',
    intro:
      'La première étape vers toutes les figures statiques. Mieux vaut un effort court et intense en « vrai » gainage que tenir longtemps des positions plus faciles.',
    phase2: '1 minute de gainage',
    levels: [
      {
        num: '1',
        name: 'Gainage à genoux ou pieds écartés',
        target: 30,
        unit: 'sec',
        goal: 'tenir 30 secondes',
        how: [
          'Option 1 : à genoux, pieds et mollets relevés, avant-bras au sol, coudes sous les épaules, abdos gainés.',
          'Option 2 : jambes tendues, pieds écartés. Resserrez les pieds au fil des progrès.',
        ],
        pages: ['gainage-niveaux'],
      },
      {
        num: '2',
        name: 'Gainage',
        target: 60,
        unit: 'sec',
        goal: 'tenir 60 secondes, confortablement',
        how: [
          'Jambes tendues, pieds joints, fessiers contractés.',
          'Imaginez repousser la terre avec vos épaules.',
          'Rentrez le ventre comme si on allait vous donner un coup de poing (transverses) : les abdos doivent lâcher avant les épaules.',
        ],
        tips: ['Dos creusé = ce n’est pas une planche.'],
        pages: ['gainage-niveaux'],
      },
    ],
    pages: ['gainage-intro'],
    hero: 'gainage-intro',
  },
  {
    id: 'dips',
    name: 'Dips',
    short: 'Dips',
    icon: 'arrow-down-outline',
    intro:
      'Ils développent une force de poussée utile partout. Il y a rarement de mauvais exercices, seulement une mauvaise préparation ou exécution : d’où la progression niveau par niveau.',
    important:
      'Pour tous les niveaux : épaules basses, torse droit, bras toujours contractés. Garder les bras tendus est un effort actif. Ne descendez pas plus bas que 90°.',
    phase2: '12 dips',
    levels: [
      {
        num: '1',
        name: 'Dips sur support jambes pliées',
        target: 12,
        unit: 'reps',
        goal: '12 répétitions',
        how: [
          'Support bas derrière vous (barre basse, chaise, muret), bras tendus, jambes pliées.',
          'Fléchissez les bras jusqu’à 90°, puis remontez jusqu’à tendre les bras, sans jamais cesser de les contracter.',
        ],
        pages: ['dips-intro'],
      },
      {
        num: '2',
        name: 'Dips sur support jambes tendues',
        target: 12,
        unit: 'reps',
        goal: '12 répétitions',
        how: ['Même exercice, jambes tendues : vous soulevez davantage votre poids.'],
        pages: ['dips-n2-n4'],
      },
      {
        num: '3',
        name: 'Dips négatifs',
        target: 8,
        unit: 'reps',
        goal: '8 répétitions',
        how: [
          'Entre deux barres parallèles (ou deux supports assez hauts).',
          'Démarrez bras tendus (jambes pliées si les supports sont bas).',
          'Descendez à 90° aussi lentement que possible, posez les pieds, remontez et enchaînez.',
        ],
        tips: ['L’élastique reste une progression intermédiaire possible.'],
        pages: ['dips-n2-n4'],
      },
      {
        num: '4',
        name: 'Dips',
        target: 12,
        unit: 'reps',
        goal: '12 répétitions',
        how: ['Si vous maîtrisez les négatifs, remontez ! Si vous stagnez, enchaînez dips et dips négatifs, ou augmentez la fréquence.'],
        pages: ['dips-n2-n4', 'dips-photo'],
      },
    ],
    pages: ['dips-photo', 'dips-intro'],
    hero: 'dips-photo',
  },
  {
    id: 'lsit',
    name: 'L-sit',
    short: 'L-sit',
    icon: 'git-commit-outline',
    intro:
      'Une clé de voûte du contrôle au poids de corps : il relie le haut et le bas du corps et accélère le front lever, le muscle up, les pompes en équilibre… Il demande un peu de souplesse : pouvoir frôler ses orteils.',
    important:
      'Les bras « trop courts » sont rarement un souci : si votre envergure est inférieure de plus de 10 cm à votre taille, surélevez-vous sur de petits supports.',
    phase2: '10 s de L-sit (ou 10 s de L-sit genoux pliés à 90°)',
    stretchTip: 'Entre deux essais : « toucher ses pieds assis » (3 s effort / 3 s relâchement).',
    levels: [
      {
        num: '1',
        name: 'Vous soulever',
        target: 8,
        unit: 'sec',
        goal: 'tenir 6-8 secondes',
        how: [
          'Mains entre deux supports (chaises, bancs), bras tendus, épaules baissées, tête droite.',
          'Au début, gardez les pieds au sol puis mettez de plus en plus de poids sur les mains, puis seulement le bout des orteils, avant de décoller.',
          'Choisissez un support assez bas : ramener les genoux vers la poitrine prépare la suite.',
        ],
        tips: ['Chaque effort doit être à 100 %.'],
        pages: ['lsit-n1-n2'],
      },
      {
        num: '2',
        name: 'Vous soulever au sol',
        target: 8,
        unit: 'sec',
        goal: 'vous soulever jambes pliées durant 6-8 secondes',
        how: [
          'Au sol, mains de part et d’autre, poussez de toutes vos forces en ramenant les genoux vers le visage.',
          'Bras tendus, épaules baissées, buste droit. Vous allez échouer, échouer… jusqu’au jour où POUF ! les hanches décollent.',
        ],
        extra: { name: 'Relevés de jambes (niveau 2 bis)', target: 10, unit: 'reps', goal: '10 répétitions, mains au-delà des genoux' },
        pages: ['lsit-n1-n2'],
      },
      {
        num: '3',
        name: 'Déplier les jambes',
        target: 5,
        unit: 'sec',
        goal: 'vous soulever jambes dépliées durant 5 secondes',
        how: [
          'Dépliez les jambes un peu plus à chaque essai.',
          'Entre chaque essai : assis jambes tendues, touchez vos pieds ; quand ça tire, contractez tout 3 s, relâchez, expirez, avancez les mains. 3-4 fois.',
        ],
        pages: ['lsit-n3-n4'],
      },
      {
        num: '4',
        name: 'L-sit',
        target: 10,
        unit: 'sec',
        goal: 'tenir 10 secondes',
        how: ['Nouvel objectif : augmenter votre chrono. Ne lâchez rien !'],
        pages: ['lsit-n3-n4'],
      },
    ],
    pages: ['lsit-intro'],
    hero: 'lsit-intro',
  },
];

export const exo = (id: ExoId) => EXERCISES.find((e) => e.id === id)!;

// ——— Échauffement (livre p. 58) ———
export type Move = { name: string; dose: string; how: string; sec?: number; page: PageId; variant?: string };

export const WARMUP_UPPER: Move[] = [
  { name: 'Moulinets poignets', dose: '10-15 / sens', how: 'Poings fermés, rotations des poignets vers l’intérieur puis l’extérieur. Avant-bras immobiles.', page: 'echauf-haut-1' },
  { name: 'Moulinets coudes', dose: '10-15 / sens', how: 'Bras pliés à 90°, rotations des avant-bras, coudes fixes. Sens horaire et antihoraire.', page: 'echauf-haut-1' },
  { name: 'Moulinets épaules', dose: '10-15 / sens', how: 'Bras relâchés, grands cercles le plus haut et le plus en arrière possible, vers l’avant puis l’arrière.', page: 'echauf-haut-1' },
  { name: 'Torsions de buste', dose: '10-15 / côté', how: 'Mains derrière la tête ou bras pliés devant, tournez le buste sans bouger les hanches.', page: 'echauf-haut-1' },
  { name: 'Extensions de poignets', dose: '5 / angle', how: 'À quatre pattes, paumes au sol, balancez-vous doucement d’avant en arrière : mains vers l’avant, puis vers l’intérieur, puis vers l’extérieur.', page: 'echauf-haut-1' },
  { name: 'Flexions de poignets', dose: '5 / angle', how: 'À quatre pattes, mains tournées vers vous, paumes vers le haut. Faible amplitude si c’est douloureux.', page: 'echauf-haut-1' },
  { name: 'Exercice pull facile', dose: '10-15 rép.', how: 'Tractions australiennes très hautes (corps presque debout) : tirez la poitrine vers la barre.', page: 'echauf-haut-1' },
  { name: 'Exercice push facile', dose: '15-20 rép.', how: 'Pompes contre un mur (ou à genoux si tu fais déjà des pompes surélevées basses). Variante : dips sur support.', page: 'echauf-haut-2' },
  { name: 'Exercice abdos : montées de jambes', dose: '10-15 rép.', how: 'Allongé, jambes tendues, pieds décollés. Montez jusqu’à 90°, bas du dos collé au sol, redescendez sans poser les pieds. Contraction courte mais intense.', page: 'echauf-haut-2' },
];

export const WARMUP_LOWER: Move[] = [
  { name: 'Montées de mollets', dose: '30 s', sec: 30, how: 'Montez sur la pointe des pieds jambes tendues, puis redescendez.', page: 'echauf-bas-1' },
  { name: 'Montées d’orteils', dose: '30 s', sec: 30, how: 'Dos contre un mur, montez la pointe des pieds en gardant les talons proches du mur.', page: 'echauf-bas-1' },
  { name: 'Squats', dose: '30 s', sec: 30, how: 'Descendez aussi bas que c’est confortable, dos droit, abdos engagés.', variant: 'assistés de la main sur un support', page: 'echauf-bas-1' },
  { name: 'Fentes cosaques alternées', dose: '30 s', sec: 30, how: 'Fléchissez une jambe autant que possible, l’autre tendue, remontez et alternez.', variant: 'assistées de la main sur un support', page: 'echauf-bas-2' },
  { name: 'Fentes alternées', dose: '30 s', sec: 30, how: 'Avancez une jambe, genou arrière qui frôle le sol, genou avant à 90°, alternez.', page: 'echauf-bas-2' },
  { name: 'Montées de genoux allongé', dose: '30 s', sec: 30, how: 'Sur le dos, soulevez les hanches pour ramener les genoux vers le visage, sans poser les pieds.', page: 'echauf-bas-2' },
];

export const WARMUP_NOTE =
  'Commencez lentement et ajoutez de la vitesse : l’important est de sentir votre cœur battre et le sang affluer dans vos muscles, sans vous fatiguer.';

// ——— Étirements (livre p. 62-63) ———
export const STRETCH_PHASE1: Move[] = [
  { name: 'Toucher ses pieds assis', dose: '×4', sec: 30, how: 'Assis, jambes tendues, pieds joints. Mains vers les pieds : 3 s d’effort, 3 s de relâchement, 3-4 fois d’affilée.', page: 'etir-phase1' },
  { name: 'Squat profond', dose: '30 s', sec: 30, how: 'Descendez fessiers près des talons, talons au sol (accroché à un support ou kettlebell en contrepoids). 30 s en bas, abdos et fessiers contractés.', page: 'etir-phase1' },
  { name: 'Relâchement des fléchisseurs (gauche)', dose: '20 s', sec: 20, how: 'Assis, appui sur une main derrière, jambe opposée pliée devant, l’autre glisse en arrière. Poussez le bassin vers l’avant sans cambrer.', page: 'etir-phase1' },
  { name: 'Relâchement des fléchisseurs (droite)', dose: '20 s', sec: 20, how: 'Même chose de l’autre côté.', page: 'etir-phase1' },
];

export const STRETCH_FEELGOOD: Move[] = [
  { name: 'Pectoraux', dose: '10 s / côté', how: 'Main contre une barre verticale, bras tendu, tournez le buste à l’opposé. Main plus haute puis plus basse que l’épaule.', page: 'etir-toutes-1' },
  { name: 'Dorsaux', dose: '10 s', how: 'Doigts entrelacés, bras tendus devant, éloignez les mains en arrondissant le dos.', page: 'etir-toutes-1' },
  { name: 'Obliques', dose: '10 s / côté', how: 'De profil au support, mains comme pour le drapeau, inclinez le buste et éloignez le pied extérieur.', page: 'etir-toutes-1' },
  { name: 'Cou', dose: '10 s / côté', how: 'Main sur la clavicule opposée, tête vers l’arrière et sur le côté jusqu’à une légère tension.', page: 'etir-toutes-2' },
  { name: 'Abdos : la vache', dose: '10 s', how: 'À quatre pattes, creusez le dos au maximum en engageant les abdos.', page: 'etir-toutes-2' },
  { name: 'Fente avec torsion', dose: '10 s / côté', how: 'En fente, main opposée près du pied avant, l’autre bras va chercher le plafond, regard vers la main.', page: 'etir-toutes-2' },
];

// ——— Circuit HIIT (livre p. 94) : jumping jacks remplacés par des swings kettlebell ———
export const HIIT: Move[] = [
  { name: 'Burpees', dose: '×10', how: 'Squat, mains au sol, pieds en arrière, une pompe, pieds sous les hanches, saut bras levés.', variant: 'sans pompe ou avec pompe à genoux', page: 'hiit-1' },
  { name: 'Bateau', dose: '30 s', sec: 30, how: 'Assis, jambes tendues relevées, buste descendu : pieds et épaules à quelques centimètres du sol.', variant: 'jambes pliées', page: 'hiit-1' },
  { name: 'Swings kettlebell 12 kg', dose: '×15', how: 'Remplace les jumping jacks. Voir la fiche kettlebell : hanches qui poussent, bras relâchés, cloche à hauteur de poitrine.', page: 'hiit-1' },
  { name: 'Twist russe', dose: '×20', how: 'Assis, jambes légèrement relevées, buste incliné, tournez le buste à gauche puis à droite avec les mains.', variant: 'jambes pliées', page: 'hiit-1' },
  { name: 'Gainage côté (gauche)', dose: '30 s', sec: 30, how: 'Appui sur l’avant-bras, jambes tendues, corps aligné, abdos et fessiers contractés.', variant: 'genou au sol', page: 'hiit-2' },
  { name: 'Gainage côté (droite)', dose: '30 s', sec: 30, how: 'Même chose de l’autre côté.', variant: 'genou au sol', page: 'hiit-2' },
  { name: 'Mountain climbers', dose: '×30', how: 'Planche bras tendus, ramenez alternativement les genoux vers la poitrine, rythme soutenu.', variant: 'mains surélevées', page: 'hiit-2' },
  { name: 'Sit-ups en chaise', dose: '×15', how: 'Sur le dos, jambes à 90° pieds relevés. Contractez avant de bouger, mains pas derrière la tête, bas du dos collé, visez le plafond avec la poitrine.', variant: 'crunch', page: 'hiit-2' },
];

// ——— Kettlebell 12 kg (ajout, pas dans le livre) ———
export type KbMove = { name: string; sets: number; reps: string; rest: number; how: string[]; safety: string };
export const KB_MOVES: Record<'goblet' | 'swing', KbMove> = {
  goblet: {
    name: 'Goblet squat',
    sets: 2,
    reps: '10',
    rest: 45,
    how: [
      'Kettlebell tenue contre la poitrine par les cornes, coudes vers le bas.',
      'Pieds un peu plus larges que les épaules, descendez entre les genoux, talons au sol, buste fier.',
      'Remontez en poussant le sol. Le poids devant aide à descendre profond : excellent pour le squat profond et le pistol.',
    ],
    safety: 'Dos droit, genoux dans l’axe des pieds. Si 10 est facile, pause de 2 s en bas.',
  },
  swing: {
    name: 'Swing deux mains',
    sets: 2,
    reps: '15',
    rest: 45,
    how: [
      'Pieds largeur d’épaules, kettlebell un peu devant vous. Saisissez-la, dos plat, et « lancez-la » entre les jambes.',
      'Poussez violemment les hanches vers l’avant en contractant les fessiers : la cloche monte à hauteur de poitrine, bras relâchés.',
      'Laissez-la redescendre et recommencez. C’est une charnière de hanches, pas un squat ni un lever de bras.',
    ],
    safety: 'Dos plat, ne tirez pas avec les bras, expirez en haut. Reposez la kettlebell en contrôle.',
  },
};

// ——— Séances de 40 min ———
export type SessionType = 'A' | 'B';
export const SESSION_INFO: Record<SessionType, { title: string; subtitle: string; blocks: { name: string; min: number }[] }> = {
  A: {
    title: 'Technique + kettlebell',
    subtitle: 'Le circuit technique du livre en 3 tours, puis la kettlebell pour les jambes et le cardio.',
    blocks: [
      { name: 'Échauffement haut + bas', min: 8 },
      { name: 'Circuit technique · 3 tours', min: 25 },
      { name: 'Kettlebell : goblet squat + swing', min: 5 },
      { name: 'Retour au calme', min: 2 },
    ],
  },
  B: {
    title: 'Technique + HIIT',
    subtitle: 'Le circuit technique en 2 tours, le HIIT du livre avec des swings à la place des jumping jacks, puis les étirements.',
    blocks: [
      { name: 'Échauffement haut + bas', min: 8 },
      { name: 'Circuit technique · 2 tours', min: 18 },
      { name: 'Circuit HIIT · 2 tours (le livre en prévoit 4)', min: 12 },
      { name: 'Étirements Phase 1', min: 2 },
    ],
  },
};

// Planning du livre (0 = dimanche … 6 = samedi) : null = repos
export const PLANS: Record<3 | 4 | 5, (SessionType | null)[]> = {
  3: [null, 'A', null, 'B', null, 'A', null],
  4: [null, 'A', 'B', null, 'A', 'A', null],
  5: [null, 'A', 'A', 'B', 'A', 'A', null],
};

export const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const RULES = [
  'Qualité avant quantité : pas de demi-répétition ni de prise d’élan.',
  'À chaque tour, faites le maximum de répétitions propres du niveau le plus difficile que vous maîtrisez.',
  'C’est normal de faire moins de répétitions à chaque tour.',
  'Si vous faites 3 répétitions ou moins (5 s ou moins pour le L-sit), complétez avec le maximum du niveau précédent. Ex. : 2 tractions + 3 tractions négatives.',
  'Pas d’échec musculaire : si la prochaine répétition ne peut pas être propre, ne la démarrez pas. Soyez humble !',
  'Quand vous atteignez l’objectif d’un niveau au premier tour, passez au niveau supérieur.',
];
