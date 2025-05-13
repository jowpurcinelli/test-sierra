const { execSync, spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const execPromise = promisify(exec);

// Check if .env file exists and create it if needed
function ensureEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log("Creating .env file from .env.example...");
    fs.copyFileSync(envExamplePath, envPath);
    console.log(".env file created successfully");
  }
}

// Check if Docker is available
function isDockerAvailable() {
  try {
    execSync("docker --version", {
      stdio: "pipe",
      shell: true,
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if PostgreSQL container is running
function isPostgresDockerRunning() {
  try {
    const output = execSync('docker ps --format "{{.Names}}"', {
      stdio: "pipe",
      shell: true,
    }).toString();
    return output.includes("personal-link-hub-postgres");
  } catch (error) {
    return false;
  }
}

// Try to set up PostgreSQL using Docker
async function setupDockerPostgres() {
  try {
    console.log(
      "Docker is available. Attempting to set up PostgreSQL using Docker..."
    );

    // Check if the container exists but is not running
    const containerExists = execSync('docker ps -a --format "{{.Names}}"', {
      stdio: "pipe",
      shell: true,
    })
      .toString()
      .includes("personal-link-hub-postgres");

    if (containerExists && !isPostgresDockerRunning()) {
      console.log("Starting existing PostgreSQL container...");
      execSync("docker start personal-link-hub-postgres", {
        stdio: "inherit",
        shell: true,
      });
    } else if (!containerExists) {
      console.log("Creating new PostgreSQL container...");
      execSync(
        "docker run --name personal-link-hub-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=linkhub -p 5432:5432 -d postgres:15-alpine",
        {
          stdio: "inherit",
          shell: true,
        }
      );
    }

    // Wait for PostgreSQL to be ready
    console.log("Waiting for PostgreSQL to be ready...");
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      try {
        execSync("docker exec personal-link-hub-postgres pg_isready", {
          stdio: "pipe",
          shell: true,
        });
        console.log("PostgreSQL Docker container is ready!");
        return true;
      } catch (error) {
        attempts++;
        console.log(
          `Waiting for PostgreSQL to be ready... (${attempts}/${maxAttempts})`
        );
        await sleep(1); // Wait 1 second using the cross-platform sleep function
      }
    }

    throw new Error("PostgreSQL in Docker did not start in the expected time");
  } catch (error) {
    console.error("Failed to set up PostgreSQL using Docker:", error.message);
    return false;
  }
}

function suggestPostgresOptions() {
  console.log("\n===========================================================");
  console.log("PostgreSQL Connection Error");
  console.log("===========================================================");

  // If Docker isn't available, suggest installing it
  if (!isDockerAvailable()) {
    console.log("\nOption 1: Install Docker (recommended)");
    console.log(
      "1. Install Docker from: https://www.docker.com/products/docker-desktop"
    );
    console.log("2. After installation, run:");
    console.log("  pnpm run dev");
  } else {
    console.log("\nDocker is available but failed to set up PostgreSQL.");
    console.log("You can try running the Docker setup manually:");
    console.log("  pnpm run db:docker");
    console.log("\nThen run:");
    console.log("  pnpm run dev");
  }

  console.log("\nOption 2: Install PostgreSQL locally");
  console.log("1. Download and install PostgreSQL from:");
  console.log("   https://www.postgresql.org/download/");
  console.log('2. Create a database named "linkhub"');
  console.log(
    "3. Update your .env file with the correct PostgreSQL credentials"
  );
  console.log("4. Run:");
  console.log("  pnpm run dev");
  console.log("===========================================================\n");
}

// Try to run the database check script
function tryDatabaseCheck() {
  try {
    execSync(
      "ts-node -r tsconfig-paths/register ./src/scripts/check-database.ts",
      {
        stdio: "inherit",
      }
    );
    return true;
  } catch (error) {
    return false;
  }
}

// Wait for a few seconds to ensure the database is ready
function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// Main function
async function main() {
  console.log("Starting development setup...");

  // Ensure .env file exists
  ensureEnvFile();

  // Try to connect to database
  console.log("Checking if database is accessible...");
  let dbReady = tryDatabaseCheck();

  // If database check fails and Docker is available, try to set up PostgreSQL using Docker
  if (!dbReady && isDockerAvailable()) {
    console.log(
      "Database not accessible. Docker is available, trying to set up PostgreSQL..."
    );
    const dockerSetupSuccessful = await setupDockerPostgres();

    if (dockerSetupSuccessful) {
      console.log(
        "Docker PostgreSQL setup successful. Waiting a moment for the database to be fully ready..."
      );
      await sleep(3); // Wait 3 seconds for PostgreSQL to be fully ready

      // Check database again after Docker setup
      console.log("Checking database connection again...");
      dbReady = tryDatabaseCheck();

      // If still not ready, try running migrations
      if (!dbReady) {
        console.log(
          "Database created but might need schema setup. Trying to run migrations..."
        );
        try {
          execSync("npm run migration:run", { stdio: "inherit", shell: true });
          execSync("npm run db:seed", { stdio: "inherit", shell: true });
          dbReady = true;
        } catch (migrationError) {
          console.error("Failed to run migrations:", migrationError.message);
        }
      }
    }
  }

  if (dbReady) {
    console.log("Database is ready. Starting development server...");

    // Start NestJS in watch mode
    const nestProcess = spawn("npx", ["nest", "start", "--watch"], {
      stdio: "inherit",
      shell: true,
    });

    nestProcess.on("close", (code) => {
      process.exit(code);
    });

    process.on("SIGINT", () => {
      nestProcess.kill("SIGINT");
    });

    process.on("SIGTERM", () => {
      nestProcess.kill("SIGTERM");
    });
  } else {
    console.error("Failed to setup database. Cannot start development server.");

    // Provide helpful suggestions
    suggestPostgresOptions();

    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
