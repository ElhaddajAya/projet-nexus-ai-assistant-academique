const mongoose = require("mongoose");

const ressourceSchema = new mongoose.Schema(
    {
        titre: { type: String, required: true },
        description: { type: String },
        lien: { type: String, required: true },
        type: { type: String, required: true },

        matiereId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Matiere",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ressource", ressourceSchema);