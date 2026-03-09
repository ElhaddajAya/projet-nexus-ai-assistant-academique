const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Analyse globale du profil étudiant
  analyse: { type: String, required: true },

  // Plan semaine par semaine — array d'objets
  plan_travail: [{
    step: { type: Number },
    titre: { type: String },
    duree: { type: String },
    desc: { type: String },
  }],

  // Conseils — array de strings
  conseils_ia: [{ type: String }],

  // Ressources recommandées — array d'objets
  ressources_recommandees: [{
    titre: { type: String },
    lien: { type: String },
    type: { type: String },
  }],

  // Historique du chat de suivi avec Groq
  chat_history: [{
    role: { type: String, enum: ["user", "ai"], required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],

  date_generation: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Recommendation", recommendationSchema);