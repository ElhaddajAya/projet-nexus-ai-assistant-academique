const mongoose = require("mongoose");

const matiereSchema = new mongoose.Schema(
    {
        nom_matiere: { type: String, required: true, trim: true },

        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Matiere", matiereSchema);