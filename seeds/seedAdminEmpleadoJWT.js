// seeds/seedJWT.js
require("dotenv").config();
const { exec } = require("child_process");

async function runSeed(file) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Ejecutando ${file}...`);
    const process = exec(`node seeds/${file}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`🔴 Error en ${file}:`, error.message);
        reject(error);
        return;
      }
      if (stderr) console.error(stderr);
      console.log(stdout);
      resolve();
    });
  });
}

(async () => {
  try {
    // Ejecutar seedAdminJWT
    await runSeed("seedAdminJWT.js");

    // Ejecutar seedEmpleadoJWT
    await runSeed("seedEmpleadoJWT.js");

    console.log("\n🎉 Todos los seeds JWT ejecutados correctamente ✅");
  } catch (err) {
    console.error("🔴 Error ejecutando seeds JWT:", err);
  }
})();
