#!/usr/bin/env node

/**
 * Postman Setup Script for Culin Backend API
 *
 * This script helps set up Postman collections and environments
 * Usage: node setup.js
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up Postman for Culin Backend API...\n");

// Check if Postman folder exists
const postmanDir = path.join(__dirname);
if (!fs.existsSync(postmanDir)) {
  console.error("❌ Postman directory not found!");
  process.exit(1);
}

// Check if collections exist
const collectionsDir = path.join(postmanDir, "collections");
const environmentsDir = path.join(postmanDir, "environments");

console.log("📁 Checking folder structure...");

if (!fs.existsSync(collectionsDir)) {
  console.log("📁 Creating collections directory...");
  fs.mkdirSync(collectionsDir, { recursive: true });
}

if (!fs.existsSync(environmentsDir)) {
  console.log("📁 Creating environments directory...");
  fs.mkdirSync(environmentsDir, { recursive: true });
}

// Check if collection file exists
const collectionFile = path.join(
  collectionsDir,
  "Culin-Backend-API.postman_collection.json"
);
if (fs.existsSync(collectionFile)) {
  console.log("✅ Collection file found");
} else {
  console.log(
    "❌ Collection file not found. Please import the collection first."
  );
}

// Check if environment files exist
const localEnvFile = path.join(
  environmentsDir,
  "Local.postman_environment.json"
);
const prodEnvFile = path.join(
  environmentsDir,
  "Production.postman_environment.json"
);

if (fs.existsSync(localEnvFile)) {
  console.log("✅ Local environment file found");
} else {
  console.log("❌ Local environment file not found");
}

if (fs.existsSync(prodEnvFile)) {
  console.log("✅ Production environment file found");
} else {
  console.log("❌ Production environment file not found");
}

console.log("\n📋 Setup Instructions:");
console.log("1. Open Postman");
console.log(
  "2. Import the collection: postman/collections/Culin-Backend-API.postman_collection.json"
);
console.log("3. Import environments:");
console.log("   - Local: postman/environments/Local.postman_environment.json");
console.log(
  "   - Production: postman/environments/Production.postman_environment.json"
);
console.log("4. Select the appropriate environment");
console.log("5. Update the baseUrl variable to match your server");
console.log("6. Start testing with the Login request");

console.log("\n🔗 Useful Links:");
console.log("- API Documentation: ../API_DOCUMENTATION.md");
console.log("- Postman README: postman/README.md");
console.log("- Server Configuration: ../server.js");

console.log("\n✨ Setup complete! Happy testing! 🎉");
