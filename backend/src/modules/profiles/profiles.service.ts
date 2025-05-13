import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../common/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { pipeline } from 'stream/promises';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async findOne(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }

    return profile;
  }

  async findByUsername(username: string): Promise<Profile> {
    const profile = await this.profilesRepository
      .createQueryBuilder('profile')
      .innerJoin('profile.user', 'user')
      .where('user.username = :username', { username })
      .getOne();

    if (!profile) {
      throw new NotFoundException(`Profile for username ${username} not found`);
    }

    return profile;
  }

  async create(userId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profilesRepository.create({
      ...createProfileDto,
      user: { id: userId },
    });

    return this.profilesRepository.save(profile);
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(userId);

    
    Object.assign(profile, updateProfileDto);

    return this.profilesRepository.save(profile);
  }

  async uploadAvatar(userId: string, request: FastifyRequest): Promise<Profile> {
    const profile = await this.findOne(userId);
    
    
    const data = await request.file();
    
    if (!data) {
      throw new BadRequestException('No file uploaded');
    }
    
    
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }
    
    
    const publicPath = path.join(process.cwd(), 'public');
    const avatarsDir = path.join(publicPath, 'uploads', 'avatars');
    
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }
    
    
    const fileExt = path.extname(data.filename) || '.png';
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(avatarsDir, fileName);
    
    
    const writeStream = fs.createWriteStream(filePath);
    try {
      await pipeline(data.file, writeStream);
      
      
      profile.avatarUrl = `/uploads/avatars/${fileName}`;
      return this.profilesRepository.save(profile);
      
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async updateSocialLinks(userId: string, updateSocialLinksDto: UpdateSocialLinksDto): Promise<Profile> {
    const profile = await this.findOne(userId);

    profile.socialLinks = updateSocialLinksDto.socialLinks;

    return this.profilesRepository.save(profile);
  }
} 