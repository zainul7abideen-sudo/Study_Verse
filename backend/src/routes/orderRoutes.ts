import { Router } from 'express';
import { db } from '../db/index.js';
import { Order, OrderItem } from '../types/index.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';
import { DropshipWorker } from '../services/dropshipWorker.js';
import { sendOrderReceiptEmail, sendCancellationNoticeEmail } from '../services/emailService.js';

export const orderRoutes = Router();

// Get User Orders
orderRoutes.get('/', authenticateToken, (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const allOrders = db.getOrders();
  
  if (user.role === 'admin' || user.role === 'moderator') {
    res.json({ count: allOrders.length, orders: allOrders });
    return;
  }

  const userOrders = allOrders.filter(o => o.userId === user.id);
  res.json({ count: userOrders.length, orders: userOrders });
});

// Checkout Order & Trigger Lowest-Price Dropship Bot
orderRoutes.post('/checkout', authenticateToken, async (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const { 
    items, shippingAddress, collegeCampus, paymentMethod, 
    phone, couponCode 
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Cart items cannot be empty' });
    return;
  }

  const subtotal = items.reduce((acc: number, i: OrderItem) => acc + (i.price * i.quantity), 0);
  const discount = couponCode?.toUpperCase() === 'STUDENT15' ? Math.round(subtotal * 0.15) : 0;
  const totalAmount = Math.max(0, subtotal - discount);
  const totalSaved = Math.round(subtotal * 0.35 + discount);
  const orderId = `SSS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: phone || user.phone || '+91 98765 43210',
    shippingAddress: shippingAddress || 'Campus Hostel Room',
    collegeCampus: collegeCampus || user.collegeName,
    items,
    subtotal,
    discount,
    shippingFee: 0,
    totalAmount,
    totalSaved,
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: paymentMethod === 'Cash on Campus Handover' ? 'Pending Handover' : 'Paid',
    status: 'Payment Verified',
    fulfillmentLog: [
      {
        timestamp: new Date().toLocaleString(),
        step: 'Payment Verified',
        detail: `Confirmed transaction for ₹${totalAmount} via ${paymentMethod}`
      }
    ],
    createdAt: new Date().toISOString()
  };

  const orders = db.getOrders();
  orders.unshift(newOrder);
  db.setOrders(orders);

  // Send Order Confirmation Email via EmailJS
  const itemsSummary = items.map((it: OrderItem) => `${it.title} (x${it.quantity}) - ₹${it.price * it.quantity}`).join(', ');
  sendOrderReceiptEmail(user.email, user.name, {
    orderId,
    totalAmount,
    itemsList: itemsSummary,
    shippingAddress: newOrder.shippingAddress
  }).catch(err => console.warn('Order receipt email background warning:', err));

  // Trigger Asynchronous Dropshipping Auto-Order Worker
  setTimeout(async () => {
    try {
      await DropshipWorker.processOrder(orderId);
    } catch (err) {
      console.error('Dropship worker error:', err);
    }
  }, 2500);

  res.status(201).json({
    message: 'Order created and dropship auto-order queued successfully',
    order: newOrder
  });
});

// Cancel Entire Order
orderRoutes.post('/:id/cancel', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = req.user || db.getUsers()[0];

  const orders = db.getOrders();
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const targetOrder = orders[orderIndex];

  // If already cancelled or delivered
  if (targetOrder.status === 'Cancelled' || targetOrder.status === 'Delivered') {
    res.status(400).json({ error: `Cannot cancel an order with status "${targetOrder.status}"` });
    return;
  }

  const cancelReason = reason || 'Cancelled by student';
  const refundAmount = targetOrder.totalAmount;

  targetOrder.status = 'Cancelled';
  targetOrder.paymentStatus = 'Refunded';
  targetOrder.cancellationReason = cancelReason;
  targetOrder.cancelledAt = new Date().toISOString();
  targetOrder.items = targetOrder.items.map(i => ({ ...i, itemStatus: 'Cancelled', cancellationReason: cancelReason }));
  targetOrder.fulfillmentLog.push({
    timestamp: new Date().toLocaleString(),
    step: 'Order Cancelled',
    detail: `Order cancelled. Reason: "${cancelReason}". ₹${refundAmount} refunded to student wallet.`
  });

  orders[orderIndex] = targetOrder;
  db.setOrders(orders);

  // Refund to user wallet in DB
  const users = db.getUsers();
  const userObj = users.find(u => u.id === targetOrder.userId || u.id === user.id);
  if (userObj) {
    userObj.walletBalance = (userObj.walletBalance || 0) + refundAmount;
    db.setUsers(users);
  }

  // Dispatch EmailJS cancellation notice
  sendCancellationNoticeEmail(
    targetOrder.userEmail || user.email,
    targetOrder.userName || user.name,
    targetOrder.id,
    refundAmount,
    cancelReason
  ).catch(err => console.warn('Cancel email notice background warning:', err));

  res.json({
    message: `Order #${id} cancelled and ₹${refundAmount} refunded.`,
    order: targetOrder,
    walletBalance: userObj ? userObj.walletBalance : undefined
  });
});

// Cancel Specific Order Item
orderRoutes.post('/:id/cancel-item', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { itemId, reason } = req.body;
  const user = req.user || db.getUsers()[0];

  if (!itemId) {
    res.status(400).json({ error: 'itemId is required' });
    return;
  }

  const orders = db.getOrders();
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const targetOrder = orders[orderIndex];
  const item = targetOrder.items.find(i => i.id === itemId);

  if (!item) {
    res.status(404).json({ error: 'Order item not found' });
    return;
  }

  if (item.itemStatus === 'Cancelled') {
    res.status(400).json({ error: 'Item is already cancelled' });
    return;
  }

  const cancelReason = reason || 'Item cancelled by student';
  const refundAmount = item.price * item.quantity;

  targetOrder.items = targetOrder.items.map(i => {
    if (i.id === itemId) {
      return { ...i, itemStatus: 'Cancelled' as const, cancellationReason: cancelReason };
    }
    return i;
  });

  const allCancelled = targetOrder.items.every(i => i.itemStatus === 'Cancelled');
  if (allCancelled) {
    targetOrder.status = 'Cancelled';
    targetOrder.paymentStatus = 'Refunded';
  }

  targetOrder.fulfillmentLog.push({
    timestamp: new Date().toLocaleString(),
    step: 'Item Cancelled',
    detail: `Item "${item.title}" cancelled. Reason: "${cancelReason}". ₹${refundAmount} refunded.`
  });

  orders[orderIndex] = targetOrder;
  db.setOrders(orders);

  // Refund to user wallet
  const users = db.getUsers();
  const userObj = users.find(u => u.id === targetOrder.userId || u.id === user.id);
  if (userObj) {
    userObj.walletBalance = (userObj.walletBalance || 0) + refundAmount;
    db.setUsers(users);
  }

  // Dispatch EmailJS cancellation notice
  sendCancellationNoticeEmail(
    targetOrder.userEmail || user.email,
    targetOrder.userName || user.name,
    targetOrder.id,
    refundAmount,
    `Item: ${item.title} - ${cancelReason}`
  ).catch(err => console.warn('Cancel item email notice warning:', err));

  res.json({
    message: `Item "${item.title}" cancelled and ₹${refundAmount} credited to student wallet.`,
    order: targetOrder,
    walletBalance: userObj ? userObj.walletBalance : undefined
  });
});

// Retry Failed Auto-Order
orderRoutes.post('/:id/retry', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updated = await DropshipWorker.retryOrder(id);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json({ message: 'Auto-order execution re-processed', order: updated });
});
