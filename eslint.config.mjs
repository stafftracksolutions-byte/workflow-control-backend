import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  // Configuración base de ESLint para JavaScript
  js.configs.recommended,

  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**"], // 🔹 Ignorar carpetas comunes

    languageOptions: {
      globals: {
        ...globals.node, // ✅ Reconoce process, __dirname, etc.
        ...globals.es2021, // ✅ Reconoce nuevas funciones de ES2021
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      // 🔹 Buenas prácticas
      "no-unused-vars": "warn",
      "no-console": "off", // puedes poner "warn" si luego quieres limitar console.log
      "eqeqeq": ["error", "always"], // obliga a usar === en lugar de ==
      "curly": ["error", "all"], // obliga a usar llaves en bloques if/while/etc.

      // 🔹 Estilo de código
      "semi": ["error", "always"], // obliga a usar ;
      "quotes": ["error", "double"], // fuerza comillas dobles
      "indent": ["error", 2], // indentación de 2 espacios
    },
  },

  // Integración con Prettier (para evitar conflictos)
  prettier,
];
