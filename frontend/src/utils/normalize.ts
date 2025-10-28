// First, let's define our types in one place
export type Book = {
  id?: number | string;
  title: string;
  author: { name: string } | null;
  category: { name: string } | null;
  description: string | null;
  image: string | null;
  year: number | string | null;
  // These are for the search results
  matchedField?: string;
  matchedValue?: string;
};

/**
 * Normalizes book data from various API shapes into one
 * consistent 'Book' object.
 */
export function normalizeBook(raw: any): Book {
  if (!raw) {
    // Return a default book structure or null
    return {
      id: undefined,
      title: 'Unknown Title',
      author: null,
      category: null,
      description: null,
      image: null,
      year: null,
    };
  }
  
  // Handle authors/categories that are just strings
  const author = typeof raw.author === 'string' ? { name: raw.author } : (raw.author ?? null);
  // Handle 'genre' as an alias for 'category'
  const category = raw.category ? (typeof raw.category === 'string' ? { name: raw.category } : raw.category) 
                 : (raw.genre ? { name: raw.genre } : null);
  
  return {
    id: raw.id,
    title: raw.title || 'Untitled',
    author: author,
    category: category,
    description: raw.description ?? raw.desc ?? null,
    image: raw.coverUrl ?? raw.image ?? null,
    year: raw.publicationYear ?? raw.year ?? null,
  };
}