import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
    ignores: [
      "src/generated/**/*",
      "prisma/**/*",
      "node_modules/**/*",
      ".next/**/*",
      "**/*.js",
      "**/*.mjs",
      "**/runtime/**/*",
      "**/wasm*.js",
      "**/wasm*.mjs",
      "**/wasm-engine*.js",
      "**/wasm-compiler*.js",
      "**/library.js",
      "**/index-browser.js",
      "**/edge.js",
      "**/edge-esm.js",
      "**/default.js",
      "**/client.js",
      "**/index.js",
      "**/binary.js",
      "**/react-native.js",
    ],
  },
];

export default eslintConfig;
