const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    nom_module: {
      type: String,
      required: [true, "Le nom du module est obligatoire"],
      trim: true,
    },
    semestre: {
      type: String,
      required: [true, "Le semestre est obligatoire"],
      trim: true,
    },
    id_filiere: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Filiere",
      required: [true, "La filière est obligatoire"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);