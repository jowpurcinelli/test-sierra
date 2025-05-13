import { DataSource } from 'typeorm';
import { dropDatabase } from 'typeorm-extension';
import { env } from '../config/environment.config';

async function dropDb() {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
    });

    await dropDatabase({
      options: {
        type: 'postgres',
        database: env.DB_DATABASE,
      },
      ifExist: true,
    });

    console.log(`Database "${env.DB_DATABASE}" dropped successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error dropping database:', error);
    process.exit(1);
  }
}

dropDb(); 