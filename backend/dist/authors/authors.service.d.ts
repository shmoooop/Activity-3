import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './author.entity';
export declare class AuthorsService {
    private authorsRepo;
    constructor(authorsRepo: Repository<Author>);
    create(dto: CreateAuthorDto): Promise<Author>;
    findAll(): Promise<Author[]>;
    findOne(id: number): Promise<Author>;
    update(id: number, dto: Partial<CreateAuthorDto>): Promise<Author>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
