import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepo: Repository<Book>,
    @InjectRepository(Author)
    private authorsRepo: Repository<Author>,
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

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

      const bookDto: CreateBookDto = {
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

  async create(dto: CreateBookDto) {
    if (!dto || !dto.title)
      throw new BadRequestException('Book title is required');

    let author: Author | undefined = undefined;
    if (dto.author && dto.author.name) {
      const name = dto.author.name.trim();
      if (name) {
        author = await this.authorsRepo.findOneBy({ name });
        if (!author) {
          author = await this.authorsRepo.save({ name });
        }
      }
    }

    let category: Category | undefined = undefined;
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

  findAll(searchQuery?: string) {
    if (searchQuery) {
      const searchTerm = `%${searchQuery}%`;
      return this.booksRepo.find({
        where: [
          { title: Like(searchTerm) },
          { description: Like(searchTerm) },
          { author: { name: Like(searchTerm) } },
          { category: { name: Like(searchTerm) } },
        ],
        relations: ['author', 'category'],
      });
    }

    return this.booksRepo.find({ relations: ['author', 'category'] });
  }

  findOne(id: number) {
    return this.booksRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    
    // --- THIS IS THE FIX ---
    // It's now '!book'
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    // -----------------------

    let author: Author | undefined = book.author;
    if (dto.author && dto.author.name) {
      const name = dto.author.name.trim();
      if (name) {
        author = await this.authorsRepo.findOneBy({ name });
        if (!author) {
          author = await this.authorsRepo.save({ name });
        }
      }
    }

    let category: Category | undefined = book.category;
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
      throw new NotFoundException('Book could not be updated');
    }

    return this.booksRepo.save(updatedBook);
  }

  remove(id: number) {
    return this.booksRepo.delete(id);
  }
}