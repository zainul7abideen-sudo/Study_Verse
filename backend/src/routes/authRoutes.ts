import { Router } from 'express';
import { db } from '../db/index.js';
import { User } from '../types/index.js';
import { generateToken, AuthRequest, authenticateToken } from '../middleware/authMiddleware.js';

export const authRoutes = Router();

// Login / Demo Authenticate
authRoutes.post('/login', (req, res) => {
  const { email } = req.body;
  const users = db.getUsers();
  
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
  
  if (user.isBanned) {
    res.status(403).json({ error: 'This user account is banned. Contact campus administration.' });
    return;
  }

  const token = generateToken(user);
  res.json({
    message: 'Authentication successful',
    token,
    user
  });
});

// Register
authRoutes.post('/register', (req, res) => {
  const { name, email, university, collegeName, campusLocation, phone, role } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const users = db.getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'User with this email already exists' });
    return;
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'student',
    university: university || 'AKTU',
    collegeName: collegeName || 'Institute of Engineering and Technology',
    campusLocation: campusLocation || 'Main Campus',
    phone: phone || '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    walletBalance: 500,
    isBanned: false,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  db.setUsers(users);

  const token = generateToken(newUser);
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: newUser
  });
});

// Get Current User
authRoutes.get('/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Update Profile
authRoutes.put('/profile', (req, res) => {
  const { userId, ...updates } = req.body;
  const users = db.getUsers();
  const index = users.findIndex(u => u.id === userId || (req.headers['x-user-id'] && u.id === req.headers['x-user-id']));
  
  if (index === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;
  db.setUsers(users);

  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

// Top Up Campus Wallet
authRoutes.post('/wallet-topup', (req, res) => {
  const { userId, amount, paymentMethod } = req.body;
  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Valid amount is required' });
    return;
  }

  const users = db.getUsers();
  const index = users.findIndex(u => u.id === userId || (req.headers['x-user-id'] && u.id === req.headers['x-user-id']));
  
  if (index === -1) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  users[index].walletBalance = (users[index].walletBalance || 0) + Number(amount);
  db.setUsers(users);

  res.json({
    message: `Successfully topped up ₹${amount} via ${paymentMethod || 'UPI'}`,
    newBalance: users[index].walletBalance,
    user: users[index]
  });
});

// Get Users List
authRoutes.get('/users', (req, res) => {
  res.json({ users: db.getUsers() });
});

