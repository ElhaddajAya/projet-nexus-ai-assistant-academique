// ============================================================
// seed_4a.js — Population DB OrientAI — 4ème année IIR S1
// Usage : node seed_4a.js (depuis la racine du backend)
// ============================================================

const mongoose = require("mongoose");
require("dotenv").config();

const Filiere  = require("./src/models/Filiere");
const Module   = require("./src/models/Module");
const Matiere  = require("./src/models/Matiere");
const Ressource = require("./src/models/Ressource");

// ============================================================
// LIENS DRIVE — par matière (ordre alphabétique des fichiers)
// ============================================================

// --- Admin Unix (19 fichiers) ---
const UNIX = [
  "https://drive.google.com/file/d/12q06GufPYbQiqoTFu5HrhRUnoLNFV20f/view?usp=sharing",  // 0  Arret_Redemarrage_Installation
  "https://drive.google.com/file/d/16R6eIwsZwBVueBGk_a4GtagSwhDTs5ds/view?usp=sharing",  // 1  TP1-0 Installation+Commandes de base
  "https://drive.google.com/file/d/1FIntmzKoAJiC1-2SuVg_XymcvlG3-pJf/view?usp=sharing",  // 2  TP1-1 Hiérarchie fichiers Linux
  "https://drive.google.com/file/d/1GgSvxyb8q3g1c2LcGc-3siuTcBfb1dbd/view?usp=sharing",  // 3  TP2 Configuration Grub2
  "https://drive.google.com/file/d/1MvcwZptUfpLYh_mI2hhMheNAyKcKwpUy/view?usp=sharing",  // 4  TP3 cibles-services-journalctl
  "https://drive.google.com/file/d/1QdhSSNTUI6awVJoSf6gaqBKk6YQQocDm/view?usp=sharing",  // 5  TP4 Gestion des paquetages
  "https://drive.google.com/file/d/1Rz6wPl2XgCzZvqErjEJigPe7_M60EMb5/view?usp=sharing",  // 6  TP5 Intégration dans les réseaux
  "https://drive.google.com/file/d/1SH2qdHQHg5stGBLvTY54dnRbkzJFmXUs/view?usp=sharing",  // 7  TP6 Gestion utilisateurs et groupes
  "https://drive.google.com/file/d/1UQFWTUauoY7SFzmNimoanOgwMrrcdHk_/view?usp=sharing",  // 8  TP7 Gestion des disques
  "https://drive.google.com/file/d/1VBBWqkgkBqZGmLK5LFw0zRaEc9QqkBBZ/view?usp=sharing",  // 9  TP8 Volumes Logiques LVM
  "https://drive.google.com/file/d/1XAizkDQm_Cc5uRpnJFrjuuNwiq47P9k-/view?usp=sharing",  // 10 TP9 Système RAID
  "https://drive.google.com/file/d/1YTPF93RWMaU5K45rMCQ6FopG8UJTt8N6/view?usp=sharing",  // 11 cours chap4 Gestion paquetages
  "https://drive.google.com/file/d/1_uC_hAZn2Q5aCQy4TwL7VkOt6PFdKIBE/view?usp=sharing",  // 12 cours chap5 Intégration réseaux
  "https://drive.google.com/file/d/1blMdydAPhusiEv5KLjFky55PrafjN9cn/view?usp=sharing",  // 13 cours chap6 Gestion utilisateurs
  "https://drive.google.com/file/d/1f2N23j3kIz6T4ufsFgITjM78f0H5sNw5/view?usp=sharing",  // 14 cours chap7 Gestion disques
  "https://drive.google.com/file/d/1hNztIDm2QLqpBV1Iz-9Vfr7h0nX95Yct/view?usp=sharing",  // 15 cours chap7_2 Gestion espace
  "https://drive.google.com/file/d/1kn0Xjmph20eTyM-NqW4uT7dNfzwDsSYU/view?usp=sharing",  // 16 cours chap7_3 Systèmes RAID
  "https://drive.google.com/file/d/1nrYM8l9rIZy1mWiD0HdC6Ap9iH9zVsSR/view?usp=sharing",  // 17 cours chap1_2_3 Introduction Linux
  "https://drive.google.com/file/d/1pb87-dtaJ2sDnvdW2Nrt8B-UtT3bA9ve/view?usp=sharing",  // 18 exam-unix-4iir-2025
  // Note : 2 liens restants (tyibspo, xc_R) = fichiers supplémentaires non dans la liste initiale
];

// --- Analyse de données (11 fichiers) ---
const ADD = [
  "https://drive.google.com/file/d/12efZgEdW0uG6TMTkjDFwxEh6cejPSq8q/view?usp=sharing",  // 0  ADD_Qst_de_Cours
  "https://drive.google.com/file/d/13Crv84HFL1FAA1VFGb820Kn9R3KIcF_Z/view?usp=sharing",  // 1  Chap1 Manipulation formats données
  "https://drive.google.com/file/d/14dur9BpFWiG2y-E-Xm5pOkh__XnrBWP4/view?usp=sharing",  // 2  TP1
  "https://drive.google.com/file/d/16LL9WopTX7OMnlut328XIagO5b8U9itp/view?usp=sharing",  // 3  TP2
  "https://drive.google.com/file/d/17sre2glWUyF-hlb95XhlwMr3BG_x8u5o/view?usp=sharing",  // 4  chap2 Nettoyage et prétraitement
  "https://drive.google.com/file/d/18vFgfwSFbaDSisWeP-TdoeUaBUGoi-Y6/view?usp=sharing",  // 5  chap5 Tests d'hypothèses
  "https://drive.google.com/file/d/1B09l1o-nxNRJ9ffyXBnkw90Kzu0fCjPu/view?usp=sharing",  // 6  chap6 ACP (version 1)
  "https://drive.google.com/file/d/1CkYKOWZIazXt3K-9c1fANJgsZwPSwjNX/view?usp=sharing",  // 7  chap6 ACP (version 2)
  "https://drive.google.com/file/d/1G8ufomf8psftir-Tun4jdXDRPUUxXiXD/view?usp=sharing",  // 8  chap6 Relation entre variables
  "https://drive.google.com/file/d/1GG_CrM1oA8sYUSSzoAG6qczM9zunT_hc/view?usp=sharing",  // 9  data_vis Visualisation des données
  "https://drive.google.com/file/d/1GgA0fClJDqzOWZTi7FAVM4AwVHcKg1-S/view?usp=sharing",  // 10 ex_rev Exercice de révision
];

// --- Développement Mobile Android (11 fichiers) ---
const MOB = [
  "https://drive.google.com/file/d/1LgMx_uWZJIpD9_AqV70Xyidx4xMvR9Yb/view?usp=sharing",  // 0  Examen Dev Mobile 2025
  "https://drive.google.com/file/d/1NSoXxRyMiaqY1NYddQAC9FFPnUCL69qf/view?usp=sharing",  // 1  Exercice RecyclerView avec solutions
  "https://drive.google.com/file/d/1W1p_HCyy1UffxOlYe_chLyPXI9yvX3ds/view?usp=sharing",  // 2  chapitre1 Introduction Android
  "https://drive.google.com/file/d/1b93PdYwba8amyvoSMop2Hffizoearfwt/view?usp=sharing",  // 3  chapitre2 Application Android
  "https://drive.google.com/file/d/1qYGGeu-Bk-ka47AMip9UdaW77J-LQ-LP/view?usp=sharing",  // 4  chapitre3 Interface Utilisateur
  "https://drive.google.com/file/d/1vYTHEulNmwyyC8FsOeyp5fQYbmfKWJRG/view?usp=sharing",  // 5  chapitre4 Persistance des données
  "https://drive.google.com/file/d/1w-yYM_Y_8iO-4AjRJKW2IIhJzTlmHBMS/view?usp=sharing",  // 6  chapitre5 Communication Réseau (Retrofit)
  "https://drive.google.com/file/d/1xZ7r37wzvWdrxsuFpXLLbQOSBMRozWvM/view?usp=sharing",  // 7  chapitre6 Intents et Communication
  "https://drive.google.com/file/d/11hH0fXWoOcXffABl18Zs1_TNRu41lyN3/view?usp=sharing",  // 8  chapitre7 API Android
  "https://drive.google.com/file/d/12NxL0xx2RwlpNP7HWmQdIdLMkIFdU442/view?usp=sharing",  // 9  chapitre8 Threads sous Android
  "https://drive.google.com/file/d/15iZSVRBUGUrvj4at5Tn7TyMgXQXGheyK/view?usp=sharing",  // 10 chapitre9 Déployer et Sécuriser
];

