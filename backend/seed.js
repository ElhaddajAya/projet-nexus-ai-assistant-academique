// ============================================================
// seed.js — Script de population de la DB MongoDB pour OrientAI
// Filière IIR — 1ère et 2ème année
// Usage : node seed.js (depuis la racine du backend)
// ============================================================

const mongoose = require("mongoose");
require("dotenv").config();

// --- Import des vrais modèles du projet ---
const Filiere = require("./src/models/Filiere");
const Module = require("./src/models/Module");
const Matiere = require("./src/models/Matiere");
const Ressource = require("./src/models/Ressource");

// ============================================================
// LIENS GOOGLE DRIVE — 1ère année (ordre alphabétique)
// ============================================================
const L1 = [
  "https://drive.google.com/file/d/12MMVqwjFDBXv9QH8rIIoN4VBcT_tHZ-a/view?usp=sharing",  // 0  Algebre1-Cours-Matrices
  "https://drive.google.com/file/d/12iJfcsWb7zUrTNKYT4ajxdmoR73KebNx/view?usp=sharing",  // 1  Algebre1-Nombres-complexes
  "https://drive.google.com/file/d/14N9cBC1R9PP-2o3n7LPPp1KkDMcLxCJE/view?usp=sharing",  // 2  Annexe boucles C
  "https://drive.google.com/file/d/18WXSMBPKrG_geMgDeE24mJvOEDmd7mSh/view?usp=sharing",  // 3  CH3-TD1
  "https://drive.google.com/file/d/193UvoiqNyirT14UXyPNLKiL7i_C9MwjK/view?usp=sharing",  // 4  Chapitre3-structures repetitives
  "https://drive.google.com/file/d/1AS_QNpeb9fsYICwYxjo_JqPkbOCKG0JS/view?usp=sharing",  // 5  Cours-Numerique-Bascule RS
  "https://drive.google.com/file/d/1F-28TTkmhe4xCFgEvlaNNunR12lcFlFm/view?usp=sharing",  // 6  Cours B2 conditionnel
  "https://drive.google.com/file/d/1GfX6s7xGPYhChrX3RysOwgZiroeBZosw/view?usp=sharing",  // 7  Cours introduction IA
  "https://drive.google.com/file/d/1GwX5oAaCNcCmrw9-AinbeTkcWitYr6mr/view?usp=sharing",  // 8  Examen Electricite 2022
  "https://drive.google.com/file/d/1HTnoZ4kOinmFFaWO0059fhhSPmNl6QgV/view?usp=sharing",  // 9  Examens-Algebre
  "https://drive.google.com/file/d/1KY2IhQJzU1AC_NsTeDXyAmHlDF5VTHft/view?usp=sharing",  // 10 Exercices ecoles & structures
  "https://drive.google.com/file/d/1M4uOtfAbf67TndIcVaHvIY-M_B-ldbPJ/view?usp=sharing",  // 11 Les theories organisationnelles
  "https://drive.google.com/file/d/1MnqqvPe-1MbXugBOQHhvGrOiEOQyqHad/view?usp=sharing",  // 12 Les styles apprentissage
  "https://drive.google.com/file/d/1OdiYjV9r2beud-XaqlQCQAPfA3B-b5nB/view?usp=sharing",  // 13 Numerique Bascule RS chronogramme
  "https://drive.google.com/file/d/1PNfq2ooFMjQ758k2V7r-JILJFf0LlySf/view?usp=sharing",  // 14 Serie1-Algebre1-complexes
  "https://drive.google.com/file/d/1Tx9Twpd6Y2EdCCo_lH7KOMbrF8wV47Zs/view?usp=sharing",  // 15 TD3-Logique Combinatoire
  "https://drive.google.com/file/d/1VDh4z_8jmmigKnKxTG1azBYBR3az6EKg/view?usp=sharing",  // 16 TD4-correction
  "https://drive.google.com/file/d/1Vs8bz1YKeC-6zuDbFQrp4OD_PNqMdYo4/view?usp=sharing",  // 17 TD_1_CN_S1_2024
  "https://drive.google.com/file/d/1W0iBJHo8Q7qIyJhVLLuRDGEsYEjs6LG1/view?usp=sharing",  // 18 TD Algorithmique1
  "https://drive.google.com/file/d/1YNV3y9dFNquLdKy4MUevnEgG3uapRegG/view?usp=sharing",  // 19 TP Metrologie
  "https://drive.google.com/file/d/1aEsXp_Rj58drc59EpkbpxpqNfwOVd5sQ/view?usp=sharing",  // 20 algebre1-Fractions-rationnelles
  "https://drive.google.com/file/d/1fsieHMHJIzwsGL0Ut_ne9S6_TQMb-0-G/view?usp=sharing",  // 21 algebre systemes lineaires
  "https://drive.google.com/file/d/1hqg8FLoHIhG5uBzci1x7m2XDO2YTsESO/view?usp=sharing",  // 22 analyse1_ch5 dev limites
  "https://drive.google.com/file/d/1nYUWG2YysXOWzBmUB1FTthKBsWSI4B0d/view?usp=sharing",  // 23 chapitre1 elements de base LP1
  "https://drive.google.com/file/d/1ofhCZ5ydkV0AjgO7nnJYBPbFKQMBlUG9/view?usp=sharing",  // 24 chapitre2 TDs LP1
  "https://drive.google.com/file/d/1qQdFrQOKzx6V1aEiB-PY_35WlwAdMKtv/view?usp=sharing",  // 25 chapitre3 TDs LP1
  "https://drive.google.com/file/d/1qscOU_O8G3N4c7vBNckedhWcWD3W1iRD/view?usp=sharing",  // 26 chapitre2 structure Conditionnelle LP1
  "https://drive.google.com/file/d/1sGJle5QJM2ZOQp1fPfEGehwPCsVkA-TG/view?usp=sharing",  // 27 cours-10-18 (suites numeriques)
  "https://drive.google.com/file/d/1uxnQAsUINlkCEhO3mWqwbW5-Hl4TLzHy/view?usp=sharing",  // 28 cours-18-31
  "https://drive.google.com/file/d/1wQfOfWIf-Vv0KK82N0NOyWp1rUSqVV7S/view?usp=sharing",  // 29 cours-32-37
  "https://drive.google.com/file/d/1xSI5Qf3mg6_S9D7ZTZ8mAY969IQMz23t/view?usp=sharing",  // 30 cours Electromagnetisme Partie1&2
  "https://drive.google.com/file/d/1xe3UNhv_AZ8eAttHXOmTbFKlA-Q9cfo1/view?usp=sharing",  // 31 structure de machine 1
  "https://drive.google.com/file/d/1yN7PuXAwa_ml-LqvHlnioEctY8-pqx0r/view?usp=sharing",  // 32 theorie des organisations 2024
];

