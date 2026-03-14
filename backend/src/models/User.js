const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nom: { type: String, required: true, trim: true },
        prenom: { type: String, required: true, trim: true },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        passwordHash: { type: String, required: true },

        role: {
            type: String,
            enum: ["student", "admin"],
            required: true,
        },

        // Remplis après le premier questionnaire via PUT /api/auth/me
        // Null/vide si l'étudiant ne s'est pas encore soumis
        filiereId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Filiere",
            required: false,
            default: null,
        },

        niveau: {
            type: String,
            default: "",
        },

        // NOTE : le semestre est intentionnellement absent ici.
        // Il varie à chaque questionnaire → stocké dans Submission uniquement.
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);