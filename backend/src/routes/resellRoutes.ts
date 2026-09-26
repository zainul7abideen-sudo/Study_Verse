import { Router } from 'express';
import { db } from '../db/index.js';
import { Book } from '../types/index.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

export const resellRoutes = Router();

// Get all available used resale books
resellRoutes.get('/', (req, res) => {
  const books = db.getUsedBooks();
  const condition = req.query.condition as string;
  const university = req.query.university as string;

  let filtered = books.filter(b => b.status === 'available');
  if (condition && condition !== 'all') {
    filtered = filtered.filter(b => b.condition === condition);
  }
  if (university && university !== 'all') {
    filtered = filtered.filter(b => b.sellerUniversity === university);
  }

  res.json({ count: filtered.length, books: filtered });
});

// Create new used book listing
resellRoutes.post('/', authenticateToken, (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const { 
    title, author, isbn, category, description, coverImage, 
    condition, resalePrice, originalMrp, isAvailableForExchange, 
    exchangeTargetDesc 
  } = req.body;

  if (!title || !author || !resalePrice) {
    res.status(400).json({ error: 'Title, author, and resale price are required' });
    return;
  }

  const newBook: Book = {
    id: `used-${Date.now()}`,
    title,
    author,
    isbn: isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    category: category || 'Computer Science & IT',
    description: description || 'Used semester textbook in good condition.',
    coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    rating: 5.0,
    type: 'used_resale',
    sellerId: user.id,
    sellerName: user.name,
    sellerCampus: user.collegeName,
    sellerUniversity: user.university,
    condition: condition || 'Like New',
    resalePrice: parseFloat(resalePrice),
    originalMrp: originalMrp ? parseFloat(originalMrp) : parseFloat(resalePrice) * 2,
    isAvailableForExchange: Boolean(isAvailableForExchange),
    exchangeTargetDesc: isAvailableForExchange ? exchangeTargetDesc : undefined,
    status: 'available',
    createdAt: new Date().toISOString()
  };

  const usedBooks = db.getUsedBooks();
  usedBooks.unshift(newBook);
  db.setUsedBooks(usedBooks);

  // Add audit log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    actionType: 'LISTING_MODERATION',
    details: `Created used book listing "${newBook.title}" (₹${newBook.resalePrice})`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.status(201).json({ message: 'Listing created successfully', book: newBook });
});

// Update listing status
resellRoutes.put('/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const usedBooks = db.getUsedBooks();
  const index = usedBooks.findIndex(b => b.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Book listing not found' });
    return;
  }

  usedBooks[index].status = status;
  db.setUsedBooks(usedBooks);

  res.json({ message: 'Status updated', book: usedBooks[index] });
});

// Delete listing
resellRoutes.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const usedBooks = db.getUsedBooks();
  const filtered = usedBooks.filter(b => b.id !== id);

  if (filtered.length === usedBooks.length) {
    res.status(404).json({ error: 'Book listing not found' });
    return;
  }

  db.setUsedBooks(filtered);
  res.json({ message: 'Book listing deleted successfully' });
});
