require("dotenv").config();
const { exec } = require("child_process");

async function runSeed(name) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Ejecutando ${name}...`);
    const process = exec(`node seeds/${name}.js`);

    process.stdout.on("data", (data) => console.log(data.toString()));
    process.stderr.on("data", (data) => console.error(data.toString()));

    process.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${name} ejecutado correctamente\n`);
        resolve();
      } else {
        reject(new Error(`${name} falló con código ${code}`));
      }
    });
  });
}

(async () => {
  try {
    await runSeed("seedUsuariosMongo");
    await runSeed("seedEmpleadosMongo");
    console.log("🎉 Todos los seeds ejecutados correctamente ✅");
  } catch (err) {
    console.error("⚠️ Error al ejecutar seeds:", err.message);
  }
})();
