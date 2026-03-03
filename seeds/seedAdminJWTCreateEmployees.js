require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";
const ADMIN_USER = process.env.ADMIN_USER || "admin@demo.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "Admin123*";

(async () => {
  try {
    console.log("🚀 Iniciando seed de empleados...");

    // 1️⃣ Login admin
    const loginRes = await axios.post(`${API_URL}/login`, {
      correo: ADMIN_USER,
      password: ADMIN_PASS,
    });
    const token = loginRes.data.token;
    console.log("✅ Login exitoso, token obtenido");

    const headers = { Authorization: `Bearer ${token}` };

    // 2️⃣ Obtener y eliminar empleados existentes
    const all = await axios.get(`${API_URL}/empleados`, { headers });
    console.log(`📡 Empleados existentes: ${all.data.data.length}`);
    if (all.data.data.length > 0) {
      for (const emp of all.data.data) {
        await axios.delete(`${API_URL}/empleados/${emp._id}`, { headers });
      }
      console.log("🗑️ Empleados eliminados");
    }

    // 3️⃣ Lista de 10 empleados (6 activos, 4 inactivos)
    const empleados = [
      {
        nombres: "Ana",
        apellidos: "Gómez",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000001,
        fechaNacimiento: "1990-05-12",
        correo: "ana.gomez@demo.com",
        telefono: "3001111111",
        cargo: "Analista Financiera",
        area: "Finanzas",
        fechaIngreso: "2025-01-15",
        tipoContrato: "Indefinido",
        salario: 2500000,
        estado: "Activo",
      },
      {
        nombres: "Juan",
        apellidos: "Pérez",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000002,
        fechaNacimiento: "1988-07-20",
        correo: "juan.perez@demo.com",
        telefono: "3002222222",
        cargo: "Auxiliar Administrativo",
        area: "Administración",
        fechaIngreso: "2024-11-01",
        tipoContrato: "Fijo",
        salario: 1800000,
        estado: "Activo",
      },
      {
        nombres: "Laura",
        apellidos: "Martínez",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000003,
        fechaNacimiento: "1995-03-09",
        correo: "laura.martinez@demo.com",
        telefono: "3003333333",
        cargo: "Contadora",
        area: "Finanzas",
        fechaIngreso: "2025-02-10",
        tipoContrato: "Indefinido",
        salario: 2300000,
        estado: "Activo",
      },
      {
        nombres: "Carlos",
        apellidos: "Ramírez",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000004,
        fechaNacimiento: "1992-09-18",
        correo: "carlos.ramirez@demo.com",
        telefono: "3004444444",
        cargo: "Ingeniero de Sistemas",
        area: "Tecnología",
        fechaIngreso: "2025-01-20",
        tipoContrato: "Indefinido",
        salario: 3200000,
        estado: "Activo",
      },
      {
        nombres: "Empleado",
        apellidos: "Demo",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000005,
        fechaNacimiento: "1990-01-01",
        correo: "empleado@demo.com", // 👈 este es el que pediste
        telefono: "3005555555",
        cargo: "Analista Junior",
        area: "Administración",
        fechaIngreso: "2025-02-20",
        tipoContrato: "Fijo",
        salario: 1900000,
        estado: "Activo",
      },
      {
        nombres: "Sofía",
        apellidos: "Morales",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000006,
        fechaNacimiento: "1996-06-14",
        correo: "sofia.morales@demo.com",
        telefono: "3006666666",
        cargo: "Diseñadora Gráfica",
        area: "Marketing",
        fechaIngreso: "2025-02-05",
        tipoContrato: "Fijo",
        salario: 2000000,
        estado: "Activo",
      },
      // Inactivos
      {
        nombres: "Paula",
        apellidos: "Ríos",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000007,
        fechaNacimiento: "1992-03-10",
        correo: "paula.rios@demo.com",
        telefono: "3007777777",
        cargo: "Asistente Comercial",
        area: "Ventas",
        fechaIngreso: "2024-09-01",
        tipoContrato: "Fijo",
        salario: 1900000,
        estado: "Inactivo",
      },
      {
        nombres: "Jorge",
        apellidos: "Mendoza",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000008,
        fechaNacimiento: "1985-07-25",
        correo: "jorge.mendoza@demo.com",
        telefono: "3008888888",
        cargo: "Supervisor de Planta",
        area: "Producción",
        fechaIngreso: "2024-08-15",
        tipoContrato: "Indefinido",
        salario: 3000000,
        estado: "Inactivo",
      },
      {
        nombres: "Valentina",
        apellidos: "Ortiz",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000009,
        fechaNacimiento: "1997-02-18",
        correo: "valentina.ortiz@demo.com",
        telefono: "3009999999",
        cargo: "Community Manager",
        area: "Marketing",
        fechaIngreso: "2024-07-10",
        tipoContrato: "Fijo",
        salario: 1800000,
        estado: "Inactivo",
      },
      {
        nombres: "Ricardo",
        apellidos: "Silva",
        tipoDocumento: "C.C.",
        numeroDocumento: 100000010,
        fechaNacimiento: "1990-10-01",
        correo: "ricardo.silva@demo.com",
        telefono: "3010000001",
        cargo: "Analista de Calidad",
        area: "Producción",
        fechaIngreso: "2024-06-20",
        tipoContrato: "Indefinido",
        salario: 2400000,
        estado: "Inactivo",
      },
    ];

    // 4️⃣ Crear empleados
    const created = [];
    for (const emp of empleados) {
      console.log(`📤 Creando empleado: ${emp.nombres} ${emp.apellidos}`);
      const res = await axios.post(`${API_URL}/empleados`, emp, { headers });
      created.push(res.data.data);
    }
    console.log("✅ Empleados creados:", created);

    console.log("🎉 Seed de 10 empleados completado ✅");
  } catch (err) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();