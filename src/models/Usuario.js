// models/Usuario.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Schema de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["admin", "empleado", "superadmin"], default: "admin" }
}, { timestamps: true });

// 🔹 Antes de guardar → encriptar password si fue modificado
usuarioSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Método para comparar contraseña en login
usuarioSchema.methods.compararPassword = async function(password) {
    console.log("Password DB:", this.password);
    console.log("Password input:", password);
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Usuario", usuarioSchema);