// ============================================================
// LIENS GOOGLE DRIVE — 2ème année (ordre alphabétique)
// ============================================================
const L2 = [
  "https://drive.google.com/file/d/1-P0E74qV6flOK-GMIu6DAXm2Ad4B_fVl/view?usp=sharing",  // 0  1-Introduction (Merise)
  "https://drive.google.com/file/d/10wamOYPvkx9rIJy9yfVGhjplXx0p5BEZ/view?usp=sharing",  // 1  2-MCC
  "https://drive.google.com/file/d/12AbhSKyMBRIUn2vlgJwqb2PLiVqv68PL/view?usp=sharing",  // 2  2Tableaux (Prog C)
  "https://drive.google.com/file/d/145FpZU3Gi36-26yb4nRGTTeBqGI4bHQc/view?usp=sharing",  // 3  3-MCT
  "https://drive.google.com/file/d/170AC86d6j-khqTQt7W_5qgkvQfMEe6_c/view?usp=sharing",  // 4  3Fonctions (Prog C)
  "https://drive.google.com/file/d/17SfBS5dXJPTVIGf2RKqc2zaJSrdHSMr3/view?usp=sharing",  // 5  4Pointeurs (Prog C)
  "https://drive.google.com/file/d/1Ay8yPiNImEi4_hs20QEjzJ3q0exL5_Xd/view?usp=sharing",  // 6  5Fichiers (Prog C)
  "https://drive.google.com/file/d/1DIO9nxhGSTPX4M8RFIELDFyE-Vy2dQZq/view?usp=sharing",  // 7  Architecture Ordinateurs SE1
  "https://drive.google.com/file/d/1JQ6JjjEIC1Y4uA8_9pzTf6r0yzStDniS/view?usp=sharing",  // 8  Chapitre1 Analyse combinatoire
  "https://drive.google.com/file/d/1M3ROcHaElw0b0PztrA8UWgBSm0q_M6ZW/view?usp=sharing",  // 9  Correction TDs (Prog C)
  "https://drive.google.com/file/d/1R5MIgmcvnRZvBIA18FStCgIO2TTPsUuk/view?usp=sharing",  // 10 Cours S.Exploitation
  "https://drive.google.com/file/d/1Sz95qxE90ORDGQ2WxABQ9S60P_o4Y-2y/view?usp=sharing",  // 11 Pre-Chap3 (Proba)
  "https://drive.google.com/file/d/1WRLfJF9Me87GAHYdrmhf9VzwKmE2umgz/view?usp=sharing",  // 12 Proba-ch3-2
  "https://drive.google.com/file/d/1aIc_euBeYeEmsssLoy5-A5zBjdjTDvjk/view?usp=sharing",  // 13 Proba-chapitre3-1
  "https://drive.google.com/file/d/1atBMSFvB-GAhSkpxTNvS7L_n2YHkVTME/view?usp=sharing",  // 14 SE cours chapitres 0_1_2
  "https://drive.google.com/file/d/1bTQAzjwuoeuPaPTQf_UU-clHY2Xlgpv1/view?usp=sharing",  // 15 TD LangageC S2
  "https://drive.google.com/file/d/1eaRnjBlWY7MtsBde07NdKHkm3U_zcNeq/view?usp=sharing",  // 16 chapitre3 VarA (Proba)
  "https://drive.google.com/file/d/1sPjiQWYfO2S2MNif2nRossawfqomOlJT/view?usp=sharing",  // 17 cours Microprocesseurs 25-26
  "https://drive.google.com/file/d/1sz8w_hJutGJWwI-RyUM9raOdUyK9AAGt/view?usp=sharing",  // 18 cours LangageC S2
  "https://drive.google.com/file/d/1u9JJI9eT5CMguSZzxoOKrfT8vahrt-iQ/view?usp=sharing",  // 19 exercice FIFO
];

