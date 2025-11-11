// src/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para login y registro de usuarios en WORKFLOW CONTROL
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión con correo y contraseña
 *     tags: [Autenticación]
 *     description: Retorna un token JWT válido para acceder a las rutas protegidas del sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: superadmin@demo.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    const user = await Usuario.findOne({ correo: correo.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const match = await user.compararPassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol,
        nombre: `${user.nombre} ${user.apellido}`,
        correo: user.correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuevo usuario en el sistema
 *     tags: [Autenticación]
 *     description: Crea un nuevo usuario con los datos proporcionados. La contraseña se encripta automáticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - correo
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Andrés
 *               apellido:
 *                 type: string
 *                 example: Villamil
 *               correo:
 *                 type: string
 *                 example: demo@correo.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               rol:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 66c0d81c4e39f1f1f9a9e77b
 *                     correo:
 *                       type: string
 *                       example: demo@correo.com
 *                     rol:
 *                       type: string
 *                       example: admin
 *                     nombre:
 *                       type: string
 *                       example: Andrés
 *                     apellido:
 *                       type: string
 *                       example: Villamil
 *       400:
 *         description: Correo ya registrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", async (req, res, next) => {
  try {
    const { nombre, apellido, correo, password, rol } = req.body;

    const existe = await Usuario.findOne({ correo: correo.toLowerCase().trim() });
    if (existe) {
      return res.status(400).json({ success: false, message: "Correo ya registrado" });
    }

    const user = await Usuario.create({ nombre, apellido, correo, password, rol });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        correo: user.correo,
        rol: user.rol,
        nombre: user.nombre,
        apellido: user.apellido,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
