const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function checkIfDockerExists() {
  try {
    const output = execSync("docker --version", { stdio: "pipe" }).toString();
    return output.toLowerCase().includes("docker");
  } catch (error) {
    return false;
  }
}

function checkIfContainerExists() {
  try {
    const output = execSync('docker ps -a --format "{{.Names}}"', {
      stdio: "pipe",
    }).toString();
    return output.includes("personal-link-hub-postgres");
  } catch (error) {
    return false;
  }
}

function checkIfContainerRunning() {
  try {
    const output = execSync('docker ps --format "{{.Names}}"', {
      stdio: "pipe",
    }).toString();
    return output.includes("personal-link-hub-postgres");
  } catch (error) {
    return false;
  }
}

function startPostgresContainer() {
  try {
    if (!checkIfContainerExists()) {
      console.log("Creating PostgreSQL Docker container...");
      execSync(
        "docker run --name personal-link-hub-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=linkhub -p 5432:5432 -d postgres:15-alpine",
        { stdio: "inherit" }
      );
      console.log("PostgreSQL Docker container created successfully");
    } else if (!checkIfContainerRunning()) {
      console.log("Starting existing PostgreSQL Docker container...");
      execSync("docker start personal-link-hub-postgres", { stdio: "inherit" });
      console.log("PostgreSQL Docker container started successfully");
    } else {
      console.log("PostgreSQL Docker container is already running");
    }

    console.log("Waiting for PostgreSQL to be ready...");
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      try {
        execSync("docker exec personal-link-hub-postgres pg_isready", {
          stdio: "pipe",
        });
        console.log("PostgreSQL is ready!");
        return true;
      } catch (error) {
        attempts++;
        console.log(
          `Waiting for PostgreSQL to start... (${attempts}/${maxAttempts})`
        );

        execSync("sleep 1");
      }
    }

    throw new Error("PostgreSQL did not start in the expected time");
  } catch (error) {
    console.error("Error starting PostgreSQL Docker container:", error.message);
    return false;
  }
}

function updateEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    const envExamplePath = path.join(process.cwd(), ".env.example");

    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log("Created .env file from .env.example");
    }

    return true;
  } catch (error) {
    console.error("Error updating .env file:", error.message);
    return false;
  }
}

async function main() {
  try {
    if (!checkIfDockerExists()) {
      console.log(
        "Docker is not installed or not running. Please install Docker to use this script."
      );
      process.exit(1);
    }

    const success = startPostgresContainer();
    if (!success) {
      console.log("Failed to start PostgreSQL in Docker");
      process.exit(1);
    }

    updateEnvFile();

    console.log("\nPostgreSQL is now running in Docker!");
    console.log("Connection details:");
    console.log("  Host: localhost");
    console.log("  Port: 5432");
    console.log("  Username: postgres");
    console.log("  Password: postgres");
    console.log("  Database: linkhub");
    console.log("\nYou can now run: pnpm run dev");

    process.exit(0);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  }
}

main();
