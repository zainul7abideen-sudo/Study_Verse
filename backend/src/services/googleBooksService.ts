import axios from 'axios';
import { Book, VendorPrice, BookCategory } from '../types/index.js';

// In-memory cache for fast response times (<100ms)
const searchCache = new Map<string, { timestamp: number; data: Book[] }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins

export const CURATED_CATALOG: Book[] = [
  {
    id: 'b-001',
    title: 'Operating System Concepts (10th Edition)',
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    isbn: '978-1119456339',
    edition: '10th Global Edition',
    publisher: 'Wiley',
    category: 'Computer Science & IT',
    description: 'The definitive textbook on operating systems, providing a solid theoretical foundation of processes, threads, synchronization, memory management, and file systems with Linux and Windows examples.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingsCount: 3420,
    pages: 976,
    type: 'aggregated_new',
    prices: [
      { vendor: 'Amazon', price: 799, originalPrice: 999, inStock: true, deliveryDays: 2, url: 'https://amazon.in', isLowest: false },
      { vendor: 'Flipkart', price: 680, originalPrice: 999, inStock: true, deliveryDays: 3, url: 'https://flipkart.com', isLowest: true },
      { vendor: 'Bookswagon', price: 745, originalPrice: 999, inStock: true, deliveryDays: 4, url: 'https://bookswagon.com', isLowest: false },
      { vendor: 'SSS Marketplace', price: 699, originalPrice: 999, inStock: true, deliveryDays: 1, url: '#', isLowest: false }
    ],
    lowestPrice: 680,
    status: 'available',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'b-002',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    isbn: '978-0262046305',
    edition: '4th Edition',
    publisher: 'MIT Press / PHI',
    category: 'Computer Science & IT',
    description: 'Universally acclaimed algorithms bible covering dynamic programming, graph algorithms, greedy heuristics, multithreaded algorithms, and NP-completeness.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingsCount: 5210,
    pages: 1312,
    type: 'aggregated_new',
    prices: [
      { vendor: 'Amazon', price: 920, originalPrice: 1450, inStock: true, deliveryDays: 2, url: 'https://amazon.in', isLowest: true },
      { vendor: 'Flipkart', price: 980, originalPrice: 1450, inStock: true, deliveryDays: 3, url: 'https://flipkart.com', isLowest: false },
      { vendor: 'Bookswagon', price: 1050, originalPrice: 1450, inStock: true, deliveryDays: 5, url: 'https://bookswagon.com', isLowest: false },
    ],
    lowestPrice: 920,
    status: 'available',
    createdAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'b-003',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    isbn: '978-9389588859',
    edition: '7th Edition (Indian Adaptation)',
    publisher: 'McGraw Hill',
    category: 'Computer Science & IT',
    description: 'Comprehensive guide to relational models, SQL, indexing, transaction processing, concurrency control, distributed databases, and modern NoSQL systems.',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e37271?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    ratingsCount: 1890,
    pages: 1376,
    type: 'aggregated_new',
    prices: [
      { vendor: 'Amazon', price: 710, originalPrice: 895, inStock: true, deliveryDays: 2, url: 'https://amazon.in', isLowest: false },
      { vendor: 'Flipkart', price: 645, originalPrice: 895, inStock: true, deliveryDays: 2, url: 'https://flipkart.com', isLowest: true },
      { vendor: 'Bookswagon', price: 680, originalPrice: 895, inStock: true, deliveryDays: 4, url: 'https://bookswagon.com', isLowest: false },
    ],
    lowestPrice: 645,
    status: 'available',
    createdAt: '2026-09-03T09:30:00Z'
  },
  {
    id: 'b-005',
    title: 'Higher Engineering Mathematics',
    author: 'Dr. B.S. Grewal',
    isbn: '978-8193328491',
    edition: '44th Edition',
    publisher: 'Khanna Publishers',
    category: 'Basic Sciences & Math',
    description: 'The standard reference for engineering math across all Indian universities covering calculus, linear algebra, Laplace transforms, and numerical methods.',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingsCount: 8900,
    pages: 1320,
    type: 'aggregated_new',
    prices: [
      { vendor: 'Amazon', price: 580, originalPrice: 750, inStock: true, deliveryDays: 2, url: 'https://amazon.in', isLowest: false },
      { vendor: 'Flipkart', price: 520, originalPrice: 750, inStock: true, deliveryDays: 2, url: 'https://flipkart.com', isLowest: true },
      { vendor: 'Bookswagon', price: 560, originalPrice: 750, inStock: true, deliveryDays: 3, url: 'https://bookswagon.com', isLowest: false },
    ],
    lowestPrice: 520,
    status: 'available',
    createdAt: '2026-09-05T08:00:00Z'
  }
];

