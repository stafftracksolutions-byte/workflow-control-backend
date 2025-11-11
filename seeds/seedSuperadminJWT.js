require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";

(async () => {
  try {
    console.log("🚀 Iniciando seed con Superadmin...");

    // 1️⃣ Login del Superadmin
    const loginRes = await axios.post(`${API_URL}/login`, {
      correo: "superadmin@demo.com",
      password: "Admin123*",
    });
    const token = loginRes.data.token;
    console.log("✅ Login exitoso, token obtenido");

    const headers = { Authorization: `Bearer ${token}` };

    // 2️⃣ Borrar todos los empleados existentes
    await axios.delete(`${API_URL}/empleados`, { headers });
    console.log("🗑️ Todos los empleados eliminados");

    // 3️⃣ Crear 5 empleados
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
        tipoContrato: "Fijo",
        salario: 1800000,
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
        tipoContrato: "Fijo",
        salario: 1800000,
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
        tipoContrato: "Fijo",
        salario: 2300000,
      },
      {
        nombres: "Pedro",
        apellidos: "López",
        tipoDocumento: "C.C.",
        numeroDocumento: 444444444,
        fechaNacimiento: "1990-07-15",
        correo: "pedro@demo.com",
        telefono: "3007778888",
        cargo: "Ingeniero",
        area: "Sistemas",
        tipoContrato: "Indefinido",
        salario: 3500000,
      },
      {
        nombres: "Empleado",
        apellidos: "Demo",
        tipoDocumento: "C.C.",
        numeroDocumento: 555555555,
        fechaNacimiento: "1985-02-20",
        correo: "empleado@demo.com",
        telefono: "3009990000",
        cargo: "Gerente",
        area: "Dirección",
        tipoContrato: "Indefinido",
        salario: 5000000,
      },
    ];

    const created = [];

    for (const emp of empleados) {
      console.log(`📤 Creando empleado: ${emp.nombres} ${emp.apellidos}`);
      const res = await axios.post(`${API_URL}/empleados`, emp, { headers });
      created.push(res.data.data || { ...emp, _id: res.data._id });
    }

    console.log("✅ Empleados creados:", created.map((e) => e.nombres));

    // 4️⃣ Actualizar 2 empleados con campos válidos (sin _id ni __v)
    const e1 = created[0];
    const e2 = created[1];

    await axios.put(
      `${API_URL}/empleados/${e1._id}`,
      {
        nombres: e1.nombres,
        apellidos: e1.apellidos,
        tipoDocumento: e1.tipoDocumento,
        numeroDocumento: e1.numeroDocumento,
        fechaNacimiento: e1.fechaNacimiento,
        correo: e1.correo,
        telefono: e1.telefono,
        cargo: "Analista",
        area: e1.area,
        tipoContrato: e1.tipoContrato,
        salario: 2000000,
      },
      { headers }
    );

    await axios.put(
      `${API_URL}/empleados/${e2._id}`,
      {
        nombres: e2.nombres,
        apellidos: e2.apellidos,
        tipoDocumento: e2.tipoDocumento,
        numeroDocumento: e2.numeroDocumento,
        fechaNacimiento: e2.fechaNacimiento,
        correo: e2.correo,
        telefono: e2.telefono,
        cargo: "Coordinador",
        area: e2.area,
        tipoContrato: e2.tipoContrato,
        salario: 2500000,
      },
      { headers }
    );

    console.log("✏️ 2 empleados actualizados");

    // 5️⃣ Eliminar 2 empleados no modificados
    await axios.delete(`${API_URL}/empleados/${created[2]._id}`, { headers });
    await axios.delete(`${API_URL}/empleados/${created[3]._id}`, { headers });
    console.log("🗑️ 2 empleados eliminados");

    // 6️⃣ Mostrar empleados restantes
    const finalRes = await axios.get(`${API_URL}/empleados`, { headers });
    console.log("📊 Empleados restantes:");
    finalRes.data.data.forEach((e) =>
      console.log(`- ${e.nombres} ${e.apellidos} | Cargo: ${e.cargo} | Salario: ${e.salario}`)
    );

    console.log("🎉 Seed Superadmin completado ✅");
  } catch (err) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
