#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Fonction pour lister tous les fichiers TypeScript/TSX dans src, sauf generated
function getSourceFiles() {
  const srcDir = path.join(process.cwd(), "src");
  const files = [];

  function walkDir(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Ignorer le dossier generated
        if (item === "generated") {
          continue;
        }
        walkDir(fullPath);
      } else if (
        stat.isFile() &&
        (item.endsWith(".ts") || item.endsWith(".tsx"))
      ) {
        files.push(fullPath);
      }
    }
  }

  walkDir(srcDir);
  return files;
}

// Obtenir les fichiers source
const sourceFiles = getSourceFiles();

if (sourceFiles.length === 0) {
  console.log("Aucun fichier source trouvé.");
  process.exit(0);
}

// Exécuter ESLint sur les fichiers source uniquement
try {
  const command = `npx eslint ${sourceFiles.join(" ")}`;
  console.log("Exécution du linter sur les fichiers source uniquement...");
  execSync(command, { stdio: "inherit" });
  console.log("✅ Linter terminé avec succès !");
} catch (error) {
  console.error("Erreur lors de l'exécution du linter:", error);
  console.error("❌ Erreurs de linting détectées.");
  process.exit(1);
}
