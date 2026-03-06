const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
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
    plan_travail: {
      type: String,
      required: true,
    },
    conseils_ia: {
      type: String,
      required: true,
    },
    ressources_recommandees: [
      {
        type: String,
      },
    ],
    date_generation: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);