// tests/jwt.test.js
require("dotenv").config();
const { execSync } = require("child_process");

describe("🧠 Test general JWT (SuperAdmin → Admin → Empleado)", () => {
  it("✅ Ejecutar test SuperAdmin", () => {
    console.log("\n🚀 Ejecutando test SuperAdmin...");
    execSync("npm run test:superadmin --silent", { stdio: "inherit" });
  });

  it("✅ Ejecutar test Admin", () => {
    console.log("\n🧩 Ejecutando test Admin...");
    execSync("npm run test:admin --silent", { stdio: "inherit" });
  });

  it("✅ Ejecutar test Empleado", () => {
    console.log("\n👷 Ejecutando test Empleado...");
    execSync("npm run test:empleado --silent", { stdio: "inherit" });
  });
});
