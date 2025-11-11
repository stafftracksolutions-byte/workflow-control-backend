// seeds/seedUsuarios.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Usuario = require("../src/models/Usuario");

async function seedUsuarios() {
  try {
    await connectDB();
    console.log("✅ Conectado a MongoDB");

    // 1. Limpiar la colección
    await Usuario.deleteMany({});
    console.log("🗑️ Colección 'usuarios' eliminada");

    // 2. Crear los 3 usuarios base
    const baseUsers = await Usuario.create([
      {
        nombre: "Empleado",
        apellido: "Demo",
        correo: "empleado@demo.com",
        password: "Admin123*",
        rol: "empleado",
      },
      {
        nombre: "Admin",
        apellido: "Demo",
        correo: "admin@demo.com",
        password: "Admin123*",
        rol: "admin",
      },
      {
        nombre: "Super",
        apellido: "Admin",
        correo: "superadmin@demo.com",
        password: "Admin123*",
        rol: "superadmin",
      },
    ]);

    console.log("✅ Usuarios base creados:", baseUsers.map(u => u.correo));

    // 3. Crear 2 usuarios de prueba (CRUD simulado)
    let usuariosPrueba = await Usuario.create([
      {
        nombre: "Carlos",
        apellido: "Prueba",
        correo: "carlos@demo.com",
        password: "Demo123*",
        rol: "empleado",
      },
      {
        nombre: "Ana",
        apellido: "Prueba",
        correo: "ana@demo.com",
        password: "Demo123*",
        rol: "empleado",
      },
    ]);
    console.log("🆕 Usuarios de prueba creados:", usuariosPrueba.map(u => u.correo));

    // 3.a Update uno de los usuarios
    const ana = await Usuario.findOneAndUpdate(
      { correo: "ana@demo.com" },
      { nombre: "Ana Actualizada" },
      { new: true }
    );
    console.log("✏️ Usuario actualizado:", ana.correo, ana.nombre);

    // 3.b Get todos (simulado, solo log)
    let todos = await Usuario.find();
    console.log("📋 Usuarios actuales:", todos.map(u => u.correo));

    // 3.c Delete los 2 usuarios de prueba
    await Usuario.deleteMany({ correo: { $in: ["carlos@demo.com", "ana@demo.com"] } });
    console.log("🗑️ Usuarios de prueba eliminados");

    // 4. Crear otros 2 usuarios nuevos
    let nuevos = await Usuario.create([
      {
        nombre: "Laura",
        apellido: "Temporal",
        correo: "laura@demo.com",
        password: "Demo123*",
        rol: "empleado",
      },
      {
        nombre: "Pedro",
        apellido: "Temporal",
        correo: "pedro@demo.com",
        password: "Demo123*",
        rol: "empleado",
      },
    ]);
    console.log("🆕 Nuevos usuarios temporales creados:", nuevos.map(u => u.correo));

    // 5. Eliminar esos 2 usuarios
    await Usuario.deleteMany({ correo: { $in: ["laura@demo.com", "pedro@demo.com"] } });
    console.log("🗑️ Nuevos usuarios temporales eliminados");

    // Confirmar usuarios finales
    todos = await Usuario.find();
    console.log("🎯 Usuarios finales en la BD:", todos.map(u => `${u.correo} (${u.rol})`));

    console.log(`
    ✅ Seed completado con éxito
    👉 Usuarios finales:
       👤 Empleado: empleado@demo.com / Admin123*
       👤 Admin: admin@demo.com / Admin123*
       👤 Superadmin: superadmin@demo.com / Admin123*
    `);

  } catch (err) {
    console.error("🔴 Error en seed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
    process.exit(0);
  }
}

seedUsuarios();
