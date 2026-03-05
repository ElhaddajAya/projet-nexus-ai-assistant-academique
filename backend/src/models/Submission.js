const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        // ID de l’étudiant connecté (obligatoire)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        filiereId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Filiere",
            required: true,
        },

        semestre: { type: String, required: true, trim: true },

        niveau: { type: String, default: "" }, // optionnel
        difficultes: [{ type: String, required: true }],
        objectifs: [{ type: String, required: true }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);