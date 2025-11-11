// seeds/seedEmpleados.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Empleado = require("../src/models/Empleado");

async function seedEmpleados() {
  try {
    await connectDB();
    console.log("✅ Conectado a MongoDB");

    // 1. Borrar todos los empleados
    await Empleado.deleteMany({});
    console.log("🗑️ Colección 'empleados' eliminada");

    // 2. Crear 4 empleados con TODOS los datos obligatorios
    const empleados = await Empleado.create([
      {
        nombres: "Carlos",
        apellidos: "Pérez",
        tipoDocumento: "C.C.",
        numeroDocumento: 1001,
        fechaNacimiento: new Date("1990-01-01"),
        correo: "carlos@demo.com",
        telefono: "3001111111",
        cargo: "Analista",
        area: "IT",
        tipoContrato: "Indefinido",
        salario: 2500000,
      },
      {
        nombres: "Ana",
        apellidos: "Gómez",
        tipoDocumento: "C.C.",
        numeroDocumento: 1002,
        fechaNacimiento: new Date("1992-02-02"),
        correo: "ana@demo.com",
        telefono: "3002222222",
        cargo: "Diseñadora",
        area: "Marketing",
        tipoContrato: "Fijo",
        salario: 2000000,
      },
      {
        nombres: "Laura",
        apellidos: "Martínez",
        tipoDocumento: "C.C.",
        numeroDocumento: 1003,
        fechaNacimiento: new Date("1995-03-03"),
        correo: "empleado@demo.com",
        telefono: "3003333333",
        cargo: "Ingeniera",
        area: "Operaciones",
        tipoContrato: "Temporal",
        salario: 1800000,
      },
      {
        nombres: "Pedro",
        apellidos: "Ramírez",
        tipoDocumento: "C.C.",
        numeroDocumento: 1004,
        fechaNacimiento: new Date("1998-04-04"),
        correo: "pedro@demo.com",
        telefono: "3004444444",
        cargo: "Soporte",
        area: "IT",
        tipoContrato: "Practicante",
        salario: 1200000,
      },
    ]);

    console.log("✅ 4 empleados creados:", empleados.map(e => e.correo));

    // 3. Hacer un UPDATE a uno de los empleados
    const ana = await Empleado.findOneAndUpdate(
      { correo: "ana@demo.com" },
      { cargo: "Diseñadora Senior", salario: 2500000 },
      { new: true }
    );
    console.log("✏️ Ana actualizada:", ana);

    // 4. Hacer un DELETE de otro empleado
    const pedro = await Empleado.findOneAndDelete({ correo: "pedro@demo.com" });
    console.log("🗑️ Pedro eliminado:", pedro?.correo);

    // 5. Mostrar empleados finales
    const empleadosFinales = await Empleado.find({});
    console.log("🎯 Empleados finales en la BD:");
    empleadosFinales.forEach(e => {
      console.log(
        `👤 ${e.nombres} ${e.apellidos} | ${e.correo} | ${e.cargo} | ${e.area}`
      );
    });

    console.log("\n✅ Seed completado con éxito");

  } catch (err) {
    console.error("🔴 Error en seed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
    process.exit(0);
  }
}

seedEmpleados();
