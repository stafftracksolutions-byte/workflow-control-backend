require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";

// Datos del usuario empleado (el mismo que tienes en MongoDB)
const EMPLEADO_USER = {
  correo: "empleado@demo.com",
  password: "Admin123*", // contraseña real
};

(async () => {
  try {
    console.log("🚀 Iniciando seed para usuario empleado...");

    // 1️⃣ Login del empleado
    const loginRes = await axios.post(`${API_URL}/login`, EMPLEADO_USER);
    const token = loginRes.data.token;
    console.log("✅ Login exitoso, token obtenido");

    const headers = { Authorization: `Bearer ${token}` };

    // 2️⃣ Obtener sus propios datos
    const miDatosRes = await axios.get(`${API_URL}/empleados/me`, { headers });
    console.log("🔎 Datos del empleado:", miDatosRes.data.data);

    // 3️⃣ Intentar listar todos los empleados (debería fallar o devolver error de permisos)
    try {
      const todosRes = await axios.get(`${API_URL}/empleados`, { headers });
      console.log("❌ Esto no debería ejecutarse. Todos los empleados:", todosRes.data.data);
    } catch (err) {
      console.log("⚠️ Intento de acceso a todos los empleados rechazado como se esperaba");
    }

    // 4️⃣ Intentar actualizar otro empleado (debería fallar)
    try {
      await axios.put(
        `${API_URL}/empleados/68c4331ad18e3a4d35347f22`, // ejemplo de otro empleado
        { cargo: "Jefe" },
        { headers }
      );
      console.log("❌ Esto no debería ejecutarse. Actualización permitida");
    } catch (err) {
      console.log("⚠️ Intento de actualizar otro empleado rechazado como se esperaba");
    }

    console.log("🎉 Seed de empleado completado ✅");
  } catch (err) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
})();
