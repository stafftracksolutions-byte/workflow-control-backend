// src/middlewares/roles.js
const Empleado = require("../models/Empleado");

/**
 * roleMiddleware: comportamiento actual (chequeo simple por roles permitidos)
 * Usage: roleMiddleware(['admin', 'superadmin'])
 */
function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción" });
    }
    next();
  };
}

/**
 * allowSelfOrRoles: permite acceso si:
 *  - el usuario tiene uno de los allowedRoles (ej. admin, superadmin)
 *  - o si el usuario es 'empleado' y el recurso solicitado es suyo (por correo o id)
 *
 * Usage: allowSelfOrRoles(['admin', 'superadmin'])
 */
function allowSelfOrRoles(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Usuario no autenticado" });
      }

      // Si es admin o superadmin pasa directo
      if (allowedRoles.includes(req.user.rol)) {
        return next();
      }

      // Si no es uno de los roles permitidos, comprobamos si es 'empleado' y el recurso le pertenece
      if (req.user.rol === "empleado") {
        // Caso 1: ruta /api/empleados/me -> el propio empleado pide su info
        if (req.path === "/me") return next();

        // Caso 2: ruta /api/empleados/:id -> comparamos por id del empleado
        const recursoId = req.params.id;
        if (recursoId) {
          const empleado = await Empleado.findById(recursoId).lean();
          if (!empleado) {
            return res.status(404).json({ success: false, message: "Empleado no encontrado" });
          }
          // comparo por correo (recomendado) si existe correo en token, fallback a ids si conviene
          if (req.user.correo && empleado.correo && empleado.correo.toLowerCase() === req.user.correo.toLowerCase()) {
            return next();
          }
          // opcional: si el token incluyera un campo employeeId, comparar con empleado._id
          if (req.user.id && String(empleado._id) === String(req.user.id)) {
            return next();
          }
        }

        // Si no cumple, denegamos
        return res.status(403).json({ success: false, message: "No tienes permisos para ver este recurso" });
      }

      // Si el usuario no es empleado ni admin permitido -> negar
      return res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { roleMiddleware, allowSelfOrRoles };
