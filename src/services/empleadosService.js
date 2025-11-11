// services/empleadosService.js
const { normalizeEmail } = require("../utils/emailUtils");
const Empleado = require("../models/Empleado");

// 🔹 Utilidad para errores 400
function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

// Obtener todos los empleados
const obtenerEmpleados = async () => {
  return await Empleado.find();
};

// Crear Empleado
const crearEmpleado = async (data) => {
  // Normalizar correo
  data.correo = normalizeEmail(data.correo);

  // Convertir fechas a Date
  if (data.fechaNacimiento) data.fechaNacimiento = new Date(data.fechaNacimiento);
  if (data.fechaIngreso) data.fechaIngreso = new Date(data.fechaIngreso);

  // Verificar duplicado de documento
  const existeDocumento = await Empleado.findOne({ numeroDocumento: data.numeroDocumento });
  if (existeDocumento) throw badRequest("Ya existe un empleado con ese numeroDocumento");

  // Verificar duplicado de correo
  const existeCorreo = await Empleado.findOne({ correo: data.correo });
  if (existeCorreo) throw badRequest("Ya existe un empleado con ese correo");

  const nuevoEmpleado = new Empleado(data);
  return await nuevoEmpleado.save();
};

// Obtener un empleado por ID
const getEmpleadoById = async (id) => {
  return await Empleado.findById(id);
};


// Actualizar Empleado
const actualizarEmpleado = async (id, data) => {
  // Normalizar correo si existe
  if (data.correo) data.correo = normalizeEmail(data.correo);

  // Convertir fechas a Date si vienen
  if (data.fechaNacimiento) data.fechaNacimiento = new Date(data.fechaNacimiento);
  if (data.fechaIngreso) data.fechaIngreso = new Date(data.fechaIngreso);

  // Verificar duplicado de documento (excepto el propio)
  if (data.numeroDocumento) {
    const existeDocumento = await Empleado.findOne({ 
      numeroDocumento: data.numeroDocumento, 
      _id: { $ne: id } 
    });
    if (existeDocumento) throw badRequest("Ya existe un empleado con ese numeroDocumento");
  }

  // Verificar duplicado de correo (excepto el propio)
  if (data.correo) {
    const existeCorreo = await Empleado.findOne({ 
      correo: data.correo, 
      _id: { $ne: id } 
    });
    if (existeCorreo) throw badRequest("Ya existe un empleado con ese correo");
  }

  // Actualizar empleado
  return await Empleado.findByIdAndUpdate(id, data, { new: true });
};

// Eliminar empleado
const eliminarEmpleado = async (id) => {
  return await Empleado.findByIdAndDelete(id);
};

module.exports = {
  obtenerEmpleados,
  crearEmpleado,
  getEmpleadoById,
  actualizarEmpleado,
  eliminarEmpleado,
};
