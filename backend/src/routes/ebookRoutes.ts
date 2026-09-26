import { Router } from 'express';
import { db } from '../db/index.js';

export const ebookRoutes = Router();

// Get E-Books
ebookRoutes.get('/', (req, res) => {
  const ebooks = db.getEbooks();
  res.json({ count: ebooks.length, ebooks });
});

// Read Sample
ebookRoutes.get('/:id/sample', (req, res) => {
  const { id } = req.params;
  const ebooks = db.getEbooks();
  const found = ebooks.find(e => e.id === id);
  if (!found) {
    res.status(404).json({ error: 'E-Book not found' });
    return;
  }
  res.json({
    id: found.id,
    title: found.title,
    author: found.author,
    previewPages: found.previewPages,
    sampleContent: found.sampleContent
  });
});
