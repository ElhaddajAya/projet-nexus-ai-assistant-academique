const mongoose = require("mongoose");

const ressourceSchema = new mongoose.Schema(
    {
        titre: { type: String, required: true },
        description: { type: String },
        lien: { type: String, required: true },
        type: { type: String, required: true }, // ex: "video", "TP/TD", "document"

        filiereId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Filiere",
            required: true
        },

        niveau: { type: String, default: "" },

        matiereId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Matiere",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ressource", ressourceSchema);