// --- IA & Machine Learning (16 fichiers) ---
const IAML = [
  "https://drive.google.com/file/d/1EKsWodMuKOhUg-BNoq0etWfxqCisHWu4/view?usp=sharing",  // 0  Chapitre2 IA Fondements (pptx)
  "https://drive.google.com/file/d/1FPeBf9eeE7t68UKVi4xGqQA2hWBPOy7e/view?usp=sharing",  // 1  Chapter_4 Prétraitement et répartition
  "https://drive.google.com/file/d/1J2-euVslyoBvL0OVVUGymzWJFTOjU7o-/view?usp=sharing",  // 2  Chapter_5 Sélection de modèles
  "https://drive.google.com/file/d/1PT08Hb-aZGLgggDgJil7I_Zv8qk0toah/view?usp=sharing",  // 3  Chapter_6 Ensemble Learning
  "https://drive.google.com/file/d/1UdehszIMekykZPgfwgmscZf__ZPXa2bz/view?usp=sharing",  // 4  Ethique de l'IA (pptx)
  "https://drive.google.com/file/d/1d-RDRY4UlGPaE2RCaDiz3htLQQlX357z/view?usp=sharing",  // 5  Introduction IA part 1
  "https://drive.google.com/file/d/1wjqt8LRu9MssjgcoLc5OqYAXW5MN2waU/view?usp=sharing",  // 6  ML chapitre 2 Part 1
  "https://drive.google.com/file/d/1yFaFSrztRY_6tyzcadSwFK_QBAHwWJVs/view?usp=sharing",  // 7  ML chapitre 2 TD KNN
  "https://drive.google.com/file/d/1-aYaQp9Udy_AwmmbXCQtF9-GPDD19ACB/view?usp=sharing",  // 8  PART 2 Intro IA algorithmes
  "https://drive.google.com/file/d/1340G8JHH-iKYiI2Ko2fjFbz_C47r0kPs/view?usp=sharing",  // 9  Presentation IntroIA Part1 (pptx)
  "https://drive.google.com/file/d/155TEiufyalHvkbUhVknrGHA7ftiD8XrK/view?usp=sharing",  // 10 Presentation IntroIA Part2 (pptx)
  "https://drive.google.com/file/d/193EStL5QRTki5P5llGZ1wrn8Sg9mP1Dq/view?usp=sharing",  // 11 TP SVM
  "https://drive.google.com/file/d/1BNDwRGRqY9goBz2njGM-A4LcCBpzGJWD/view?usp=sharing",  // 12 Cours SVM Final
  "https://drive.google.com/file/d/1De4l0pc8MNvbC69hEpjpO6zPOmPlAJhM/view?usp=sharing",  // 13 TP1 Régression Polynomiale
  "https://drive.google.com/file/d/1HhiugofiqswJTdt3ER4tNeYn9v7GEkj7/view?usp=sharing",  // 14 TP4_5 Nettoyage et validation croisée
  "https://drive.google.com/file/d/1kwTuxOIkiBuSiVpicqxlplaYKmA8KtRHw/view?usp=sharing",  // 15 Tp0 Régression Linéaire Multiple
];

// --- Java / POO 3 (15 fichiers) ---
const JAVA = [
  "https://drive.google.com/file/d/10HA4F3YEqtH7QLV0AvfMNWVOhNOc9FMq/view?usp=sharing",  // 0  TP4
  "https://drive.google.com/file/d/19JhMLHTEp8anQw2YdVuqclbRxL4dAvC3/view?usp=sharing",  // 1  TP5
  "https://docs.google.com/presentation/d/1CLkIlOKKn-I6BqcZUumuMXh2l-vuxlnU/edit?usp=sharing",  // 2  TP6
  "https://docs.google.com/presentation/d/1FoA6VYfzLbI61qYuR9OZJHWuXc1E0o2M/edit?usp=sharing",  // 3  TP7
  "https://drive.google.com/file/d/1Pok8ODJAkjhzi7RKfSJ6XUtCoGoVhzIL/view?usp=sharing",  // 4  TP8
  "https://drive.google.com/file/d/1R9fx4wRDI6Kd3R_SEBmabFLR44gRTX5T/view?usp=sharing",  // 5  chapitre3 Part1 POO Classes/Objets
  "https://drive.google.com/file/d/1T-OFzVQunXnYFbPzOB-IPgLbJShMRVrL/view?usp=sharing",  // 6  chapitre3 Part2
  "https://drive.google.com/file/d/1UhvPDyg-KhLtJI_qpnj2-dOlVJ1mRLmX/view?usp=sharing",  // 7  chapitre3 Part3
  "https://docs.google.com/presentation/d/1bjGp1AE7yUiO0O8snqUlsybvSpvU4XGh/edit?usp=sharing",  // 8  chapitre4 Expressions Lambda
  "https://drive.google.com/file/d/1hWBNHZ07sEZoj3QJlmlW3a4mejtBcx5Z/view?usp=sharing",  // 9  chapitre5 Collections et Streams
  "https://docs.google.com/presentation/d/1m9Pge-a09293Hs5l5SKGvikGZjGHLATe/edit?usp=sharing",  // 10 chapitre6 Gestion des Exceptions
  "https://drive.google.com/file/d/1oc2j5A2BqTQnIpLwT6VOut50934nQsCp/view?usp=sharing",  // 11 chapitre7 Les Fichiers
  "https://drive.google.com/file/d/1vc3BXypr0unvmPDDmX1deB_hUbhPb4Ag/view?usp=sharing",  // 12 chapitre8 Interfaces Graphiques Swing
  "https://drive.google.com/file/d/1xSzlx73vxP6LtzhJ1QrqzYqzuiF5xIkl/view?usp=sharing",  // 13 chapitre9 JDBC Connexion BDD
  "https://drive.google.com/file/d/1xWvVQ-s3_4G9mzWB7i5ciU__WjMoFY1p/view?usp=sharing",  // 14 multithreading
  // 15 xey7fo = fichier supplémentaire
];

// --- NoSQL — Cassandra (3 fichiers) ---
const CASS = [
  "https://drive.google.com/file/d/10SfMbFPT916TxUSS_1FDc0f0PuU_bHw9/view?usp=sharing",  // 0  Installation Cassandra
  "https://drive.google.com/file/d/1A6VQ5goWsKdFbxZjUwMDyKCM6svS15zU/view?usp=sharing",  // 1  Cours NoSQL Cassandra
  "https://drive.google.com/file/d/1AGbcvB-4tGCgcjx7VawnVg2JE8kHcttf/view?usp=sharing",  // 2  TP Cassandra
];

