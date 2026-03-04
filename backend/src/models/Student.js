const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        nom: { type: String, required: true },
        prenom: { type: String, required: true },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        filiereId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Filiere",
            required: true,
        },

        semestre: {
            type: String,
            required: true,
        },

        niveau: {
            type: String,
            default: "",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);