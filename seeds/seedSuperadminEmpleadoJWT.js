require("dotenv").config();
const { exec } = require("child_process");

async function runSeed(file) {
  return new Promise((resolve, reject) => {
    const process = exec(`node seeds/${file}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });

    process.stdout.on("data", data => console.log(data));
    process.stderr.on("data", data => console.error(data));
  });
}

(async () => {
  try {
    console.log("🚀 Ejecutando seedSuperadminJWT...");
    await runSeed("seedSuperadminJWT.js");

    console.log("🚀 Ejecutando seedEmpleadoJWT...");
    await runSeed("seedEmpleadoJWT.js");

    console.log("🎉 Todos los seeds JWT ejecutados correctamente ✅");
  } catch (err) {
    console.error("🔴 Error ejecutando seeds:", err);
  }
})();
