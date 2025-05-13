import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LinkOrderItem {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Link ID' })
  id: string;

  @ApiProperty({ example: 0, description: 'New position in the order' })
  order: number;
}

export class ReorderLinksDto {
  @ApiProperty({
    description: 'Array of links with their new order positions',
    type: [LinkOrderItem]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkOrderItem)
  links: LinkOrderItem[];
} 