import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'The display name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'I am a web developer based in New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'The avatar URL of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: 'The theme of the profile',
    example: 'dark',
    default: 'default',
    required: false,
  })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({
    description: 'Whether the profile is public',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
} 