"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./book.entity");
const author_entity_1 = require("../authors/author.entity");
const category_entity_1 = require("../categories/category.entity");
let BooksService = class BooksService {
    constructor(booksRepo, authorsRepo, categoriesRepo) {
        this.booksRepo = booksRepo;
        this.authorsRepo = authorsRepo;
        this.categoriesRepo = categoriesRepo;
    }
    async seedSample() {
        const samples = [
            { title: 'The Invisible Library', author: 'Ava Martin', category: 'Fantasy', description: 'A librarian travels between alternate realities to collect dangerous books.' },
            { title: 'Practical TypeScript', author: 'Samir Patel', category: 'Programming', description: 'A hands-on guide to TypeScript and modern web development practices.' },
            { title: 'Gardens of Light', author: 'Lena Ortiz', category: 'Non-fiction', description: 'A photography-led exploration of gardens around the world.' },
            { title: 'Algorithms Unlocked', author: 'Kenji Yamamoto', category: 'Programming', description: 'Clear explanations of algorithms for everyday use and interviews.' },
            { title: 'Sea of Tranquility', author: 'R. K. Vaughn', category: 'Science Fiction', description: 'A near-future tale about memory, time, and human connection.' },
            { title: 'Minimal Home', author: 'Iris Coleman', category: 'Design', description: 'Practical tips for living better with less and designing calm spaces.' },
            { title: 'The Last Orchard', author: 'Miguel Santos', category: 'Fiction', description: 'A multi-generational family saga anchored around an orchard.' },
            { title: 'Cooking From Memory', author: 'Anya Kovalenko', category: 'Cooking', description: "Recipes inspired by the author's childhood and travels." },
            { title: 'Crypto Basics', author: 'D. R. Coleman', category: 'Finance', description: 'A beginner-friendly introduction to blockchain and crypto concepts.' },
            { title: "Stargazer's Guide", author: 'Helena Park', category: 'Science', description: 'An illustrated guide to the night sky for urban stargazers.' },
        ];
        const created = [];
        for (const s of samples) {
            let author = await this.authorsRepo.findOneBy({ name: s.author });
            if (!author) {
                author = await this.authorsRepo.save({ name: s.author });
            }
            let category = await this.categoriesRepo.findOneBy({ name: s.category });
            if (!category) {
                category = await this.categoriesRepo.save({ name: s.category });
            }
            const bookDto = {
                title: s.title,
                description: s.description,
                author: { name: author.name },
                category: { name: category.name },
            };
            const book = await this.create(bookDto);
            created.push(book);
        }
        return { createdCount: created.length, books: created };
    }
    async create(dto) {
        if (!dto || !dto.title)
            throw new common_1.BadRequestException('Book title is required');
        let author = undefined;
        if (dto.author && dto.author.name) {
            const name = dto.author.name.trim();
            if (name) {
                author = await this.authorsRepo.findOneBy({ name });
                if (!author) {
                    author = await this.authorsRepo.save({ name });
                }
            }
        }
        let category = undefined;
        if (dto.category && dto.category.name) {
            const name = dto.category.name.trim();
            if (name) {
                category = await this.categoriesRepo.findOneBy({ name });
                if (!category) {
                    category = await this.categoriesRepo.save({ name });
                }
            }
        }
        const book = this.booksRepo.create({
            title: dto.title,
            description: dto.description,
            year: dto.year,
            author: author,
            category: category,
        });
        return this.booksRepo.save(book);
    }
    findAll(searchQuery) {
        if (searchQuery) {
            const searchTerm = `%${searchQuery}%`;
            return this.booksRepo.find({
                where: [
                    { title: (0, typeorm_2.Like)(searchTerm) },
                    { description: (0, typeorm_2.Like)(searchTerm) },
                    { author: { name: (0, typeorm_2.Like)(searchTerm) } },
                    { category: { name: (0, typeorm_2.Like)(searchTerm) } },
                ],
                relations: ['author', 'category'],
            });
        }
        return this.booksRepo.find({ relations: ['author', 'category'] });
    }
    findOne(id) {
        return this.booksRepo.findOne({
            where: { id },
            relations: ['author', 'category'],
        });
    }
    async update(id, dto) {
        const book = await this.findOne(id);
        if (!book)
            throw new common_1.NotFoundException(`Book with id ${id} not found`);
        let author = book.author;
        if (dto.author && dto.author.name) {
            const name = dto.author.name.trim();
            if (name) {
                author = await this.authorsRepo.findOneBy({ name });
                if (!author) {
                    author = await this.authorsRepo.save({ name });
                }
            }
        }
        let category = book.category;
        if (dto.category && dto.category.name) {
            const name = dto.category.name.trim();
            if (name) {
                category = await this.categoriesRepo.findOneBy({ name });
                if (!category) {
                    category = await this.categoriesRepo.save({ name });
                }
            }
        }
        const updatedBook = await this.booksRepo.preload({
            id: book.id,
            title: dto.title,
            description: dto.description,
            year: dto.year,
            author: author,
            category: category,
        });
        if (!updatedBook) {
            throw new common_1.NotFoundException('Book could not be updated');
        }
        return this.booksRepo.save(updatedBook);
    }
    remove(id) {
        return this.booksRepo.delete(id);
    }
};
BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(1, (0, typeorm_1.InjectRepository)(author_entity_1.Author)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BooksService);
exports.BooksService = BooksService;
//# sourceMappingURL=books.service.js.map