#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("🚀 Setting up Task Assessment Repository...");

try {
  // Install all dependencies
  console.log("📦 Installing dependencies...");
  execSync("pnpm install", { stdio: "inherit" });

  // Setup database
  console.log("🗄️ Setting up database...");
  execSync("pnpm --filter server create-table", { stdio: "inherit" });

  // Seed the database
  console.log("🌱 Seeding database with test data...");
  execSync("pnpm --filter server seed", { stdio: "inherit" });

  console.log("✅ Setup complete!");
  console.log("");
  console.log("To start the assessment:");
  console.log("  1. Run 'pnpm dev' to start both servers");
  console.log("  2. Open http://localhost:3001 in your browser");
  console.log("Good luck! 🎯");
} catch (error) {
  console.error("❌ Setup failed:", error.message);
  process.exit(1);
}
