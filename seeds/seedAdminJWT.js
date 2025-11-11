require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";
const ADMIN_USER = process.env.ADMIN_USER || "admin@demo.com";
const ADMIN_PASS = process.env.ADMIN_PASS || "Admin123*";

(async () => {
  try {
    console.log("🚀 Iniciando seed con API...");

    // 1️⃣ Login del admin
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

    // 3️⃣ Crear empleados
    const empleados = [
      {
        nombres: "Ana",
        apellidos: "Gomez",
        tipoDocumento: "C.C.",
        numeroDocumento: 123456789,
        fechaNacimiento: "1991-12-31",
        correo: "ana@demo.com",
        telefono: "3001234567",
        cargo: "Auxiliar",
        area: "Administración",
        fechaIngreso: "2025-08-26",
        tipoContrato: "Fijo",
        salario: 1800000,
        estado: "Activo",
      },
      {
        nombres: "Juan",
        apellidos: "Pérez",
        tipoDocumento: "C.C.",
        numeroDocumento: 111111111,
        fechaNacimiento: "1989-12-31",
        correo: "juan@demo.com",
        telefono: "3001112222",
        cargo: "Auxiliar",
        area: "Administración",
        fechaIngreso: "2025-08-26",
        tipoContrato: "Fijo",
        salario: 1800000,
        estado: "Activo",
      },
      {
        nombres: "Laura",
        apellidos: "Martínez",
        tipoDocumento: "C.C.",
        numeroDocumento: 333333333,
        fechaNacimiento: "1995-03-09",
        correo: "laura@demo.com",
        telefono: "3005556666",
        cargo: "Contadora",
        area: "Finanzas",
        fechaIngreso: "2025-08-26",
        tipoContrato: "Fijo",
        salario: 2300000,
        estado: "Activo",
      },
    ];

    const created = [];
    for (const emp of empleados) {
      console.log(`📤 Creando empleado: ${emp.nombres} ${emp.apellidos}`);
      const res = await axios.post(`${API_URL}/empleados`, emp, { headers });
      created.push(res.data.data);
    }
    console.log("✅ Empleados creados:", created);

    // 4️⃣ Actualizar parcialmente empleados
    await axios.put(
      `${API_URL}/empleados/${created[0]._id}`,
      {
        nombres: "Ana",
        apellidos: "Gomez",
        tipoDocumento: "C.C.",
        numeroDocumento: 123456789,
        fechaNacimiento: "1991-12-31",
        correo: "ana@demo.com",
        cargo: "Analista",
        salario: 2000000
      },
      { headers }
    );

    await axios.put(
      `${API_URL}/empleados/${created[1]._id}`,
      {
        nombres: "Empleado",
        apellidos: "Demo",
        tipoDocumento: "C.C.",
        numeroDocumento: 111111111,
        fechaNacimiento: "1989-12-31",
        correo: "empleado@demo.com",
        cargo: "Analista Junior",
        salario: 1900000
      },
      { headers }
    );
    console.log("✏️ Empleados actualizados parcialmente");

    // 5️⃣ Obtener uno por ID
    const getRes = await axios.get(`${API_URL}/empleados/${created[0]._id}`, { headers });
    console.log("🔎 GET por ID:", getRes.data.data);

    // 6️⃣ Eliminar uno
    await axios.delete(`${API_URL}/empleados/${created[2]._id}`, { headers });
    console.log("🗑️ Empleado eliminado:", created[2]._id);

    // 7️⃣ Obtener todos los empleados restantes
    const resFinal = await axios.get(`${API_URL}/empleados`, { headers });
    console.log(`📊 Empleados restantes: ${resFinal.data.data.length}`);

    console.log("🎉 Seed CRUD completado ✅");

  } catch (err) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();