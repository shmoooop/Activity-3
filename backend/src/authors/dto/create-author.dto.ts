import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the author' })
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: 'Author bio', description: 'Short biography' })
  @IsOptional()
  @MaxLength(2000)
  bio?: string;
}
