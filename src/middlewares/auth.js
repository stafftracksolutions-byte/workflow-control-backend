const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token no proporcionado"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decodificamos el token y lo asignamos a req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contiene { id, rol, nombre, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido"
    });
  }
};
