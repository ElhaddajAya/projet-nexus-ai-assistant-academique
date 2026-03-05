const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        nom: { type: String, required: true, trim: true },
        prenom: { type: String, required: true, trim: true },

        email: { type: String, required: true, unique: true, lowercase: true, trim: true },

        passwordHash: { type: String, required: true },

        role: { type: String, enum: ["student", "admin"], required: true },

        // Champs utiles uniquement pour student 
        filiereId: { type: mongoose.Schema.Types.ObjectId, ref: "Filiere", required: false },
        semestre: { type: String, required: false, trim: true },
        niveau: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);