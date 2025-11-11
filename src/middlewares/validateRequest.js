// middlewares/validateRequest.js
const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // filtrar para que quede solo el primer error de cada campo
    const erroresUnicos = [];
    const campos = new Set();

    for (const err of errors.array()) {
      if (!campos.has(err.param)) {
        campos.add(err.param);
        erroresUnicos.push({
          campo: err.param,
          mensaje: err.msg
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
