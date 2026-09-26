import { Router } from 'express';
import { db } from '../db/index.js';
import { User, UserRole, MaintenanceState, AuditLog } from '../types/index.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/authMiddleware.js';

export const adminRoutes = Router();

// GET / SET Maintenance Mode
adminRoutes.get('/maintenance', (req, res) => {
  res.json({ maintenance: db.getMaintenanceState() });
});

adminRoutes.post('/maintenance/toggle', authenticateToken, requireRole(['admin']), (req: AuthRequest, res) => {
  const user = req.user!;
  const { isMaintenanceMode, message, estimatedUptime } = req.body;

  const current = db.getMaintenanceState();
  const nextState: MaintenanceState = {
    ...current,
    isMaintenanceMode: Boolean(isMaintenanceMode),
    message: message || current.message,
    estimatedUptime: estimatedUptime || current.estimatedUptime,
    updatedBy: user.name,
    updatedAt: new Date().toISOString()
  };

  db.setMaintenanceState(nextState);

  // Add system audit log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    actionType: 'MAINTENANCE_TOGGLE',
    details: `Maintenance Mode turned ${nextState.isMaintenanceMode ? 'ON' : 'OFF'} by ${user.name}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.json({
    message: `Maintenance mode ${nextState.isMaintenanceMode ? 'enabled' : 'disabled'} successfully`,
    maintenance: nextState
  });
});

// User Management (RBAC)
adminRoutes.get('/users', authenticateToken, requireRole(['admin', 'moderator']), (req, res) => {
  res.json({ users: db.getUsers() });
});

adminRoutes.post('/users', authenticateToken, requireRole(['admin']), (req: AuthRequest, res) => {
  const adminUser = req.user!;
  const { name, email, role, university, collegeName, campusLocation, phone } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  const users = db.getUsers();
  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'student',
    university: university || 'AKTU',
    collegeName: collegeName || 'Institute of Engineering and Technology',
    campusLocation: campusLocation || 'Lucknow, UP',
    phone: phone || '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    walletBalance: 500,
    isBanned: false,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  db.setUsers(users);

  // Log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: adminUser.id,
    actorName: adminUser.name,
    actorRole: adminUser.role,
    actionType: 'USER_CREATE',
    details: `Created user ${newUser.name} with role ${newUser.role}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

adminRoutes.put('/users/:id/role', authenticateToken, requireRole(['admin']), (req: AuthRequest, res) => {
  const adminUser = req.user!;
  const { id } = req.params;
  const { role } = req.body;

  const users = db.getUsers();
  const user = users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.role = role as UserRole;
  db.setUsers(users);

  // Log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: adminUser.id,
    actorName: adminUser.name,
    actorRole: adminUser.role,
    actionType: 'USER_ROLE_CHANGE',
    details: `Updated role of ${user.name} to ${role}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.json({ message: 'User role updated', user });
});

adminRoutes.put('/users/:id/ban', authenticateToken, requireRole(['admin']), (req: AuthRequest, res) => {
  const adminUser = req.user!;
  const { id } = req.params;

  const users = db.getUsers();
  const user = users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.isBanned = !user.isBanned;
  db.setUsers(users);

  // Log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: adminUser.id,
    actorName: adminUser.name,
    actorRole: adminUser.role,
    actionType: user.isBanned ? 'USER_BAN' : 'USER_UNBAN',
    details: `${user.isBanned ? 'Banned' : 'Unbanned'} user ${user.name}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.json({ message: `User ${user.isBanned ? 'banned' : 'reinstated'}`, user });
});

adminRoutes.delete('/users/:id', authenticateToken, requireRole(['admin']), (req: AuthRequest, res) => {
  const adminUser = req.user!;
  const { id } = req.params;

  const users = db.getUsers();
  const target = users.find(u => u.id === id);
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  db.setUsers(users.filter(u => u.id !== id));

  // Log
  const logs = db.getAuditLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorId: adminUser.id,
    actorName: adminUser.name,
    actorRole: adminUser.role,
    actionType: 'USER_DELETE',
    details: `Deleted user account ${target.name}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toLocaleString()
  });
  db.setAuditLogs(logs);

  res.json({ message: 'User account deleted successfully' });
});

// Audit Logs
adminRoutes.get('/logs', authenticateToken, requireRole(['admin']), (req, res) => {
  const actionType = req.query.actionType as string;
  let logs = db.getAuditLogs();
  if (actionType && actionType !== 'all') {
    logs = logs.filter(l => l.actionType === actionType);
  }
  res.json({ count: logs.length, logs });
});

// Platform Analytics & Metrics
adminRoutes.get('/stats', authenticateToken, requireRole(['admin', 'moderator']), (req, res) => {
  const users = db.getUsers();
  const orders = db.getOrders();
  const usedBooks = db.getUsedBooks();
  const exchanges = db.getExchanges();

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalSaved = orders.reduce((acc, o) => acc + o.totalSaved, 0);

  res.json({
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue,
    totalSaved,
    activeUsedListings: usedBooks.filter(b => b.status === 'available').length,
    activeExchanges: exchanges.filter(e => e.status === 'pending').length
  });
});