export async function searchBooksOnline(query: string, categoryFilter?: string): Promise<Book[]> {
  if (!query || query.trim().length === 0) {
    return categoryFilter && categoryFilter !== 'all' 
      ? CURATED_CATALOG.filter(b => b.category === categoryFilter)
      : CURATED_CATALOG;
  }

  const cacheKey = `${query.toLowerCase().trim()}_${categoryFilter || 'all'}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const cleanQ = query.trim().toLowerCase();
  const localMatches = CURATED_CATALOG.filter(b => 
    b.title.toLowerCase().includes(cleanQ) ||
    b.author.toLowerCase().includes(cleanQ) ||
    b.category.toLowerCase().includes(cleanQ) ||
    b.isbn.includes(cleanQ)
  );

  try {
    const resp = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: { q: query, maxResults: 12 },
      timeout: 4000
    });

    const items = resp.data.items || [];
    const apiBooks: Book[] = items.map((item: any, idx: number) => {
      const vol = item.volumeInfo || {};
      const isbnObj = vol.industryIdentifiers?.find((i: any) => i.type.includes('13')) || vol.industryIdentifiers?.[0];
      const isbn = isbnObj ? isbnObj.identifier : `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const baseMrp = vol.pageCount ? Math.min(1800, Math.max(350, Math.round(vol.pageCount * 0.85))) : Math.floor(450 + Math.random() * 400);
      const amzPrice = Math.round(baseMrp * (0.75 + (idx % 3) * 0.05));
      const fkPrice = Math.round(baseMrp * (0.70 + ((idx + 1) % 3) * 0.06));
      const bwPrice = Math.round(baseMrp * (0.80 + ((idx + 2) % 3) * 0.04));
      const lowest = Math.min(amzPrice, fkPrice, bwPrice);

      const prices: VendorPrice[] = [
        { vendor: 'Amazon', price: amzPrice, originalPrice: baseMrp, inStock: true, deliveryDays: 2, url: 'https://amazon.in', isLowest: amzPrice === lowest },
        { vendor: 'Flipkart', price: fkPrice, originalPrice: baseMrp, inStock: true, deliveryDays: 3, url: 'https://flipkart.com', isLowest: fkPrice === lowest },
        { vendor: 'Bookswagon', price: bwPrice, originalPrice: baseMrp, inStock: true, deliveryDays: 4, url: 'https://bookswagon.com', isLowest: bwPrice === lowest },
        { vendor: 'SSS Marketplace', price: Math.round(lowest * 0.95), originalPrice: baseMrp, inStock: true, deliveryDays: 1, url: '#', isLowest: false }
      ];

      let category: BookCategory = 'Computer Science & IT';
      const catStr = (vol.categories?.join(' ') || vol.description || '').toLowerCase();
      if (catStr.includes('math') || catStr.includes('physic') || catStr.includes('chem')) category = 'Basic Sciences & Math';
      else if (catStr.includes('mech') || catStr.includes('thermo')) category = 'Mechanical Engineering';
      else if (catStr.includes('medic') || catStr.includes('pharma') || catStr.includes('anat')) category = 'Medical & Dental';
      else if (catStr.includes('manage') || catStr.includes('financ') || catStr.includes('econ')) category = 'Commerce & MBA';
      else if (catStr.includes('law') || catStr.includes('sociol') || catStr.includes('politi')) category = 'Law & Humanities';
      else if (catStr.includes('gate') || catStr.includes('upsc') || catStr.includes('cat')) category = 'Competitive Exams (GATE/CAT/UPSC)';

      return {
        id: `gbook-${item.id || idx}`,
        title: vol.title || 'Academic Textbook',
        author: vol.authors ? vol.authors.join(', ') : 'Academic Scholar',
        isbn: isbn,
        edition: vol.publishedDate ? `${vol.publishedDate.slice(0, 4)} Edition` : 'Latest Edition',
        publisher: vol.publisher || 'Standard Academic Press',
        category,
        description: vol.description || 'Standard prescribed textbook for university courses and competitive examinations.',
        coverImage: vol.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        rating: vol.averageRating || (4.2 + (idx % 8) * 0.1),
        ratingsCount: vol.ratingsCount || Math.floor(150 + Math.random() * 800),
        pages: vol.pageCount || 480,
        type: 'aggregated_new',
        prices,
        lowestPrice: lowest,
        status: 'available',
        createdAt: new Date().toISOString()
      };
    });

    const combined = [...localMatches];
    apiBooks.forEach(ab => {
      if (!combined.some(b => b.isbn === ab.isbn || b.title.toLowerCase() === ab.title.toLowerCase())) {
        combined.push(ab);
      }
    });

    searchCache.set(cacheKey, { timestamp: Date.now(), data: combined });
    return combined;
  } catch (err) {
    console.error('Google Books API error, returning local matches:', err);
    return localMatches.length > 0 ? localMatches : CURATED_CATALOG;
  }
}
