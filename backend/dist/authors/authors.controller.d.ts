import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorsService } from './authors.service';
export declare class AuthorsController {
    private authorsService;
    constructor(authorsService: AuthorsService);
    create(dto: CreateAuthorDto): Promise<import("./author.entity").Author>;
    findAll(): Promise<import("./author.entity").Author[]>;
    findOne(id: string): Promise<import("./author.entity").Author>;
    update(id: string, dto: UpdateAuthorDto): Promise<import("./author.entity").Author>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
