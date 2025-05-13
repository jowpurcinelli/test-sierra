import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('profiles')
export class Profile {
  @ApiProperty({ description: 'The unique identifier of the profile' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The display name of the user', example: 'John Doe' })
  @Column({ nullable: true })
  displayName: string;

  @ApiProperty({ description: 'The bio of the user', example: 'I am a web developer based in New York' })
  @Column({ nullable: true })
  bio: string;

  @ApiProperty({ description: 'The avatar URL of the user', example: 'https://example.com/avatar.jpg' })
  @Column({ nullable: true })
  avatarUrl: string;

  @ApiProperty({ description: 'The accent color of the profile', example: '#6366f1' })
  @Column({ default: '#000000', name: 'accent_color' })
  accentColor: string;

  @ApiProperty({ description: 'Whether the profile is public', example: true, default: true })
  @Column({ default: true })
  isPublic: boolean;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ApiProperty({ description: 'The date the profile was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date the profile was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'The social links of the user', example: { twitter: 'https://twitter.com/username', github: 'https://github.com/username', linkedin: 'https://linkedin.com/in/username' } })
  @Column({ type: 'jsonb', nullable: true })
  socialLinks: Record<string, string>;
} 