// --- NoSQL — MongoDB (4 fichiers) ---
const MONGO = [
  "https://drive.google.com/file/d/1C1FqR7rvM1vqfemGrqnMh2-57IuQXddC/view?usp=sharing",  // 0  Les règles d'Or de MongoDB
  "https://drive.google.com/file/d/1PC1Oe37_8mI3zJW5rcGWjo5cRetgSSTN/view?usp=sharing",  // 1  Cours NoSQL MongoDB 1
  "https://drive.google.com/file/d/1QW4F8E67_wAygHvpgjTfwXdQyE0Hak9b/view?usp=sharing",  // 2  Cours NoSQL MongoDB 2
  "https://drive.google.com/file/d/1QWGe48MTcaFbWMaseKA91U-d7V_S7PFi/view?usp=sharing",  // 3  TP MongoDB
];

// --- NoSQL — Neo4J (2 fichiers) ---
const NEO4J = [
  "https://drive.google.com/file/d/1U2_UCyHANGbE79Tas-3HOe_lXKTBOtI3/view?usp=sharing",  // 0  TP BDD NBA Cypher
  "https://drive.google.com/file/d/1_3QrV2vxYJS3xvvlD1X2GwtfX5bPg0EE/view?usp=sharing",  // 1  Cours NoSQL Neo4J
];

// --- NoSQL — Redis (3 fichiers) ---
const REDIS = [
  "https://drive.google.com/file/d/1_ekI8KQNMHCGhr-3dwVtVGaQHxcw1GSa/view?usp=sharing",  // 0  Cours NoSQL Redis
  "https://drive.google.com/file/d/1jbG9uLSGXjsjyCbSc2lg6louOfOs-6SI/view?usp=sharing",  // 1  TP1 Redis Installation
  "https://drive.google.com/file/d/1m4fscS60zNTM3umh04bcUaX5msvyepSy/view?usp=sharing",  // 2  TP2 Redis Authentification et Sessions
];

// --- Oracle I (17 fichiers) ---
const ORA = [
  "https://drive.google.com/file/d/1pFT-aCWEvqS-jddblkW7FILVBHRtjd-g/view?usp=sharing",  // 0  Administration Oracle chapitres 1-9
  "https://drive.google.com/file/d/1raZtifqhanJxFKdM9P6BDX3Z0G0EkYmZ/view?usp=sharing",  // 1  Examen 2025
  "https://drive.google.com/file/d/1ruXR6xYPTDSh4P7OYE8CZUepWPVQBQpw/view?usp=sharing",  // 2  Série de révision
  "https://drive.google.com/file/d/1-uyUvp7uf49pxfwza_y7ne_81-gXSpN5/view?usp=sharing",  // 3  TP4 Compte rendu
  "https://drive.google.com/file/d/10EXlZhR4rXt5WdwhgVhlIQ3sTXElLpb8/view?usp=sharing",  // 4  TP5 Fichiers journal
  "https://docs.google.com/document/d/12X2zW_lRFmCbtge1bjMM_FZlgY22AYZg/edit?usp=sharing",  // 5  chapitre1 Introduction Oracle
  "https://drive.google.com/file/d/13FgWgqVpfkQYoEh_W_1eyuTtiLbXiez2/view?usp=sharing",  // 6  chapitre2 Formatage des données
  "https://drive.google.com/file/d/140g7kJwrvKvBn87SbXPK1b_JwDz74e6b/view?usp=sharing",  // 7  chapitre3 Architecture
  "https://docs.google.com/document/d/15RRXdYVU3oYllrTwKR2KDqp0DiPcNoxu/edit?usp=sharing",  // 8  chapitre3 Complément architecture 19C
  "https://drive.google.com/file/d/17OR-Qs3ZFfTXPh-D9oLlW0SSjX8DtKl4/view?usp=sharing",  // 9  chapitre4 Instance Oracle 1
  "https://drive.google.com/file/d/1EY2K7yO1acXjaI-LR3qP2reZpqejWWgY/view?usp=sharing",  // 10 chapitre4 Instance Oracle 2 v2
  "https://drive.google.com/file/d/1JmG9fMojOPVM47CQJdKMqJgDP6X2-jYY/view?usp=sharing",  // 11 chapitre4 Instance Oracle 2
  "https://drive.google.com/file/d/1KHEbQ5FzhYkDpROV7leQ6Y26M2RfweRD/view?usp=sharing",  // 12 chapitre5 Gestion Instance et paramètres
  "https://docs.google.com/document/d/1LliG4jfYSGw4lf2o-kYZ88MyW83Qvpro/edit?usp=sharing",  // 13 chapitre6 Gestion fichiers journalisation
  "https://drive.google.com/file/d/1MmiWVFPCeqcAPnWaNXWcUChMkI8ckJzu/view?usp=sharing",  // 14 chapitre7 Archivelog
  "https://docs.google.com/document/d/1TZhc_pE9o6aN5ejKK-iiAc8XBD6PK1a-/edit?usp=sharing",  // 15 chapitre8 Fichiers de contrôle
  "https://docs.google.com/document/d/1XxppljF4yjTRwF7S3Ie8O4Mw2nuLpnLK/edit?usp=sharing",  // 16 chapitre9 Tablespaces
];

// --- Recherche Opérationnelle (8 fichiers) ---
const RO = [
  "https://drive.google.com/file/d/11aVmYqDPmbvF5YQ4TYsfHHDRtgbE51sE/view?usp=sharing",  // 0  Chapitre2 Plus court chemin (Dijkstra)
  "https://drive.google.com/file/d/199x4gvQOg69H_JG6-ebsrk-aVoy-ZRUW/view?usp=sharing",  // 1  Problème de transport
  "https://drive.google.com/file/d/1WtKtZwo8z-mDN6u74slE1W4pTvz-LnwW/view?usp=sharing",  // 2  Cours RO complet
  "https://drive.google.com/file/d/1auyexb33l3Aed-arEna6qrI0pmmHTVAX/view?usp=sharing",  // 3  Chapitre5 Flots dans les réseaux
  "https://drive.google.com/file/d/1lOatfBpPyxSUbT7bHj0v7m8CCzJMNuI9/view?usp=sharing",  // 4  Chapitre3 Arbre couvrant minimal
  "https://drive.google.com/file/d/1o2TAcs-xXCtaieEG-9Q2qvHGH4A0BUNg/view?usp=sharing",  // 5  TD1 Théorie des graphes
  "https://drive.google.com/file/d/1vsPL8KdCCZbo9DPGxh5Jf5Moc2xWVjeL/view?usp=sharing",  // 6  TD Théorie des graphes P1
  "https://drive.google.com/file/d/1xnTpCf30qYGc84PzQtVJcQeij6I81LRt/view?usp=sharing",  // 7  TD Théorie des graphes P2
];

// --- Virtualisation & Cloud (7 fichiers) ---
const VIRT = [
  "https://drive.google.com/file/d/1-36SKYcRtbFnTNfXr2NFjlmf87JPupqa/view?usp=sharing",  // 0  Cloud Computing part 3
  "https://drive.google.com/file/d/175st2E1pfZ7RDSFxhEsPPsBj9MeJ9LdN/view?usp=sharing",  // 1  Cloud Computing part 4 Types virtualisation
  "https://drive.google.com/file/d/1FQl-lnu1TCI98m9U28cYT_52s6HZKTIn/view?usp=sharing",  // 2  Introduction Cloud Computing part 2
  "https://drive.google.com/file/d/1cDwRgaQcbWFcG98_fafZjOAi8mh7yalt/view?usp=sharing",  // 3  Introduction Cloud Computing part 1
  "https://drive.google.com/file/d/1l5fFMieWFzMcgV7aewbyEFDhLfCrL_cx/view?usp=sharing",  // 4  TD Questions virtualisation et cloud
  "https://drive.google.com/file/d/1m6bJIS9xtmiIygxh1VwyX_us_bPOmDaj/view?usp=sharing",  // 5  Cours Virtualisation Complet
  "https://drive.google.com/file/d/1vhbOC0VfTckTcjOkg-nJGA9QB8uXIUg5/view?usp=sharing",  // 6  Réponses aux questions TD
];

