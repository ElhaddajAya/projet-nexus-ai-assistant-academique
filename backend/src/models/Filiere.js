const mongoose = require("mongoose");

const filiereSchema = new mongoose.Schema(
  {
    nom_filiere: {
      type: String,
      required: [true, "Le nom de la filière est obligatoire"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Filiere", filiereSchema);