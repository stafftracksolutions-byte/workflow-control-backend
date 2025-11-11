// utils/emailUtils.js

// Validar formato de correo
function validateEmail(email) {
  if (!email) return false;
  // Regex simple para validar emails
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Normalizar correo (minúsculas y quitar espacios)
function normalizeEmail(email) {
  if (!email) return null;
  return email.trim().toLowerCase();
}

module.exports = { validateEmail, normalizeEmail };
