import { Router } from 'express';
import { searchBooksOnline, CURATED_CATALOG } from '../services/googleBooksService.js';
import { db } from '../db/index.js';

export const bookRoutes = Router();

// Real-Time Search with Google Books & Price Aggregator
bookRoutes.get('/search', async (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const category = (req.query.category as string) || 'all';

    const results = await searchBooksOnline(q, category);
    res.json({
      query: q,
      category,
      count: results.length,
      results
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// Curated Catalog
bookRoutes.get('/catalog', (req, res) => {
  res.json({ books: CURATED_CATALOG });
});

// Get Book Details
bookRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const inCurated = CURATED_CATALOG.find(b => b.id === id);
  if (inCurated) {
    res.json({ book: inCurated });
    return;
  }

  const used = db.getUsedBooks().find(b => b.id === id);
  if (used) {
    res.json({ book: used });
    return;
  }

  const ebook = db.getEbooks().find(b => b.id === id);
  if (ebook) {
    res.json({ book: ebook });
    return;
  }

  res.status(404).json({ error: 'Book not found' });
});
