import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Fiction', description: 'Category name' })
  @IsOptional()
  @MaxLength(200)
  name?: string;
}
