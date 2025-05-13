import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../common/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    this.logger.log(`Fetching user by ID: ${id}`);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User with ID "${id}" not found`);
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.log(`Fetching user by email: ${email}`);
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(`User with email "${email}" not found`);
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    this.logger.log(`Fetching user by username: ${username}`);
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.warn(`User with username "${username}" not found`);
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.log(`Creating new user with username: ${userData.username}`);
    
    const emailExists = await this.usersRepository.findOne({ 
      where: { email: userData.email } 
    });
    if (emailExists) {
      this.logger.warn(`Email ${userData.email} already in use`);
      throw new ConflictException(`Email already in use`);
    }

    const usernameExists = await this.usersRepository.findOne({ 
      where: { username: userData.username } 
    });
    if (usernameExists) {
      this.logger.warn(`Username ${userData.username} already taken`);
      throw new ConflictException(`Username already taken`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    this.logger.log(`User created successfully with ID: ${savedUser.id}`);
    return savedUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.findById(id);
    
    if (userData.password) {
      this.logger.log('Updating password');
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    Object.assign(user, userData);
    const updatedUser = await this.usersRepository.save(user);
    this.logger.log(`User updated successfully with ID: ${id}`);
    return updatedUser;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    this.logger.log(`Updating refresh token for user with ID: ${userId}`);
    let hashedRefreshToken = null;
    
    if (refreshToken) {
      const salt = await bcrypt.genSalt();
      hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    }
    
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
    this.logger.log(`Refresh token updated for user with ID: ${userId}`);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`User with ID "${id}" not found during deletion`);
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.logger.log(`User with ID: ${id} successfully removed`);
  }
} 