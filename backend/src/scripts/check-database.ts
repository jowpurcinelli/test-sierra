import { DataSource } from 'typeorm';
import { env } from '../config/environment.config';
import { createDatabase } from 'typeorm-extension';
import dataSource from '../config/typeorm.config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Check if PostgreSQL is installed and running
async function checkPostgresRunning(): Promise<boolean> {
  try {
    // First check for Docker postgres container
    try {
      const { stdout } = await execPromise('docker ps --format "{{.Names}}"');
      if (stdout.includes('personal-link-hub-postgres')) {
        console.log('PostgreSQL is running in Docker container');
        return true;
      }
    } catch (dockerError) {
      // Docker check failed, continue to check local PostgreSQL
    }

    if (process.platform === 'darwin') {
      // Check on macOS
      const { stdout } = await execPromise('ps aux | grep postgres[q] || pg_isready');
      return stdout.includes('accepting') || stdout.includes('postgres');
    } else if (process.platform === 'linux') {
      // Check on Linux
      const { stdout } = await execPromise('systemctl status postgresql || pg_isready');
      return stdout.includes('active') || stdout.includes('accepting');
    } else if (process.platform === 'win32') {
      // Check on Windows
      const { stdout } = await execPromise('sc query postgresql || pg_isready');
      return stdout.includes('RUNNING') || stdout.includes('accepting');
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Print helpful installation instructions
function printPostgresInstructions() {
  console.log('\n===========================================================');
  console.log('PostgreSQL is not installed or not running. Please follow these steps:');
  
  if (process.platform === 'darwin') {
    console.log('\nFor macOS:');
    console.log('1. Install PostgreSQL:');
    console.log('   brew install postgresql');
    console.log('2. Start PostgreSQL service:');
    console.log('   brew services start postgresql');
  } else if (process.platform === 'linux') {
    console.log('\nFor Linux:');
    console.log('1. Install PostgreSQL:');
    console.log('   sudo apt update && sudo apt install postgresql postgresql-contrib');
    console.log('2. Start PostgreSQL service:');
    console.log('   sudo systemctl start postgresql');
  } else if (process.platform === 'win32') {
    console.log('\nFor Windows:');
    console.log('1. Download and install PostgreSQL from:');
    console.log('   https://www.postgresql.org/download/windows/');
    console.log('2. Make sure the PostgreSQL service is running from services.msc');
  }
  
  console.log('\nAlternatively, use Docker:');
  console.log('   pnpm run db:docker');
  console.log('\nAfter PostgreSQL is running, try again with:');
  console.log('pnpm run dev');
  console.log('===========================================================\n');
}

async function checkDatabase() {
  // First check if PostgreSQL is running
  const isPostgresRunning = await checkPostgresRunning();
  
  if (!isPostgresRunning) {
    console.log('PostgreSQL server is not running or not installed');
    printPostgresInstructions();
    return false;
  }
  
  try {
    // Attempt to connect to the database
    await dataSource.initialize();
    console.log('Database connection successful, database exists');
    await dataSource.destroy();
    return true;
  } catch (error) {
    console.log('Could not connect to database, attempting to create it...');
    
    try {
      const tempDataSource = new DataSource({
        type: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
      });

      await tempDataSource.initialize();
      console.log('Connected to PostgreSQL server');
      
      await createDatabase({
        options: {
          type: 'postgres',
          database: env.DB_DATABASE,
        },
        ifNotExist: true,
      });

      await tempDataSource.destroy();
      
      console.log(`Database "${env.DB_DATABASE}" created successfully`);
      
      console.log('Running migrations...');
      const child_process = require('child_process');
      child_process.execSync('npm run migration:run', { stdio: 'inherit', shell: true });
      
      console.log('Seeding database...');
      child_process.execSync('npm run db:seed', { stdio: 'inherit', shell: true });
      
      console.log('Database setup complete');
      return true;
    } catch (setupError) {
      console.error('Error setting up database:', setupError);
      
      if (setupError.code === 'ECONNREFUSED') {
        console.error('\nCould not connect to PostgreSQL server. Please check:');
        console.error('1. PostgreSQL is installed and running');
        console.error(`2. You can connect to PostgreSQL at ${env.DB_HOST}:${env.DB_PORT}`);
        console.error('3. The username and password in your .env file are correct');
        printPostgresInstructions();
      }
      
      return false;
    }
  }
}

checkDatabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 