import { Router } from 'express';
import { db } from '../db/index.js';
import { ExchangeProposal } from '../types/index.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';

export const exchangeRoutes = Router();

// Get exchange proposals
exchangeRoutes.get('/', authenticateToken, (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const all = db.getExchanges();
  const userExchanges = all.filter(e => e.senderId === user.id || e.receiverId === user.id);

  res.json({ count: userExchanges.length, exchanges: userExchanges });
});

// Propose a new book trade
exchangeRoutes.post('/propose', authenticateToken, (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const { 
    receiverId, receiverName, offeredBookId, offeredBookTitle, 
    offeredBookImage, requestedBookId, requestedBookTitle, 
    requestedBookImage, message, meetupLocation 
  } = req.body;

  if (!offeredBookId || !requestedBookId) {
    res.status(400).json({ error: 'Offered and requested books are required' });
    return;
  }

  const newProposal: ExchangeProposal = {
    id: `exch-${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    senderCollege: user.collegeName,
    receiverId: receiverId || 'usr-student-1',
    receiverName: receiverName || 'Student Peer',
    offeredBookId,
    offeredBookTitle,
    offeredBookImage: offeredBookImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    requestedBookId,
    requestedBookTitle,
    requestedBookImage: requestedBookImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    message: message || 'Hi! Would love to trade books for this semester course.',
    meetupLocation: meetupLocation || 'Campus Central Library',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const exchanges = db.getExchanges();
  exchanges.unshift(newProposal);
  db.setExchanges(exchanges);

  // Add audit log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    actionType: 'EXCHANGE_PROPOSAL_DISPUTE',
    details: `Trade proposed: ${offeredBookTitle} for ${requestedBookTitle}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.status(201).json({ message: 'Exchange proposal sent successfully', proposal: newProposal });
});

// Update exchange status (accept, reject, counter)
exchangeRoutes.put('/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, counterMessage } = req.body;

  const exchanges = db.getExchanges();
  const index = exchanges.findIndex(e => e.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Exchange proposal not found' });
    return;
  }

  exchanges[index].status = status;
  if (counterMessage) exchanges[index].counterMessage = counterMessage;
  exchanges[index].updatedAt = new Date().toISOString();

  db.setExchanges(exchanges);
  res.json({ message: `Exchange status updated to ${status}`, proposal: exchanges[index] });
});
