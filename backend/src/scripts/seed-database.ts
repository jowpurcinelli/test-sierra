import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { env } from '../config/environment.config';
import dataSource from '../config/typeorm.config';

async function seedDb() {
  try {
    await dataSource.initialize();
    console.log('Data source initialized');

    const userRepository = dataSource.getRepository('User');
    
    const adminExists = await userRepository.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      await userRepository.save({
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        isActive: true,
      });
      
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    
    console.log('Database seeded successfully');
    await dataSource.destroy();
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seedDb(); 