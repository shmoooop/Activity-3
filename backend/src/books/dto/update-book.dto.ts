import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

// This automatically takes all properties from our NEW CreateBookDto
// and makes them optional (including the new author/category objects).
export class UpdateBookDto extends PartialType(CreateBookDto) {}