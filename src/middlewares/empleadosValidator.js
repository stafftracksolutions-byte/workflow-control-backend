// middlewares/empleadosValidator.js
const { body } = require("express-validator");

exports.validarEmpleado = [
  body("nombres")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellidos")
    .notEmpty().withMessage("El apellido es obligatorio"),

  body("tipoDocumento")
    .notEmpty().withMessage("El tipo de documento es obligatorio"),

  body("numeroDocumento")
    .notEmpty().withMessage("El número de documento es obligatorio")
    .isNumeric().withMessage("El número de documento debe ser numérico"),

  body("fechaNacimiento")
    .notEmpty().withMessage("La fecha de nacimiento es obligatoria")
    .isISO8601().withMessage("La fecha debe estar en formato válido (YYYY-MM-DD)"),

  body("correo")
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("Debe ser un correo válido"),

  body("telefono")
    .optional()
    .isMobilePhone("es-CO").withMessage("Debe ser un teléfono válido en Colombia"),

  body("salario")
    .optional()
    .isNumeric().withMessage("El salario debe ser numérico")
    .isFloat({ min: 0 }).withMessage("El salario debe ser mayor o igual a 0")
];
