import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  // --- ADD THIS COLUMN ---
  @Column({ type: 'int', nullable: true })
  year?: number;
  // -----------------------

  @ManyToOne(() => Author, (author) => author.books, { nullable: true })
  author: Author;

  @ManyToOne(() => Category, (category) => category.books, { nullable: true })
  category: Category;
}