import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsNumber, // 1. IMPORT
  IsInt,      // 2. IMPORT
  Min,        // 3. IMPORT
  Max,        // 4. IMPORT
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class BookRelationDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Book', description: 'Title of the book' })
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional({
    example: 'A short description',
    description: 'Book description',
  })
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  // --- ADD THIS PROPERTY ---
  @ApiPropertyOptional({
    example: 2005,
    description: 'Publication year',
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1000)
  @Max(2100)
  year?: number;
  // -------------------------

  @ApiPropertyOptional({
    description: 'Author object',
    example: { name: 'John Doe' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BookRelationDto)
  author?: BookRelationDto;

  @ApiPropertyOptional({
    description: 'Category object',
    example: { name: 'Fiction' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BookRelationDto)
  category?: BookRelationDto;
}