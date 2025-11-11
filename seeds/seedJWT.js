// seeds/seedAllJWT.js
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
    // 1️⃣ Superadmin
    await runSeed("seedSuperadminJWT.js");

    // 2️⃣ Admin
    await runSeed("seedAdminJWT.js");

    // 3️⃣ Empleado
    await runSeed("seedEmpleadoJWT.js");

    console.log("\n🎉 Todos los seeds JWT ejecutados correctamente ✅");
  } catch (err) {
    console.error("🔴 Error ejecutando seeds JWT:", err);
  }
})();
