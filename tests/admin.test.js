// tests/empleados.admin.test.js
const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");

describe("CRUD completo de empleados con JWT Admin", () => {
  let token;
  let empleadosIds = [];

  beforeAll(async () => {
    console.log("🚀 Iniciando test de CRUD con Admin...");

    // 🔐 Login como Admin base creado por seeds
    const resLogin = await request(app)
      .post("/api/v1/login")
      .send({
        correo: "admin@demo.com",
        password: "Admin123*",
      });

    expect(resLogin.statusCode).toBe(200);
    token = resLogin.body.token;
    console.log("🔑 Token Admin generado correctamente");

    // 🧹 Eliminar todos los empleados existentes antes del test
    const resAllBefore = await request(app)
      .get("/api/v1/empleados")
      .set("Authorization", `Bearer ${token}`);
    console.log(`📊 Empleados antes de limpiar: ${resAllBefore.body.data?.length || 0}`);

    const empleados = resAllBefore.body.data || [];
    for (const e of empleados) {
      await request(app)
        .delete(`/api/v1/empleados/${e._id}`)
        .set("Authorization", `Bearer ${token}`);
    }
    console.log("🗑️ Todos los empleados eliminados correctamente.");
  });

  it("✅ Debería ejecutar CRUD completo de empleados como Admin", async () => {
    // 1️⃣ Crear tres empleados
    const empleadosData = [
      {
        nombres: "EmpleadoCompleto",
        apellidos: "Test",
        tipoDocumento: "C.C.",
        numeroDocumento: 1111111111,
        fechaNacimiento: "1990-01-01",
        correo: "empleadocompleto@demo.com",
        telefono: "3001112223",
        cargo: "Developer",
        area: "TI",
        tipoContrato: "Fijo",
        salario: 2500000,
        estado: "Activo",
      },
      {
        nombres: "EmpleadoObligatorio",
        apellidos: "Test",
        tipoDocumento: "C.C.",
        numeroDocumento: 2222222222,
        fechaNacimiento: "1990-01-01",
        correo: "empleadoobligatorio@demo.com",
      },
      {
        nombres: "EmpleadoDemo",
        apellidos: "Demo",
        tipoDocumento: "C.C.",
        numeroDocumento: 3333333333,
        fechaNacimiento: "1990-01-01",
        correo: "empleado@demo.com",
      },
    ];

    for (const emp of empleadosData) {
      const res = await request(app)
        .post("/api/v1/empleados")
        .set("Authorization", `Bearer ${token}`)
        .send(emp);

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty("_id");

      empleadosIds.push(res.body.data._id);
      console.log(`👤 Empleado creado: ${res.body.data._id}`);
    }

    // 2️⃣ Listar todos los empleados
    const resAllAfter = await request(app)
      .get("/api/v1/empleados")
      .set("Authorization", `Bearer ${token}`);
    expect(resAllAfter.statusCode).toBe(200);
    console.log(`📊 Total empleados creados: ${resAllAfter.body.data.length}`);

    // 3️⃣ Actualizar un empleado
    const idActualizar = empleadosIds[1];
    const updateData = {
      nombres: "EmpleadoObligatorio Actualizado",
      apellidos: "Test Actualizado",
      tipoDocumento: "C.C.",
      numeroDocumento: 9999999999,
      fechaNacimiento: "1992-03-20",
      correo: "empleadoobligatorio@demoactualizado.com",
      cargo: "Soporte",
      salario: 1800000,
      estado: "Activo",
    };

    const resUpdate = await request(app)
      .put(`/api/v1/empleados/${idActualizar}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(resUpdate.statusCode).toBe(200);
    console.log(`✏️ Empleado actualizado: ${idActualizar}`);

    // 4️⃣ Obtener empleado por ID
    const resGet = await request(app)
      .get(`/api/v1/empleados/${idActualizar}`)
      .set("Authorization", `Bearer ${token}`);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.data.nombres).toContain("Actualizado");

    // 5️⃣ Eliminar un empleado
    const idEliminar = empleadosIds[0];
    const resDelete = await request(app)
      .delete(`/api/v1/empleados/${idEliminar}`)
      .set("Authorization", `Bearer ${token}`);
    expect(resDelete.statusCode).toBe(200);
    console.log(`🗑️ Empleado eliminado: ${idEliminar}`);

    // 6️⃣ Listar nuevamente (deben quedar 2)
    const resFinal = await request(app)
      .get("/api/v1/empleados")
      .set("Authorization", `Bearer ${token}`);
    expect(resFinal.statusCode).toBe(200);
    console.log(`📋 Empleados finales: ${resFinal.body.data.length}`);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    console.log("🔴 Conexión MongoDB cerrada correctamente");
  });
});
