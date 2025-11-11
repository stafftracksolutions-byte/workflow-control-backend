// app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const empleadosRoutes = require("./routes/empleados");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/auth");

const app = express();

/* =====================================================
   🔹 Configuración de Swagger (Documentación Interactiva)
   ===================================================== */
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const swaggerBase = require("./docs/swagger.json");

const swaggerOptions = {
  definition: { ...swaggerBase },
  apis: [path.join(__dirname, "./routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Servir Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =====================================================
   🔹 Middlewares globales
   ===================================================== */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* =====================================================
   🔹 Ruta base
   ===================================================== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 API de Workflow Control funcionando correctamente",
  });
});

/* =====================================================
   🔹 Versionado API
   ===================================================== */

app.use("/api/v1", authRoutes);

app.use("/api/v1/empleados", empleadosRoutes);

/* =====================================================
   🔹 Manejadores de errores
   ===================================================== */
app.use((req, res, next) => {
  const err = new Error("Ruta no encontrada");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

/* =====================================================
   🔹 Inicializar servidor y base de datos
   ===================================================== */
const PORT = process.env.PORT || 3000;

(async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📘 Swagger UI: http://localhost:${PORT}/api-docs`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️  Recibido ${signal}. Cerrando servidor...`);
      server.close(() => {
        console.log("Servidor cerrado correctamente.");
        process.exit(0);
      });
      setTimeout(() => {
        console.error("Cierre forzado por timeout.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (err) {
    console.error("🔴 Error iniciando la aplicación:", err);
    process.exit(1);
  }
})();


// exportar app para pruebas u otros usos
module.exports = app;
