// utils/dateUtils.js
function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Formatear todas las propiedades que sean fechas en un objeto
function formatObjectDates(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const formatted = { ...obj };
  for (const key in formatted) {
    if (formatted[key] instanceof Date) {
      formatted[key] = formatDate(formatted[key]);
    }
  }
  return formatted;
}

module.exports = { formatDate, formatObjectDates };
