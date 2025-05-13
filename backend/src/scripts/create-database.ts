import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import { env } from '../config/environment.config';

async function createDb() {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
    });

    await createDatabase({
      options: {
        type: 'postgres',
        database: env.DB_DATABASE,
      },
      ifNotExist: true,
    });

    console.log(`Database "${env.DB_DATABASE}" created successfully or already exists`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDb(); 