// --- .NET / ASP.NET Core (21 fichiers) ---
const NET = [
  "https://drive.google.com/file/d/19VSBHnm2s8CiUjIcBVeqv1fQPdnB3YBw/view?usp=sharing",  // 0  Cours ASP.NET Core Identity
  "https://drive.google.com/file/d/1btPtrYfoN3qHZRAl2hlbq5H344zZijE_/view?usp=sharing",  // 1  Cours ASP.NET Core Migration
  "https://drive.google.com/file/d/1cf6PCoh4K58Ck_cKav2PR5DLAllxeuDB/view?usp=sharing",  // 2  Cours C# POO
  "https://drive.google.com/file/d/1FaW2Zyz9_0wgyH2x0-sTLBm_QwUjh-2I/view?usp=sharing",  // 3  Cours LINQ
  "https://drive.google.com/file/d/1ZeDYubTHwapfewmw2CEP0CMi3FnWTdic/view?usp=sharing",  // 4  Cours ADO.NET Entity Framework
  "https://drive.google.com/file/d/1tT518_tTzZhUj5tNic6KHkTep8Mwh55s/view?usp=sharing",  // 5  Cours ASP.NET MVC part 1
  "https://drive.google.com/file/d/1yatsofXcfiUqfn0AA5U8948oi_l9W6Vt/view?usp=sharing",  // 6  Cours ASP.NET MVC part 2
  "https://drive.google.com/file/d/1KaMwPJbwePoWHhfU_0ZKyNKZwnZ982H0/view?usp=sharing",  // 7  Examen DOT NET 2025
  "https://drive.google.com/file/d/1OxMi84k66neSGWb9g2yCqNH7l3EPmj49/view?usp=sharing",  // 8  Préparation Examen DOT NET 2026
  "https://drive.google.com/file/d/1KgJSHwIDS2b5q-MnyCKtlRtnbdl_ssXN/view?usp=sharing",  // 9  TP ch6 (ML Bagging/Random Forest — dans .NET zip par erreur)
  "https://drive.google.com/file/d/1flqlEAZN7JWPRF6pA-Q1NKpP7L25I77i/view?usp=sharing",  // 10 TP_10 Code First & Migration
  "https://drive.google.com/file/d/1z5j7cgRmKs7OGgaxX9oDIIOls477qRK7/view?usp=sharing",  // 11 TP_11 Authentification & Autorisation
  "https://drive.google.com/file/d/10a-D38GSGnZRzlUwyxL93TlMdZo2qwOi/view?usp=sharing",  // 12 TP_12 LINQ to Entities
  "https://drive.google.com/file/d/11UC8Q4fyS0R7YLSGg71gI1T4PNIC-L2A/view?usp=sharing",  // 13 TP_13 LINQ to Entities suite
  "https://drive.google.com/file/d/1YPxSTZbA3r4DdgIxA6mOKC_UAvgsyzRO/view?usp=sharing",  // 14 TP_2 C# POO exercices
  "https://docs.google.com/document/d/1YQK4Ts7wL0A8cSvt6_5lLKpNcG69RfSu/edit?usp=sharing",  // 15 TP_3 ASP.NET installation
  "https://drive.google.com/file/d/1a6ucqUgwc3dzDRqTuzKvbQt93kAqqbuU/view?usp=sharing",  // 16 TP_4 ASP.NET MVC Contrôleur/Vue
  "https://docs.google.com/document/d/1bzURWss6vA3C32nlEV2IHo_syMf3Zb5x/edit?usp=sharing",  // 17 TP_5 Entity Framework Database First
  "https://docs.google.com/document/d/1reN93CXq0kIO_frR1EhTm-k-to0XpPCq/edit?usp=sharing",  // 18 TP_6 Relations entre entités EF
  "https://drive.google.com/file/d/1UakgkFk6Lg58_LYZOLGIdYWhYZ5KKWAj/view?usp=sharing",  // 19 TP_7 Model First EF
  // TP_9 = lien manquant dans le batch
];

// --- Communication Professionnelle 3 (1 fichier) ---
const COM = [
  "https://drive.google.com/file/d/1gXarInFdQmN5clIzhVcYjs8ltL_Z8ytK/view?usp=sharing", // 0 Cours_Commun_Complet
];

