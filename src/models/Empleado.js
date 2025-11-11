const mongoose = require("mongoose");


const empleadoSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: Number, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String },
  cargo: { type: String },
  area: { type: String },
  fechaIngreso: { type: Date, default: Date.now },
  tipoContrato: { type: String },
  salario: { type: Number },
  estado: { type: String, default: "Activo" },
});

module.exports = mongoose.model("Empleado", empleadoSchema);