// ============================================================
// FONCTION PRINCIPALE
// ============================================================
async function seed()
{
  try
  {
    // 1. Connexion MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB\n");

    // ── 2. Nettoyage IIR existant ──────────────────────────────
    const existing = await Filiere.findOne({ code_filiere: "IIR" });
    if (existing)
    {
      // Récupérer tous les modules de cette filière
      const modules = await Module.find({ id_filiere: existing._id });
      for (const mod of modules)
      {
        // Récupérer les matières de ce module
        const matieres = await Matiere.find({ moduleId: mod._id });
        for (const mat of matieres)
        {
          // Supprimer les ressources liées à chaque matière
          await Ressource.deleteMany({ matiereId: mat._id });
        }
        await Matiere.deleteMany({ moduleId: mod._id });
      }
      await Module.deleteMany({ id_filiere: existing._id });
      await Filiere.deleteOne({ _id: existing._id });
      console.log("🗑️  Données IIR existantes supprimées\n");
    }

    // ── 3. Créer la filière IIR ────────────────────────────────
    const filiere = await Filiere.create({
      nom_filiere: "Ingénierie Informatique et Réseaux",
      code_filiere: "IIR",
    });
    console.log(`✅ Filière : ${filiere.nom_filiere} (${filiere.code_filiere})\n`);

    // ── 4. Données : modules + matières + ressources ───────────
    // Structure : { nom_module, semestre, matieres: [{ nom, difficultes, ressources }] }
    const data = [

      // ══════════════════════════════════════════════
      // 1ère ANNÉE — SEMESTRE 1
      // ══════════════════════════════════════════════
      {
        nom_module: "Informatique 1A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Algorithmique 1",
            difficultes: [
              "Comprendre la logique algorithmique",
              "Écrire des algorithmes en pseudo-code",
              "Structures conditionnelles (if/else)",
              "Structures répétitives (for, while, do-while)",
              "Tracer l'exécution pas à pas",
            ],
            ressources: [
              { titre: "TD Algorithmique 1", type: "TP/TD", lien: L1[18], desc: "Travaux dirigés sur les algorithmes fondamentaux" },
              { titre: "Chapitre 1 — Éléments de base (LP1)", type: "document", lien: L1[23], desc: "Introduction aux éléments de base de la programmation en C" },
              { titre: "Chapitre 2 — Structure Conditionnelle", type: "document", lien: L1[26], desc: "Structures conditionnelles en langage C" },
              { titre: "Chapitre 3 — Structures Répétitives", type: "document", lien: L1[4], desc: "Boucles et structures répétitives en C" },
              { titre: "Annexe — Les trois boucles en C", type: "document", lien: L1[2], desc: "Référence rapide : for, while, do-while en C" },
              { titre: "TD Chapitre 2 (LP1)", type: "TP/TD", lien: L1[24], desc: "Exercices pratiques sur les structures de base" },
              { titre: "TD Chapitre 3 (LP1)", type: "TP/TD", lien: L1[25], desc: "Exercices pratiques sur les structures répétitives" },
            ],
          },
        ],
      },

      {
        nom_module: "Mathématiques 1A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Algèbre 1",
            difficultes: [
              "Opérations sur les matrices",
              "Calcul de déterminants et inverse",
              "Nombres complexes et représentation",
              "Fractions rationnelles",
              "Résolution de systèmes linéaires",
              "Séries numériques",
            ],
            ressources: [
              { titre: "Cours — Matrices", type: "document", lien: L1[0], desc: "Cours complet sur les matrices et opérations" },
              { titre: "Cours — Nombres Complexes", type: "document", lien: L1[1], desc: "Support de cours sur les nombres complexes" },
              { titre: "Cours — Fractions Rationnelles", type: "document", lien: L1[20], desc: "Cours sur les fractions rationnelles" },
              { titre: "Cours — Systèmes Linéaires", type: "document", lien: L1[21], desc: "Résolution des systèmes d'équations linéaires" },
              { titre: "TD — Série 1 Complexes", type: "TP/TD", lien: L1[14], desc: "Série d'exercices sur les nombres complexes" },
              { titre: "CH3 — TD1", type: "TP/TD", lien: L1[3], desc: "Travaux dirigés chapitre 3" },
              { titre: "Examens Algèbre", type: "document", lien: L1[9], desc: "Annales d'examens d'Algèbre 1" },
            ],
          },
          {
            nom: "Analyse 1",
            difficultes: [
              "Suites numériques et convergence",
              "Développements limités",
              "Fonctions continues et dérivables",
              "Calcul de limites",
            ],
            ressources: [
              { titre: "Cours — Suites Numériques (Ch.2)", type: "document", lien: L1[27], desc: "Chapitre sur les suites numériques" },
              { titre: "Cours Analyse 1 — Partie 2", type: "document", lien: L1[28], desc: "Suite du cours d'Analyse 1 (pages 18-31)" },
              { titre: "Cours Analyse 1 — Partie 3", type: "document", lien: L1[29], desc: "Fin du cours d'Analyse 1 (pages 32-37)" },
              { titre: "Chapitre 5 — Développements Limités", type: "document", lien: L1[22], desc: "Cours sur les développements limités" },
            ],
          },
        ],
      },

      {
        nom_module: "Électronique 1A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Circuits Numériques 1",
            difficultes: [
              "Logique combinatoire",
              "Fonctionnement des bascules RS",
              "Lecture de chronogrammes",
              "Tables de vérité",
              "Simplification avec Karnaugh",
            ],
            ressources: [
              { titre: "Cours — Bascule RS", type: "document", lien: L1[5], desc: "Cours sur les bascules RS en logique numérique" },
              { titre: "Cours — Chronogramme Bascule RS", type: "document", lien: L1[13], desc: "Représentation chronogramme des bascules RS" },
              { titre: "TD3 — Logique Combinatoire", type: "TP/TD", lien: L1[15], desc: "Exercices de logique combinatoire" },
              { titre: "TD4 — Correction", type: "TP/TD", lien: L1[16], desc: "Correction du TD4 de circuits numériques" },
              { titre: "TD 1 CN S1 2024", type: "TP/TD", lien: L1[17], desc: "TD circuits numériques S1 2024" },
            ],
          },
          {
            nom: "Circuits Électriques",
            difficultes: [
              "Lois de Kirchhoff",
              "Régime continu et alternatif",
              "Calcul d'impédances",
              "Analyse de circuits RC/RL",
            ],
            ressources: [
              { titre: "Examen Électricité 2022", type: "document", lien: L1[8], desc: "Annale d'examen de circuits électriques" },
            ],
          },
        ],
      },

      {
        nom_module: "Culture Générale 1A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Organisation des Entreprises",
            difficultes: [
              "Théories organisationnelles",
              "Structures d'entreprises",
              "Styles de management",
              "Environnement de l'entreprise",
            ],
            ressources: [
              { titre: "Les Théories Organisationnelles", type: "document", lien: L1[11], desc: "Cours sur les théories des organisations" },
              { titre: "Théorie des Organisations 2024", type: "document", lien: L1[32], desc: "Support de cours mis à jour 2024" },
              { titre: "Les Styles d'Apprentissage", type: "document", lien: L1[12], desc: "Cours sur les styles d'apprentissage" },
              { titre: "Exercices — Écoles & Structures", type: "TP/TD", lien: L1[10], desc: "Exercices sur les structures organisationnelles" },
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════
      // 1ère ANNÉE — SEMESTRE 2
      // ══════════════════════════════════════════════
      {
        nom_module: "Sciences 1A S2",
        semestre: "S2",
        matieres: [
          {
            nom: "Électromagnétisme",
            difficultes: [
              "Champs électriques et potentiel",
              "Champs magnétiques",
              "Loi de Faraday et induction",
              "Équations de Maxwell (introduction)",
            ],
            ressources: [
              { titre: "Cours Électromagnétisme — Parties 1 & 2", type: "document", lien: L1[30], desc: "Cours complet d'électromagnétisme" },
            ],
          },
          {
            nom: "Introduction à l'Intelligence Artificielle",
            difficultes: [
              "Comprendre les concepts de base de l'IA",
              "Distinguer IA, ML, Deep Learning",
              "Algorithmes de recherche",
              "Introduction aux réseaux de neurones",
            ],
            ressources: [
              { titre: "Cours — Introduction à l'IA", type: "document", lien: L1[7], desc: "Notes de cours d'introduction à l'IA (1A 2024-2025)" },
            ],
          },
        ],
      },

      {
        nom_module: "Informatique 1A S2",
        semestre: "S2",
        matieres: [
          {
            nom: "Structure de Machine",
            difficultes: [
              "Architecture von Neumann",
              "Composants matériels d'un ordinateur",
              "Fonctionnement du processeur",
              "Mémoire RAM et ROM",
              "Bus et interfaces",
            ],
            ressources: [
              { titre: "Cours — Structure de Machine 1", type: "document", lien: L1[31], desc: "Cours sur la structure interne d'un ordinateur" },
            ],
          },
        ],
      },

      {
        nom_module: "Sciences Appliquées 1A S2",
        semestre: "S2",
        matieres: [
          {
            nom: "Métrologie",
            difficultes: [
              "Instruments de mesure",
              "Calcul d'incertitudes",
              "Analyse d'erreurs",
              "Compte-rendu de TP",
            ],
            ressources: [
              { titre: "TP Métrologie II", type: "TP/TD", lien: L1[19], desc: "Travaux pratiques de métrologie" },
            ],
          },
        ],
      },

      {
        nom_module: "Communication 1A S2",
        semestre: "S2",
        matieres: [
          {
            nom: "Français — Communication",
            difficultes: [
              "Expression écrite formelle",
              "Conditionnel de politesse",
              "Rédaction de rapports",
              "Communication professionnelle",
            ],
            ressources: [
              { titre: "Cours B2 — Le Conditionnel", type: "document", lien: L1[6], desc: "Cours sur le conditionnel de politesse" },
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════
      // 2ème ANNÉE — SEMESTRE 1
      // ══════════════════════════════════════════════
      {
        nom_module: "Informatique 2A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Programmation Avancée en C",
            difficultes: [
              "Manipulation des tableaux",
              "Passage de paramètres aux fonctions",
              "Arithmétique des pointeurs",
              "Gestion des fichiers (fopen, fread, fwrite)",
              "Structures et typedef",
              "Allocation dynamique (malloc, free)",
            ],
            ressources: [
              { titre: "Cours — Tableaux", type: "document", lien: L2[2], desc: "Cours sur les tableaux en C" },
              { titre: "Cours — Fonctions", type: "document", lien: L2[4], desc: "Cours sur les fonctions en C" },
              { titre: "Cours — Pointeurs", type: "document", lien: L2[5], desc: "Cours sur les pointeurs en C" },
              { titre: "Cours — Fichiers", type: "document", lien: L2[6], desc: "Gestion des fichiers en C" },
              { titre: "Cours Langage C — S2", type: "document", lien: L2[18], desc: "Cours complet du langage C semestre 2" },
              { titre: "TD Langage C — S2", type: "TP/TD", lien: L2[15], desc: "Travaux dirigés du langage C" },
              { titre: "Correction TDs", type: "TP/TD", lien: L2[9], desc: "Correction des TDs de programmation C" },
            ],
          },
        ],
      },

      {
        nom_module: "Mathématiques 2A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Probabilités",
            difficultes: [
              "Dénombrement et analyse combinatoire",
              "Probabilités conditionnelles",
              "Variables aléatoires discrètes",
              "Variables aléatoires continues",
              "Lois usuelles (Binomiale, Poisson, Normale)",
            ],
            ressources: [
              { titre: "Chapitre 1 — Analyse Combinatoire", type: "document", lien: L2[8], desc: "Cours sur l'analyse combinatoire" },
              { titre: "Proba — Chapitre 3 (partie 1)", type: "document", lien: L2[13], desc: "Variables aléatoires — première partie" },
              { titre: "Proba — Chapitre 3 (partie 2)", type: "document", lien: L2[12], desc: "Variables aléatoires — deuxième partie" },
              { titre: "Variables Aléatoires — Pré-Chapitre 3", type: "document", lien: L2[11], desc: "Introduction aux variables aléatoires" },
              { titre: "Chapitre 3 — Variables Aléatoires", type: "document", lien: L2[16], desc: "Cours complet sur les variables aléatoires" },
              { titre: "Exercice FIFO", type: "TP/TD", lien: L2[19], desc: "Exercice sur les files d'attente (FIFO)" },
            ],
          },
        ],
      },

      {
        nom_module: "Électronique 2A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Microprocesseurs",
            difficultes: [
              "Architecture du 8086",
              "Registres et modes d'adressage",
              "Instructions assembleur",
              "Gestion des interruptions",
              "Interface avec la mémoire",
            ],
            ressources: [
              { titre: "Cours Microprocesseurs 2025-2026", type: "document", lien: L2[17], desc: "Cours complet sur le microprocesseur 8086" },
            ],
          },
        ],
      },

      // ══════════════════════════════════════════════
      // 2ème ANNÉE — SEMESTRE 2
      // ══════════════════════════════════════════════
      {
        nom_module: "Informatique 2A S2",
        semestre: "S2",
        matieres: [
          {
            nom: "Systèmes d'Exploitation",
            difficultes: [
              "Gestion des processus",
              "Ordonnancement CPU",
              "Gestion de la mémoire et pagination",
              "Système de fichiers",
              "Commandes Unix/Linux",
              "Interblocage (deadlock)",
            ],
            ressources: [
              { titre: "Architecture Ordinateurs & SE1", type: "document", lien: L2[7], desc: "Cours sur l'architecture des ordinateurs et SE" },
              { titre: "Cours Systèmes d'Exploitation", type: "document", lien: L2[10], desc: "Cours général sur les SE" },
              { titre: "SE — Chapitres 0, 1, 2 (2025)", type: "document", lien: L2[14], desc: "Cours SE mis à jour novembre 2025" },
            ],
          },
          {
            nom: "Merise",
            difficultes: [
              "Comprendre la méthode Merise",
              "Modèle Conceptuel des Données (MCD)",
              "Modèle Conceptuel de Communication (MCC)",
              "Modèle Conceptuel de Traitement (MCT)",
              "Passage MCD au MLD",
            ],
            ressources: [
              { titre: "Merise — Introduction", type: "document", lien: L2[0], desc: "Introduction à la méthode Merise" },
              { titre: "Merise — MCC", type: "document", lien: L2[1], desc: "Modèle Conceptuel de Communication" },
              { titre: "Merise — MCT", type: "document", lien: L2[3], desc: "Modèle Conceptuel de Traitement" },
            ],
          },
        ],
      },

    ];

    // ── 5. Insertion en DB ─────────────────────────────────────
    let totalModules = 0;
    let totalMatieres = 0;
    let totalRessources = 0;

    for (const modData of data)
    {
      // Créer le module
      const module = await Module.create({
        nom_module: modData.nom_module,
        semestre: modData.semestre,
        id_filiere: filiere._id,
      });
      totalModules++;

      for (const matData of modData.matieres)
      {
        // Créer la matière avec ses difficultés
        const matiere = await Matiere.create({
          nom_matiere: matData.nom,
          difficultes: matData.difficultes,
          moduleId: module._id,
        });
        totalMatieres++;

        // Créer les ressources liées à cette matière
        for (const res of matData.ressources)
        {
          await Ressource.create({
            titre: res.titre,
            description: res.desc,
            lien: res.lien,
            type: res.type,
            filiereId: filiere._id,
            matiereId: matiere._id,
            niveau: modData.semestre.startsWith("S1") || modData.semestre.startsWith("S2")
              ? (modData.nom_module.includes("1A") ? "1ère année" : "2ème année")
              : "",
          });
          totalRessources++;
        }

        console.log(`   📘 ${matData.nom} — ${matData.ressources.length} ressources`);
      }
    }

    // ── 6. Résumé ──────────────────────────────────────────────
    console.log("\n========================================");
    console.log("✅ Seed terminé avec succès !");
    console.log(`   Filière   : ${filiere.code_filiere}`);
    console.log(`   Modules   : ${totalModules}`);
    console.log(`   Matières  : ${totalMatieres}`);
    console.log(`   Ressources: ${totalRessources}`);
    console.log("========================================\n");

  } catch (err)
  {
    console.error("❌ Erreur seed :", err.message);
  } finally
  {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

seed();