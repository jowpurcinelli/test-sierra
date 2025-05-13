import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class UpdateLinkDto {
  @ApiProperty({ example: 'My GitHub Profile', description: 'Link title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'https://github.com/username', description: 'Link URL', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ example: 'Check out my code repositories', description: 'Link description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, description: 'Whether link is active/visible', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 0, description: 'Display order position', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
} 