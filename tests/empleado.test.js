require("dotenv").config();
const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";
const EMPLEADO_USER = { correo: "empleado@demo.com", password: "Admin123*" };

describe("Test rol EMPLEADO", () => {
  let tokenEmpleado;
  let empleadoId;

  beforeAll(async () => {
    // 1️⃣ Login del empleado
    const resLogin = await axios.post(`${API_URL}/login`, EMPLEADO_USER);
    tokenEmpleado = resLogin.data.token;
    expect(tokenEmpleado).toBeDefined();

    // 2️⃣ Obtener sus propios datos para sacar el ID
    const resMe = await axios.get(`${API_URL}/empleados/me`, {
      headers: { Authorization: `Bearer ${tokenEmpleado}` },
    });
    empleadoId = resMe.data.data._id;
    expect(empleadoId).toBeDefined();
  });

  test("Empleado puede ver sus propios datos", async () => {
    const res = await axios.get(`${API_URL}/empleados/me`, {
      headers: { Authorization: `Bearer ${tokenEmpleado}` },
    });
    expect(res.status).toBe(200);
    expect(res.data.data._id).toBe(empleadoId);
    expect(res.data.data.correo).toBe(EMPLEADO_USER.correo);
  });

  test("Empleado no puede ver otro empleado por ID", async () => {
    try {
      await axios.get(`${API_URL}/empleados/64c4331ad18e3a4d35347f22`, {
        headers: { Authorization: `Bearer ${tokenEmpleado}` },
      });
      throw new Error("No debería poder ver otro empleado");
    } catch (err) {
      expect([403, 404]).toContain(err.response.status);
    }
  });

  test("Empleado no puede listar todos los empleados", async () => {
    try {
      await axios.get(`${API_URL}/empleados`, {
        headers: { Authorization: `Bearer ${tokenEmpleado}` },
      });
      throw new Error("No debería poder listar todos los empleados");
    } catch (err) {
      expect([403, 404]).toContain(err.response.status);
    }
  });
});
