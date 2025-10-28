import { IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthorDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Full name of the author' })
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: 'Author bio', description: 'Short biography' })
  @IsOptional()
  @MaxLength(2000)
  bio?: string;
}
