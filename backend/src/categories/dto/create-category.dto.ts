import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fiction', description: 'Category name' })
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
}
