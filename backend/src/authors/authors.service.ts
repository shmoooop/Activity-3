import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepo: Repository<Author>,
  ) {}

  create(dto: CreateAuthorDto) {
    if (!dto || !dto.name) throw new BadRequestException('Author name is required');
    const author = this.authorsRepo.create(dto);
    return this.authorsRepo.save(author);
  }

  findAll() {
    return this.authorsRepo.find();
  }

  findOne(id: number) {
    return this.authorsRepo.findOneBy({ id });
  }

  async update(id: number, dto: Partial<CreateAuthorDto>) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException(`Author with id ${id} not found`);
    await this.authorsRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.authorsRepo.delete(id);
  }
}
