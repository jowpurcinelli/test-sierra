import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'Display name', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ example: 'Web developer and tech enthusiast', description: 'Bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '#3b82f6', description: 'Accent color in hex format', required: false })
  @IsOptional()
  @IsHexColor()
  accentColor?: string;
  
  @ApiProperty({ example: true, description: 'Whether profile is public', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
} 