// ============================================================
// FONCTION PRINCIPALE
// ============================================================
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB\n");

    // Récupérer la filière IIR existante
    const filiere = await Filiere.findOne({ code_filiere: "IIR" });
    if (!filiere) {
      console.error("❌ Filière IIR introuvable. Lance d'abord seed.js");
      return;
    }
    console.log(`✅ Filière IIR trouvée : ${filiere._id}\n`);

    // Supprimer les modules 4A S1 existants si relancé
    const existing4A = await Module.find({
      id_filiere: filiere._id,
      nom_module: { $regex: "4A" }
    });
    for (const mod of existing4A) {
      const matieres = await Matiere.find({ moduleId: mod._id });
      for (const mat of matieres) {
        await Ressource.deleteMany({ matiereId: mat._id });
      }
      await Matiere.deleteMany({ moduleId: mod._id });
    }
    await Module.deleteMany({ id_filiere: filiere._id, nom_module: { $regex: "4A" } });
    console.log("🗑️  Modules 4A existants supprimés\n");

    // ── Données 4ème année S1 ──────────────────────────────────
    const data = [

      // ══════════════════════════════════════════════
      // INFORMATIQUE
      // ══════════════════════════════════════════════
      {
        nom_module: "Informatique 4A S1",
        semestre: "S1",
        matieres: [

          {
            nom: "Administration Unix/Linux",
            difficultes: [
              "Installation et configuration de Linux RHEL",
              "Hiérarchie des fichiers (FHS)",
              "Gestion du bootloader GRUB2",
              "Gestion des services avec Systemd",
              "Gestion des paquetages (rpm, dnf)",
              "Configuration réseau (nmcli, nmtui)",
              "Gestion des utilisateurs et groupes",
              "Partitionnement et gestion des disques",
              "Volumes Logiques LVM",
              "Systèmes RAID logiciel",
            ],
            ressources: [
              { titre: "Procédure d'installation d'un serveur Linux",        type: "document", lien: UNIX[0],  desc: "Guide complet d'installation d'un serveur Linux — niveau examen" },
              { titre: "TP1 — Installation et commandes de base (RHEL 9)",   type: "TP/TD",    lien: UNIX[1],  desc: "TP d'introduction à l'administration Linux RHEL 9, commandes essentielles" },
              { titre: "TP1 — Hiérarchie des fichiers Linux (FHS)",          type: "TP/TD",    lien: UNIX[2],  desc: "TP sur la structure et le rôle de chaque répertoire Linux" },
              { titre: "TP2 — Configuration du bootloader GRUB2",            type: "TP/TD",    lien: UNIX[3],  desc: "TP sur la configuration et manipulation de GRUB2" },
              { titre: "TP3 — Cibles, services et journalctl (Systemd)",     type: "TP/TD",    lien: UNIX[4],  desc: "TP sur les cibles systemd, gestion des services et journalisation" },
              { titre: "TP4 — Gestion des paquetages (rpm, dnf)",            type: "TP/TD",    lien: UNIX[5],  desc: "TP sur la gestion des paquetages sous Linux RHEL 9" },
              { titre: "TP5 — Intégration dans les réseaux (nmcli, nmtui)",  type: "TP/TD",    lien: UNIX[6],  desc: "TP sur la configuration et gestion des interfaces réseau Linux" },
              { titre: "TP6 — Gestion des utilisateurs et groupes",          type: "TP/TD",    lien: UNIX[7],  desc: "TP sur la création et configuration de comptes utilisateurs sous RHEL 9" },
              { titre: "TP7 — Gestion des disques et partitions",            type: "TP/TD",    lien: UNIX[8],  desc: "TP sur le partitionnement et les systèmes de fichiers sous Linux" },
              { titre: "TP8 — Volumes Logiques LVM",                         type: "TP/TD",    lien: UNIX[9],  desc: "TP sur la gestion du cycle de vie des volumes logiques LVM" },
              { titre: "TP9 — Système RAID logiciel",                        type: "TP/TD",    lien: UNIX[10], desc: "TP sur l'installation, configuration et surveillance des volumes RAID" },
              { titre: "Cours — Chapitre 4 : Gestion des paquetages",        type: "document", lien: UNIX[11], desc: "Cours Administration GNU-Linux, chapitre gestion des paquetages (Pr. Roudani)" },
              { titre: "Cours — Chapitre 5 : Intégration dans les réseaux",  type: "document", lien: UNIX[12], desc: "Cours Administration GNU-Linux, chapitre réseaux" },
              { titre: "Cours — Chapitre 6 : Gestion des utilisateurs",      type: "document", lien: UNIX[13], desc: "Cours Administration GNU-Linux, chapitre utilisateurs et groupes" },
              { titre: "Cours — Chapitre 7 : Gestion des disques",           type: "document", lien: UNIX[14], desc: "Cours Administration GNU-Linux, chapitre gestion des disques" },
              { titre: "Cours — Chapitre 7-2 : Gestion de l'espace",        type: "document", lien: UNIX[15], desc: "Cours Administration GNU-Linux, gestion avancée de l'espace disque" },
              { titre: "Cours — Chapitre 7-3 : Systèmes RAID",              type: "document", lien: UNIX[16], desc: "Cours Administration GNU-Linux, chapitre RAID" },
              { titre: "Cours — Chapitres 1, 2, 3 : Introduction Linux",     type: "document", lien: UNIX[17], desc: "Cours Administration GNU-Linux, introduction aux systèmes Linux (Pr. Roudani)" },
              { titre: "Examen Administration Unix 4IIR 2025",               type: "document", lien: UNIX[18], desc: "Annale d'examen Administration Unix 4IIR — février 2025" },
            ],
          },

          {
            nom: "Java Avancé (POO 3)",
            difficultes: [
              "Classes, objets, héritage et polymorphisme en Java",
              "Expressions Lambda et interfaces fonctionnelles",
              "Collections et Streams Java",
              "Gestion des exceptions",
              "Manipulation de fichiers (flux texte et binaires)",
              "Interfaces graphiques avec Swing",
              "Connexion base de données avec JDBC",
              "Multithreading et programmation concurrente",
            ],
            ressources: [
              { titre: "Chapitre 3 Part 1 — POO : Classes et Objets",        type: "document", lien: JAVA[5],  desc: "Cours POO 3 Java : concepts fondamentaux, classes, objets, état et comportement" },
              { titre: "Chapitre 3 Part 2 — POO avancée",                    type: "document", lien: JAVA[6],  desc: "Cours POO 3 Java : suite des concepts orientés objet" },
              { titre: "Chapitre 3 Part 3 — POO avancée (fin)",              type: "document", lien: JAVA[7],  desc: "Cours POO 3 Java : fin du chapitre classes et objets" },
              { titre: "Chapitre 4 — Expressions Lambda",                     type: "document", lien: JAVA[8],  desc: "Cours Java : expressions lambda et classes anonymes" },
              { titre: "Chapitre 5 — Collections et Streams",                 type: "document", lien: JAVA[9],  desc: "Cours Java : structures de données, collections et API Stream" },
              { titre: "Chapitre 6 — Gestion des Exceptions",                 type: "document", lien: JAVA[10], desc: "Cours Java : définition, lancement et capture des exceptions" },
              { titre: "Chapitre 7 — Manipulation de Fichiers",               type: "document", lien: JAVA[11], desc: "Cours Java : flux texte, fichiers binaires et fichiers d'enregistrement" },
              { titre: "Chapitre 8 — Interfaces Graphiques avec Swing",       type: "document", lien: JAVA[12], desc: "Cours Java : GUI avec Swing, fenêtres, composants et événements" },
              { titre: "Chapitre 9 — Connexion BDD avec JDBC",                type: "document", lien: JAVA[13], desc: "Cours Java : connexion à MySQL avec JDBC, CRUD via PhpMyAdmin" },
              { titre: "Cours — Multithreading et Programmation Concurrente", type: "document", lien: JAVA[14], desc: "Cours programmation avancée Java : threads, parallélisme, états d'un thread" },
              { titre: "TP4 — Java POO",                                      type: "TP/TD",    lien: JAVA[0],  desc: "Travaux pratiques POO Java — TP n°4" },
              { titre: "TP5 — Java POO",                                      type: "TP/TD",    lien: JAVA[1],  desc: "Travaux pratiques POO Java — TP n°5" },
              { titre: "TP6 — Java POO",                                      type: "TP/TD",    lien: JAVA[2],  desc: "Travaux pratiques POO Java — TP n°6" },
              { titre: "TP7 — Java POO",                                      type: "TP/TD",    lien: JAVA[3],  desc: "Travaux pratiques POO Java — TP n°7" },
              { titre: "TP8 — Java POO",                                      type: "TP/TD",    lien: JAVA[4],  desc: "Travaux pratiques POO Java — TP n°8" },
            ],
          },

          {
            nom: "Développement .NET (ASP.NET Core)",
            difficultes: [
              "Programmation orientée objet en C#",
              "ASP.NET MVC : contrôleurs, vues, routage",
              "Entity Framework : Database First, Code First, Model First",
              "LINQ to Entities",
              "ADO.NET et accès aux données",
              "Authentification et autorisation (Identity)",
              "Migration et Code First Approach",
            ],
            ressources: [
              { titre: "Cours — C# : Programmation Orientée Objet",           type: "document", lien: NET[2],  desc: "Cours C# POO — Mme. Fatima-Ezzahra AIT BENNACER (2025-2026)" },
              { titre: "Cours — ASP.NET MVC (Part 1)",                        type: "document", lien: NET[5],  desc: "Cours ASP.NET MVC : architecture et fondamentaux" },
              { titre: "Cours — ASP.NET MVC (Part 2)",                        type: "document", lien: NET[6],  desc: "Cours ASP.NET MVC : approfondissement" },
              { titre: "Cours — ADO.NET Entity Framework",                    type: "document", lien: NET[4],  desc: "Cours ADO.NET et Entity Framework" },
              { titre: "Cours — LINQ to Entities",                            type: "document", lien: NET[3],  desc: "Cours LINQ to Entities" },
              { titre: "Cours — ASP.NET Core Migration (Code First)",         type: "document", lien: NET[1],  desc: "Cours ASP.NET Core : approche Code First et migrations" },
              { titre: "Cours — ASP.NET Core Identity",                       type: "document", lien: NET[0],  desc: "Cours ASP.NET Core Identity : authentification et autorisation" },
              { titre: "TP2 — C# POO : exercices classes",                   type: "TP/TD",    lien: NET[14], desc: "TP C# POO : exercices sur les classes et objets" },
              { titre: "TP3 — ASP.NET : installation et environnement",       type: "TP/TD",    lien: NET[15], desc: "TP ASP.NET : préparation de l'environnement de développement" },
              { titre: "TP4 — ASP.NET MVC : Contrôleur, Vue, Routage",       type: "TP/TD",    lien: NET[16], desc: "TP ASP.NET Core MVC : création d'une première application web" },
              { titre: "TP5 — Entity Framework Database First",               type: "TP/TD",    lien: NET[17], desc: "TP Entity Framework : approche Database First" },
              { titre: "TP6 — Relations entre entités (EF Database First)",   type: "TP/TD",    lien: NET[18], desc: "TP Entity Framework : gestion des relations entre entités" },
              { titre: "TP7 — Model First avec Entity Framework",             type: "TP/TD",    lien: NET[19], desc: "TP Entity Framework : approche Model First, gestion des notes étudiants" },
              { titre: "TP10 — Code First & Migration (ASP.NET Core)",        type: "TP/TD",    lien: NET[10], desc: "TP ASP.NET Core : approche Code First et migration" },
              { titre: "TP11 — Authentification & Autorisation",              type: "TP/TD",    lien: NET[11], desc: "TP ASP.NET Core Identity : authentification et autorisation" },
              { titre: "TP12 — LINQ to Entities",                             type: "TP/TD",    lien: NET[12], desc: "TP LINQ to Entities" },
              { titre: "TP13 — LINQ to Entities (suite)",                     type: "TP/TD",    lien: NET[13], desc: "TP LINQ to Entities — approfondissement" },
              { titre: "Examen DOT NET 2025",                                 type: "document", lien: NET[7],  desc: "Annale d'examen DOT NET 2025" },
              { titre: "Préparation Examen DOT NET 2026",                     type: "document", lien: NET[8],  desc: "Fiche de préparation à l'examen DOT NET 2026" },
            ],
          },

          {
            nom: "Développement Mobile Android",
            difficultes: [
              "Structure d'un projet Android",
              "Conception d'interfaces utilisateur (XML, layouts)",
              "Persistance des données (SQLite, Room)",
              "Communication réseau avec Retrofit",
              "Intents et communication entre composants",
              "Utilisation des APIs Android natives",
              "Threads et gestion de la concurrence Android",
              "Déploiement et sécurisation d'une application Android",
            ],
            ressources: [
              { titre: "Chapitre 1 — Introduction au développement Android",  type: "document", lien: MOB[2],  desc: "Cours développement mobile Android — introduction à la plateforme" },
              { titre: "Chapitre 2 — Structure d'une application Android",    type: "document", lien: MOB[3],  desc: "Cours Android : architecture et composants d'une application" },
              { titre: "Chapitre 3 — Interface Utilisateur sous Android",     type: "document", lien: MOB[4],  desc: "Cours Android : conception d'interfaces graphiques et layouts XML" },
              { titre: "Chapitre 4 — Persistance des données",                type: "document", lien: MOB[5],  desc: "Cours Android : stockage local — SQLite, Room et fichiers" },
              { titre: "Chapitre 5 — Communication Réseau avec Retrofit",     type: "document", lien: MOB[6],  desc: "Cours Android : APIs REST et consommation de données avec Retrofit" },
              { titre: "Chapitre 6 — Intents et Communication entre composants", type: "document", lien: MOB[7], desc: "Cours Android : Intents explicites/implicites et communication" },
              { titre: "Chapitre 7 — APIs Android natives",                   type: "document", lien: MOB[8],  desc: "Cours Android : interaction avec les fonctionnalités natives du téléphone" },
              { titre: "Chapitre 8 — Threads sous Android",                   type: "document", lien: MOB[9],  desc: "Cours Android : programmation concurrente et réactivité de l'UI" },
              { titre: "Chapitre 9 — Déployer et Sécuriser une application",  type: "document", lien: MOB[10], desc: "Cours Android : déploiement sur Play Store et bonnes pratiques de sécurité" },
              { titre: "Exercice — RecyclerView avec solutions",               type: "TP/TD",    lien: MOB[1],  desc: "Exercice pratique RecyclerView et révision SQLite Room" },
              { titre: "Examen Développement Mobile 2025",                    type: "document", lien: MOB[0],  desc: "Annale d'examen Développement Mobile 4IIR 2024-2025" },
            ],
          },

          {
            nom: "NoSQL",
            difficultes: [
              "Différences entre SQL et NoSQL",
              "Modélisation orientée documents (MongoDB)",
              "Requêtes MongoDB (CRUD, agrégation)",
              "Bases de données colonnes (Cassandra)",
              "Bases de données graphes (Neo4J, Cypher)",
              "Bases de données clé-valeur (Redis)",
              "Choix du bon type de BDD selon le cas d'usage",
            ],
            ressources: [
              { titre: "Cours NoSQL — MongoDB (Part 1)",                       type: "document", lien: MONGO[1], desc: "Cours NoSQL MongoDB — Pr. Hasnâa CHAABI, 4IIR" },
              { titre: "Cours NoSQL — MongoDB (Part 2)",                       type: "document", lien: MONGO[2], desc: "Cours NoSQL MongoDB chapitre 2 : bases orientées documents" },
              { titre: "Les règles d'Or de MongoDB",                           type: "document", lien: MONGO[0], desc: "Guide des bonnes pratiques de conception et performance MongoDB" },
              { titre: "TP MongoDB — Gestion des profils (LinkedPro)",         type: "TP/TD",    lien: MONGO[3], desc: "TP MongoDB : CRUD complet sur une application de gestion de profils" },
              { titre: "Cours NoSQL — Cassandra",                              type: "document", lien: CASS[1],  desc: "Cours NoSQL Apache Cassandra — Pr. Hasnâa CHAABI, 4IIR" },
              { titre: "Guide Installation Cassandra (Docker)",                type: "TP/TD",    lien: CASS[0],  desc: "Guide d'installation Cassandra via Docker pour environnement étudiant" },
              { titre: "TP Cassandra — Gestion de livres (CRUD)",              type: "TP/TD",    lien: CASS[2],  desc: "TP Cassandra : opérations CRUD sur une bibliothèque" },
              { titre: "Cours NoSQL — Neo4J (graphes)",                        type: "document", lien: NEO4J[1], desc: "Cours NoSQL Neo4J : bases de données graphes — Pr. Hasnâa CHAABI" },
              { titre: "TP Neo4J — BDD NBA avec Cypher",                       type: "TP/TD",    lien: NEO4J[0], desc: "TP Neo4J : requêtes Cypher sur une base de données NBA" },
              { titre: "Cours NoSQL — Redis (clé-valeur)",                     type: "document", lien: REDIS[0], desc: "Cours NoSQL Redis — Pr. Hasnâa CHAABI, 4IIR" },
              { titre: "TP1 Redis — Structures de données et installation",    type: "TP/TD",    lien: REDIS[1], desc: "TP Redis : installation via WSL et manipulation des structures de données" },
              { titre: "TP2 Redis — Authentification et Sessions",             type: "TP/TD",    lien: REDIS[2], desc: "TP Redis : gestion de sessions et authentification avec Python" },
            ],
          },

          {
            nom: "Administration Oracle I",
            difficultes: [
              "Architecture Oracle (instance vs base de données)",
              "Démarrage et arrêt de l'instance",
              "Gestion des paramètres d'initialisation",
              "Fichiers de journalisation (redo logs)",
              "Mode Archivelog",
              "Fichiers de contrôle",
              "Gestion des tablespaces",
              "Conteneurs CDB et bases PDB",
            ],
            ressources: [
              { titre: "Cours complet — Administration Oracle (Chapitres 1-9)", type: "document", lien: ORA[0],  desc: "Cours complet Administration Oracle 1 — Pr. Zineb MCHARFI" },
              { titre: "Chapitre 1 — Introduction à Oracle",                   type: "document", lien: ORA[5],  desc: "Cours Oracle : introduction, définitions, architecture générale" },
              { titre: "Chapitre 2 — Formatage des données",                   type: "document", lien: ORA[6],  desc: "Cours Oracle : formatage et présentation des données" },
              { titre: "Chapitre 3 — Architecture Oracle",                     type: "document", lien: ORA[7],  desc: "Cours Oracle : architecture SGA, PGA, processus" },
              { titre: "Chapitre 3 — Complément Architecture 19C",             type: "document", lien: ORA[8],  desc: "Cours Oracle : complément architecture version 19C" },
              { titre: "Chapitre 4 — Instance Oracle (Part 1)",                type: "document", lien: ORA[9],  desc: "Cours Oracle : gestion de l'instance, démarrage et arrêt" },
              { titre: "Chapitre 4 — Instance Oracle (Part 2)",                type: "document", lien: ORA[11], desc: "Cours Oracle : instance Oracle approfondissement" },
              { titre: "Chapitre 5 — Fichiers et paramètres d'initialisation", type: "document", lien: ORA[12], desc: "Cours Oracle : paramètres PFILE et SPFILE" },
              { titre: "Chapitre 6 — Gestion des fichiers de journalisation",  type: "document", lien: ORA[13], desc: "Cours Oracle : redo logs, groupes et membres" },
              { titre: "Chapitre 7 — Archivelog",                              type: "document", lien: ORA[14], desc: "Cours Oracle : mode archivelog et archivage automatique" },
              { titre: "Chapitre 8 — Fichiers de contrôle",                    type: "document", lien: ORA[15], desc: "Cours Oracle : gestion et multiplexage des fichiers de contrôle" },
              { titre: "Chapitre 9 — Gestion des Tablespaces",                 type: "document", lien: ORA[16], desc: "Cours Oracle : création et gestion des tablespaces" },
              { titre: "TP4 — Paramètres d'initialisation (Compte-Rendu)",    type: "TP/TD",    lien: ORA[3],  desc: "TP Oracle : gestion des paramètres d'initialisation" },
              { titre: "TP5 — Gestion des fichiers de journalisation",         type: "TP/TD",    lien: ORA[4],  desc: "TP Oracle : manipulation des fichiers de journalisation en ligne" },
              { titre: "Série de révision — Administration Oracle 1",          type: "document", lien: ORA[2],  desc: "Questions de révision : instance, architecture, Archivelog, tablespaces" },
              { titre: "Examen Administration Oracle 2025",                    type: "document", lien: ORA[1],  desc: "Annale d'examen Administration Oracle 1 — filière IIR" },
            ],
          },

        ],
      },

      // ══════════════════════════════════════════════
      // DATA & IA
      // ══════════════════════════════════════════════
      {
        nom_module: "Data & IA 4A S1",
        semestre: "S1",
        matieres: [

          {
            nom: "Intelligence Artificielle & Machine Learning",
            difficultes: [
              "Comprendre les fondements de l'IA",
              "Algorithmes de recherche (aveugle, heuristique)",
              "Régression linéaire et polynomiale",
              "Algorithme KNN",
              "Classification avec SVM",
              "Prétraitement et nettoyage des données",
              "Sélection de modèles et validation croisée",
              "Ensemble Learning (Bagging, Random Forest)",
              "Éthique de l'IA",
            ],
            ressources: [
              { titre: "Introduction à l'IA — Part 1",                         type: "document", lien: IAML[5],  desc: "Cours introduction à l'IA : définitions, histoire — Pr. Idrissi Zouggari & El Gerari" },
              { titre: "Introduction à l'IA — Part 2 : algorithmes",           type: "document", lien: IAML[8],  desc: "Cours IA : algorithmes aveugles, heuristiques et métaheuristiques" },
              { titre: "Présentation IntroIA — Part 1 (slides)",               type: "document", lien: IAML[9],  desc: "Slides de présentation Introduction à l'IA — Part 1" },
              { titre: "Présentation IntroIA — Part 2 (slides)",               type: "document", lien: IAML[10], desc: "Slides de présentation Introduction à l'IA — Part 2" },
              { titre: "Chapitre 2 IA — Fondements (slides)",                  type: "document", lien: IAML[0],  desc: "Slides Chapitre 2 : fondements de l'IA" },
              { titre: "ML Chapitre 2 — Algorithmes supervisés (KNN, SVM)",    type: "document", lien: IAML[6],  desc: "Cours Machine Learning : classification supervisée, KNN, SVM" },
              { titre: "ML Chapitre 2 — TD KNN",                               type: "TP/TD",    lien: IAML[7],  desc: "TD Machine Learning : exercice algorithme KNN sur dataset CSV" },
              { titre: "Cours SVM — Classification Supervisée (Final)",        type: "document", lien: IAML[12], desc: "Cours complet SVM : Support Vector Machine, classification supervisée" },
              { titre: "Chapter 4 — Prétraitement et Répartition des données", type: "document", lien: IAML[1],  desc: "Cours ML : prétraitement, normalisation et split train/test" },
              { titre: "Chapter 5 — Sélection de modèles et validation croisée",type: "document", lien: IAML[2], desc: "Cours ML : cross-validation et sélection de modèles" },
              { titre: "Chapter 6 — Ensemble Learning et Hyperparamètres",     type: "document", lien: IAML[3],  desc: "Cours ML : Bagging, Random Forest, optimisation des hyperparamètres" },
              { titre: "Éthique de l'IA (slides)",                             type: "document", lien: IAML[4],  desc: "Présentation sur l'éthique de l'intelligence artificielle" },
              { titre: "TP0 — Régression Linéaire Multiple",                   type: "TP/TD",    lien: IAML[15], desc: "TP IA/ML : régression linéaire multiple, prédiction du prix d'une voiture" },
              { titre: "TP1 — Régression Polynomiale",                         type: "TP/TD",    lien: IAML[13], desc: "TP ML : régression polynomiale sur évolution des températures mondiales" },
              { titre: "TP SVM",                                               type: "TP/TD",    lien: IAML[11], desc: "TP ML : implémentation et évaluation d'un classifieur SVM" },
              { titre: "TP4-5 — Nettoyage, validation croisée (Titanic)",      type: "TP/TD",    lien: IAML[14], desc: "TP ML : nettoyage de données et validation croisée sur le dataset Titanic" },
            ],
          },

          {
            nom: "Analyse de Données",
            difficultes: [
              "Manipulation de différents formats de données",
              "Nettoyage et prétraitement des données",
              "Visualisation des données",
              "Tests d'hypothèses statistiques",
              "Analyse en Composantes Principales (ACP)",
              "Corrélation et coefficient de Pearson",
            ],
            ressources: [
              { titre: "Chapitre 1 — Manipulation de formats de données",      type: "document", lien: ADD[1],  desc: "Cours ADD : manipulation de CSV, JSON, Excel et autres formats — Pr. A. Kadiri" },
              { titre: "Chapitre 2 — Nettoyage et prétraitement des données",  type: "document", lien: ADD[4],  desc: "Cours ADD : valeurs manquantes, doublons, normalisation — Pr. A. Kadiri" },
              { titre: "Chapitre 2 — Visualisation des données",               type: "document", lien: ADD[9],  desc: "Cours ADD : graphiques, heatmaps et visualisation — Pr. A. Fadil" },
              { titre: "Chapitre 5 — Tests d'hypothèses",                      type: "document", lien: ADD[5],  desc: "Cours ADD : tests statistiques, p-value et interprétation — Pr. A. Kadiri" },
              { titre: "Chapitre 6 — ACP (version 1)",                         type: "document", lien: ADD[6],  desc: "Cours ADD : Analyse en Composantes Principales — Pr. A. Fadil" },
              { titre: "Chapitre 6 — ACP (version 2)",                         type: "document", lien: ADD[7],  desc: "Cours ADD : ACP approfondissement — Pr. A. Fadil" },
              { titre: "Chapitre 6 — Relation entre variables (Pearson)",      type: "document", lien: ADD[8],  desc: "Cours ADD : corrélation et coefficient de Pearson — Pr. A. Fadil" },
              { titre: "TP1 — Feuille d'exercices 1",                          type: "TP/TD",    lien: ADD[2],  desc: "TP Analyse de données 4IIR — exercices pratiques N°1" },
              { titre: "TP2 — Feuille d'exercices 2",                          type: "TP/TD",    lien: ADD[3],  desc: "TP Analyse de données 4IIR — exercices pratiques N°2" },
              { titre: "Questions de cours — Introduction ADD",                 type: "document", lien: ADD[0],  desc: "Questions de cours sur l'introduction à l'analyse de données" },
              { titre: "Exercice de révision",                                  type: "TP/TD",    lien: ADD[10], desc: "Exercice de révision complet — Analyse de données 4IIR" },
            ],
          },

        ],
      },

      // ══════════════════════════════════════════════
      // SYSTÈMES & INFRASTRUCTURE
      // ══════════════════════════════════════════════
      {
        nom_module: "Systèmes & Infrastructure 4A S1",
        semestre: "S1",
        matieres: [

          {
            nom: "Virtualisation & Cloud Computing",
            difficultes: [
              "Concepts de la virtualisation",
              "Types de virtualisation (serveur, réseau, stockage, bureau)",
              "Hyperviseurs de type 1 et type 2",
              "Introduction au Cloud Computing",
              "Modèles de déploiement (IaaS, PaaS, SaaS)",
              "Modèles de cloud (public, privé, hybride)",
            ],
            ressources: [
              { titre: "Introduction Cloud Computing et Virtualisation — Part 1", type: "document", lien: VIRT[3], desc: "Cours introduction Virtualisation et Cloud — Dr. El Hassani Mouhcine, 4IIR 2025-2026" },
              { titre: "Introduction Cloud Computing et Virtualisation — Part 2", type: "document", lien: VIRT[2], desc: "Cours Virtualisation et Cloud — approfondissement Part 2" },
              { titre: "Cloud Computing et Virtualisation — Part 3",              type: "document", lien: VIRT[0], desc: "Cours Cloud Computing : serveurs physiques et virtualisation" },
              { titre: "Cloud Computing et Virtualisation — Part 4 (types)",      type: "document", lien: VIRT[1], desc: "Cours Cloud Computing : les différents types de virtualisation" },
              { titre: "Cours Virtualisation Complet",                            type: "document", lien: VIRT[5], desc: "Cours complet sur la virtualisation : de l'informatique scientifique au cloud" },
              { titre: "TD — Questions Virtualisation et Cloud (révision)",       type: "TP/TD",    lien: VIRT[4], desc: "TD de révision : questions sur la virtualisation et le cloud computing" },
              { titre: "Réponses TD Virtualisation & Cloud",                      type: "document", lien: VIRT[6], desc: "Réponses aux questions du TD Virtualisation & Cloud" },
            ],
          },

        ],
      },

      // ══════════════════════════════════════════════
      // MATHÉMATIQUES & OPTIMISATION
      // ══════════════════════════════════════════════
      {
        nom_module: "Mathématiques 4A S1",
        semestre: "S1",
        matieres: [

          {
            nom: "Recherche Opérationnelle",
            difficultes: [
              "Théorie des graphes",
              "Algorithme de Dijkstra (plus court chemin)",
              "Arbre couvrant minimal",
              "Problème de transport",
              "Flots dans les réseaux (Ford-Fulkerson)",
            ],
            ressources: [
              { titre: "Cours Recherche Opérationnelle complet",               type: "document", lien: RO[2],  desc: "Cours RO — Pr. Brahim BENOUAHMANE, EMSI Rabat 2025" },
              { titre: "Chapitre 2 — Plus court chemin (Dijkstra)",            type: "document", lien: RO[0],  desc: "Cours RO : algorithme de Dijkstra et problème du plus court chemin" },
              { titre: "Chapitre 3 — Arbre couvrant minimal",                  type: "document", lien: RO[4],  desc: "Cours RO : algorithme de Kruskal et arbre couvrant minimal" },
              { titre: "Chapitre 5 — Flots dans les réseaux",                  type: "document", lien: RO[3],  desc: "Cours RO : flots maximaux et algorithme de Ford-Fulkerson" },
              { titre: "Problème de transport",                                  type: "document", lien: RO[1],  desc: "Cours RO : optimisation du transport multi-sources et destinations" },
              { titre: "TD1 — Théorie des graphes",                             type: "TP/TD",    lien: RO[5],  desc: "TD RO 4IIR : exercices sur la théorie des graphes" },
              { titre: "TD Théorie des graphes — Part 1",                       type: "TP/TD",    lien: RO[6],  desc: "TD RO : exercices théorie des graphes (partie 1)" },
              { titre: "TD Théorie des graphes — Part 2",                       type: "TP/TD",    lien: RO[7],  desc: "TD RO : exercices théorie des graphes (partie 2)" },
            ],
          },

        ],
      },

      // ══════════════════════════════════════════════
      // COMMUNICATION
      // ══════════════════════════════════════════════
      {
        nom_module: "Communication 4A S1",
        semestre: "S1",
        matieres: [
          {
            nom: "Communication Professionnelle 3",
            difficultes: [
              "Communication organisationnelle",
              "Expression écrite professionnelle",
              "Techniques de présentation orale",
              "Communication en entreprise",
            ],
            ressources: [
              { titre: "Cours Communication Professionnelle 3", type: "document", lien: COM[0], desc: "Cours Communication Professionnelle 3 — Dr. Wafaa BENHSAIN, EMSI Rabat" },
            ],
          },
        ],
      },

    ];

    // ── Insertion en DB ────────────────────────────────────────
    let totalModules = 0, totalMatieres = 0, totalRessources = 0;

    for (const modData of data) {
      const module = await Module.create({
        nom_module: modData.nom_module,
        semestre:   modData.semestre,
        id_filiere: filiere._id,
      });
      totalModules++;

      for (const matData of modData.matieres) {
        const matiere = await Matiere.create({
          nom_matiere: matData.nom,
          difficultes: matData.difficultes,
          moduleId:    module._id,
        });
        totalMatieres++;

        for (const res of matData.ressources) {
          await Ressource.create({
            titre:       res.titre,
            description: res.desc,
            lien:        res.lien,
            type:        res.type,
            filiereId:   filiere._id,
            matiereId:   matiere._id,
            niveau:      "4ème année",
          });
          totalRessources++;
        }

        console.log(`   📘 ${matData.nom} — ${matData.ressources.length} ressources`);
      }
    }

    console.log("\n========================================");
    console.log("✅ Seed 4A S1 terminé avec succès !");
    console.log(`   Modules    : ${totalModules}`);
    console.log(`   Matières   : ${totalMatieres}`);
    console.log(`   Ressources : ${totalRessources}`);
    console.log("========================================\n");

  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

seed();
