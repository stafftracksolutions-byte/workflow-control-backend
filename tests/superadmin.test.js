// tests/empleados.joi.test.js
const request = require("supertest");
const app = require("../src/app");
const Usuario = require("../src/models/Usuario");
const Empleado = require("../src/models/Empleado");

describe("CRUD completo de empleados con Joi y JWT SuperAdmin", () => {
  let token;
  let empleadosIds = [];

  beforeAll(async () => {
    // Limpiar DB
    await Usuario.deleteMany({});
    await Empleado.deleteMany({});

    // Crear usuarios
    const users = [
      { nombre: "Empleado", apellido: "Demo", correo: "empleado@demo.com", password: "Admin123*", rol: "empleado" },
      { nombre: "Admin", apellido: "Demo", correo: "admin@demo.com", password: "Admin123*", rol: "admin" },
      { nombre: "SuperAdmin", apellido: "Demo", correo: "superadmin@demo.com", password: "Admin123*", rol: "superadmin" }
    ];

    for (const user of users) {
      await Usuario.create(user);
    }

    // Login SuperAdmin
    const resLogin = await request(app)
      .post("/api/v1/login")
      .send({ correo: "superadmin@demo.com", password: "Admin123*" });

    token = resLogin.body.token;
  });

  it("CRUD de empleados usando Joi", async () => {
    // 1️⃣ Crear empleados
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
        fechaIngreso: "2025-01-01",
        tipoContrato: "Fijo",
        salario: 2500000,
        estado: "Activo"
      },
      {
        nombres: "EmpleadoObligatorio",
        apellidos: "Test",
        tipoDocumento: "C.C.",
        numeroDocumento: 2222222222,
        fechaNacimiento: "1990-01-01",
        correo: "empleadoobligatorio@demo.com"
      },
      {
        nombres: "EmpleadoDemo",
        apellidos: "Demo",
        tipoDocumento: "C.C.",
        numeroDocumento: 3333333333,
        fechaNacimiento: "1990-01-01",
        correo: "empleado@demo.com"
      }
    ];

    for (const emp of empleadosData) {
      const res = await request(app)
        .post("/api/v1/empleados")
        .set("Authorization", `Bearer ${token}`)
        .send(emp);

      expect(res.statusCode).toBe(201);
      empleadosIds.push(res.body.data._id);
    }

    // 2️⃣ GET todos los empleados
    const resAll = await request(app)
      .get("/api/v1/empleados")
      .set("Authorization", `Bearer ${token}`);
    expect(resAll.statusCode).toBe(200);
    expect(resAll.body.data.length).toBe(3);

    // 3️⃣ Actualizar empleado con datos faltantes
    const updateData = {
      cargo: "Soporte",
      salario: 1800000,
      estado: "Activo",
      nombres: "EmpleadoObligatorio Actualizado",
      apellidos: "Test Actualizado",
      tipoDocumento: "C.C.",
      numeroDocumento: 9999999999,
      fechaNacimiento: "1992-03-20",
      correo: "empleadoobligatorio@demoactualizado.com"
    };

    const resUpdate = await request(app)
      .put(`/api/v1/empleados/${empleadosIds[1]}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(resUpdate.statusCode).toBe(200);
    expect(resUpdate.body.data.cargo).toBe("Soporte");

    // 4️⃣ GET empleado por ID
    const resGet = await request(app)
      .get(`/api/v1/empleados/${empleadosIds[1]}`)
      .set("Authorization", `Bearer ${token}`);
    expect(resGet.statusCode).toBe(200);
    expect(resGet.body.data.cargo).toBe("Soporte");

    // 5️⃣ DELETE empleado completo
    const resDelete = await request(app)
      .delete(`/api/v1/empleados/${empleadosIds[0]}`)
      .set("Authorization", `Bearer ${token}`);
    expect(resDelete.statusCode).toBe(200);

    // 6️⃣ GET final: solo deben quedar 2 empleados
    const resFinal = await request(app)
      .get("/api/v1/empleados")
      .set("Authorization", `Bearer ${token}`);
    expect(resFinal.statusCode).toBe(200);
    expect(resFinal.body.data.length).toBe(2);
  });
});

afterAll(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});
