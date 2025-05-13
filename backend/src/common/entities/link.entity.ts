import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('links')
export class Link {
  @ApiProperty({ description: 'The unique identifier of the link' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The title of the link', example: 'My Website' })
  @Column()
  title: string;

  @ApiProperty({ description: 'The URL of the link', example: 'https://example.com' })
  @Column()
  url: string;

  @ApiProperty({ description: 'An optional description of the link', example: 'My personal website' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Whether the link is active and visible', example: true, default: false })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({ description: 'The order position of the link', example: 0, default: 0 })
  @Column({ default: 0 })
  order: number;

  @ApiProperty({ description: 'The number of times the link has been clicked', example: 0, default: 0 })
  @Column({ default: 0 })
  clickCount: number;

  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: 'The date the link was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date the link was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
} 