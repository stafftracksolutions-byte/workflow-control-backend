const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Usuario = require("../src/models/Usuario");

describe("🧠 Test de conexión y usuarios base en MongoDB", () => {
  beforeAll(async () => {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/controlEmpleados";
    await mongoose.connect(mongoURI);
    console.log("📡 Conectado a MongoDB");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("🔒 Conexión con MongoDB cerrada");
  });

  test("✅ Creación y verificación de usuarios base", async () => {
    // Limpiar la colección
    await Usuario.deleteMany({});
    console.log("🗑️ Colección 'usuarios' vaciada");

    // Crear y encriptar manualmente las contraseñas
    const usuariosBase = [
      {
        nombre: "Superadmin",
        apellido: "Demo",
        correo: "superadmin@demo.com",
        password: await bcrypt.hash("Admin123*", 10),
        rol: "superadmin",
      },
      {
        nombre: "Admin",
        apellido: "Demo",
        correo: "admin@demo.com",
        password: await bcrypt.hash("Admin123*", 10),
        rol: "admin",
      },
      {
        nombre: "Empleado",
        apellido: "Demo",
        correo: "empleado@demo.com",
        password: await bcrypt.hash("Admin123*", 10),
        rol: "empleado",
      },
    ];

    // Insertar usuarios ya encriptados
    await Usuario.insertMany(usuariosBase);
    console.log("✅ Usuarios base creados correctamente");

    // Verificar cantidad
    const count = await Usuario.countDocuments();
    expect(count).toBe(3);

    // Verificar que las contraseñas estén encriptadas
    const usuarios = await Usuario.find({}, "correo password rol");
    usuarios.forEach((u) => {
      expect(u.password).not.toBe("Admin123*");
      expect(u.password.startsWith("$2b$")).toBe(true);
    });

    // Verificar correos esperados
    const correos = usuarios.map((u) => u.correo);
    expect(correos).toContain("superadmin@demo.com");
    expect(correos).toContain("admin@demo.com");
    expect(correos).toContain("empleado@demo.com");

    console.log("📋 Usuarios insertados:", usuarios);
  });
});
