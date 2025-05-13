import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';


const envFilePath = path.resolve(process.cwd(), '.env');
const envExamplePath = path.resolve(process.cwd(), '.env.example');


if (!fs.existsSync(envFilePath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envFilePath);
  console.log('Created .env file from .env.example');
}

dotenv.config();


export const env = {
  
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),

  
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_DATABASE: process.env.DB_DATABASE || 'linkhub',
  
  
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refreshsecret_change_in_production',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  
  FRONTEND_URL: process.env.FRONTEND_URL,
  
  
  RATE_LIMIT_TTL: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};
