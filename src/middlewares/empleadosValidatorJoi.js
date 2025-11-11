const Joi = require("joi");

// 🎯 Esquema base (campos opcionales por defecto)
const empleadoBaseSchema = {
  nombres: Joi.string().min(2).max(50).messages({
    "string.min": "El nombre debe tener al menos 2 caracteres"
  }),
  apellidos: Joi.string().min(2).max(50),
  tipoDocumento: Joi.string().valid("C.C.", "T.I.", "C.E.", "Pasaporte"),
  numeroDocumento: Joi.number().integer(),
  fechaNacimiento: Joi.date().iso(),
  correo: Joi.string().email(),
  telefono: Joi.string().pattern(/^[0-9]{10}$/).messages({
    "string.pattern.base": "Debe ser un teléfono válido en Colombia (10 dígitos)"
  }),
  cargo: Joi.string().min(2),
  area: Joi.string().min(2),
  fechaIngreso: Joi.date(),
  tipoContrato: Joi.string().valid("Fijo", "Indefinido", "Temporal"),
  salario: Joi.number().min(0).messages({
    "number.min": "El salario debe ser mayor o igual a 0"
  }),
  estado: Joi.string().valid("Activo", "Inactivo")
};

// 🔹 POST → con los obligatorios
const empleadoCreateSchema = Joi.object({
  ...empleadoBaseSchema,
  nombres: empleadoBaseSchema.nombres.required(),
  apellidos: empleadoBaseSchema.apellidos.required(),
  tipoDocumento: empleadoBaseSchema.tipoDocumento.required(),
  numeroDocumento: empleadoBaseSchema.numeroDocumento.required(),
  fechaNacimiento: empleadoBaseSchema.fechaNacimiento.required(),
  correo: empleadoBaseSchema.correo.required()
});

// 🔹 PUT → sin obligatorios, pero al menos 1 campo
const empleadoUpdateSchema = Joi.object(empleadoBaseSchema).min(1);

// Middleware genérico
function validar(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const erroresUnicos = [];
      const campos = new Set();

      for (const d of error.details) {
        if (!campos.has(d.path[0])) {
          campos.add(d.path[0]);
          erroresUnicos.push({
            campo: d.path[0],
            mensaje: d.message
          });
        }
      }

      return res.status(400).json({
        success: false,
        errors: erroresUnicos
      });
    }

    next();
  };
}

module.exports = {
  validarEmpleadoCrear: validar(empleadoCreateSchema),
  validarEmpleadoActualizar: validar(empleadoUpdateSchema)
};
