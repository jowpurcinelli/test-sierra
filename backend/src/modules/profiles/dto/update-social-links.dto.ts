import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsUrl, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSocialLinksDto {
  @ApiProperty({
    example: {
      twitter: 'https://twitter.com/username',
      github: 'https://github.com/username',
      linkedin: 'https://linkedin.com/in/username'
    },
    description: 'Social media links',
  })
  @IsObject()
  @Type(() => Object)
  socialLinks: Record<string, string>;
} 