const express = require("express");
const router = express.Router();
const empleadosController = require("../controllers/empleadosController");

const { validarEmpleado } = require("../middlewares/empleadosValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/auth");
const { roleMiddleware, allowSelfOrRoles } = require("../middlewares/roles");
const {
  validarEmpleadoCrear,
  validarEmpleadoActualizar
} = require("../middlewares/empleadosValidatorJoi");

// ========================
// Rutas CRUD de empleados
// ========================

/**
 * @swagger
 * tags:
 *   - name: Empleados
 *     description: Endpoints para gestión de empleados en WORKFLOW CONTROL
 */

/**
 * @swagger
 * /empleados/me:
 *   get:
 *     summary: Obtener los datos del empleado autenticado
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del empleado autenticado
 *       401:
 *         description: No autorizado
 */
router.get(
  "/me",
  authMiddleware,
  allowSelfOrRoles(["admin", "superadmin"]),
  empleadosController.getMisDatos
);

/**
 * @swagger
 * /empleados:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCompleto
 *               - identificacion
 *               - correo
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               identificacion:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               cargo:
 *                 type: string
 *               area:
 *                 type: string
 *               fechaIngreso:
 *                 type: string
 *                 format: date
 *               tipoContrato:
 *                 type: string
 *               salario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  validarEmpleadoCrear,
  validarEmpleado,
  validateRequest,
  empleadosController.crearEmpleado
);

/**
 * @swagger
 * /empleados/{id}:
 *   put:
 *     summary: Actualizar un empleado por ID
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               correo:
 *                 type: string
 *               cargo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               salario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *       404:
 *         description: Empleado no encontrado
 *       401:
 *         description: No autorizado
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  validarEmpleadoActualizar,
  validarEmpleado,
  validateRequest,
  empleadosController.actualizarEmpleado
);

/**
 * @swagger
 * /empleados/{id}:
 *   delete:
 *     summary: Eliminar un empleado por ID
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado a eliminar
 *     responses:
 *       200:
 *         description: Empleado eliminado exitosamente
 *       404:
 *         description: Empleado no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  empleadosController.eliminarEmpleado
);

/**
 * @swagger
 * /empleados:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados
 *       401:
 *         description: No autorizado
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "superadmin"]),
  empleadosController.obtenerEmpleados
);

/**
 * @swagger
 * /empleados/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado a consultar
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *       404:
 *         description: Empleado no encontrado
 *       401:
 *         description: No autorizado
 */
router.get(
  "/:id",
  authMiddleware,
  allowSelfOrRoles(["admin", "superadmin"]),
  empleadosController.getEmpleadoById
);

/**
 * @swagger
 * /empleados:
 *   delete:
 *     summary: Eliminar todos los empleados (solo SuperAdmin)
 *     tags: [Empleados]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todos los empleados eliminados exitosamente
 *       401:
 *         description: No autorizado
 */
router.delete(
  "/",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  empleadosController.eliminarTodos
);

module.exports = router;
