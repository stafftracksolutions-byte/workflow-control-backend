// middlewares/errorHandler.js

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log completo en consola (solo servidor, no cliente)
  console.error("❌ Error:", err.stack);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Error interno del servidor",
    details: err.details || {   // 👈 si Joi manda detalles, los mostramos
      method: req.method,
      path: req.originalUrl,
    },
  });
};

module.exports = errorHandler;
