const { formatObjectDates } = require('../utils/dateUtils');
// Eliminar esta línea del controlador si no los usas aún
// const { validateEmail, normalizeEmail } = require('../utils/emailUtils');
const empleadoService = require("../services/empleadosService");
const Empleado = require("../models/Empleado");

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res, next) => {
  try {
    console.log("📥 GET /empleados - Petición recibida");
    const empleados = await empleadoService.obtenerEmpleados();
    
     // Formatear todas las fechas de cada empleado
    const empleadosFormateados = empleados.map(emp => formatObjectDates(emp._doc));

    console.log("📊 Empleados encontrados:", empleados.length);
    res.json({ success: true, data: empleadosFormateados });
  } catch (err) {
    console.error("🔥 Error en obtenerEmpleados:", err.message);
    next(err);
  }
};

// Crear un nuevo empleado
exports.crearEmpleado = async (req, res, next) => {
  try {
    console.log("📥 POST /empleados - Body recibido:", req.body);

    const nuevoEmpleado = await empleadoService.crearEmpleado(req.body);

    console.log("✅ Empleado creado:", nuevoEmpleado._id);
    res.status(201).json({ success: true, data: nuevoEmpleado });

  } catch (err) {
    // Detectar duplicados (correo o numeroDocumento)
    if (err.code === 11000) {
      const campoDuplicado = Object.keys(err.keyValue)[0];
      console.error(`❌ Duplicado en ${campoDuplicado}:`, err.keyValue[campoDuplicado]);
      return res.status(400).json({
        success: false,
        message: `Ya existe un empleado con ese ${campoDuplicado}`
      });
    }

    console.error("🔥 Error en crearEmpleado:", err.message);
    next(err);
  }
};

// Obtener un empleado por ID
exports.getEmpleadoById = async (req, res, next) => {
  try {
    console.log("📥 GET /empleados/:id - ID recibido:", req.params.id);
    const empleado = await empleadoService.getEmpleadoById(req.params.id);

    if (!empleado) {
      console.warn("⚠️ Empleado no encontrado con ID:", req.params.id);
      const error = new Error("Empleado no encontrado");
      error.status = 404;
      throw error;
    }

    console.log("✅ Empleado encontrado:", empleado._id);
    res.json({ success: true, data: empleado });
  } catch (err) {
    if (err.name === "CastError") {
      console.error("❌ ID inválido:", req.params.id);
      err.status = 400;
      err.message = "ID inválido";
    }
    next(err);
  }
};

// Actualizar empleado
exports.actualizarEmpleado = async (req, res, next) => {
  try {
    console.log("📥 PUT /empleados/:id - ID:", req.params.id, "Body:", req.body);

    const empleado = await empleadoService.actualizarEmpleado(req.params.id, req.body);

    if (!empleado) {
      console.warn("⚠️ No se encontró para actualizar - ID:", req.params.id);
      const error = new Error("Empleado no encontrado");
      error.status = 404;
      throw error;
    }

    console.log("✅ Empleado actualizado:", empleado._id);
    res.json({ success: true, data: empleado });

  } catch (err) {
    if (err.code === 11000) {
      const campoDuplicado = Object.keys(err.keyValue)[0];
      console.error(`❌ Duplicado en ${campoDuplicado}:`, err.keyValue[campoDuplicado]);
      return res.status(400).json({
        success: false,
        message: `Ya existe un empleado con ese ${campoDuplicado}`
      });
    }

    if (err.name === "CastError") {
      console.error("❌ ID inválido en actualización:", req.params.id);
      err.status = 400;
      err.message = "ID inválido";
    }
    next(err);
  }
};

// Eliminar empleado
exports.eliminarEmpleado = async (req, res, next) => {
  try {
    console.log("📥 DELETE /empleados/:id - ID recibido:", req.params.id);
    const empleado = await empleadoService.eliminarEmpleado(req.params.id);

    if (!empleado) {
      console.warn("⚠️ No se encontró para eliminar - ID:", req.params.id);
      const error = new Error("Empleado no encontrado");
      error.status = 404;
      throw error;
    }

    console.log("✅ Empleado eliminado:", empleado._id);
    res.json({ success: true, message: "Empleado eliminado" });
  } catch (err) {
    if (err.name === "CastError") {
      console.error("❌ ID inválido en eliminación:", req.params.id);
      err.status = 400;
      err.message = "ID inválido";
    }
    next(err);
  }
};

// 🔹 Nuevo: Ver mis propios datos
exports.getMisDatos = async (req, res, next) => {
  try {
    const correo = req.user.correo;
    if (!correo) {
      return res.status(400).json({
        success: false,
        message: "Correo no presente en token"
      });
    }

    const empleado = await Empleado.findOne({ correo: correo.toLowerCase().trim() });
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado"
      });
    }

    res.json({ success: true, data: empleado });
  } catch (err) {
    next(err);
  }
};

// 🔹 Nuevo: Eliminar todos los empleados (solo superadmin)
exports.eliminarTodos = async (req, res, next) => {
  try {
    await Empleado.deleteMany({});
    res.json({ success: true, message: "Todos los empleados fueron eliminados" });
  } catch (err) {
    next(err);
  }
};

