import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { AuthRequest } from './authMiddleware.js';

export function maintenanceGuard(req: AuthRequest, res: Response, next: NextFunction): void {
  const state = db.getMaintenanceState();

  if (!state.isMaintenanceMode) {
    return next();
  }

  // Exempt routes
  const path = req.path;
  if (
    path.startsWith('/api/admin/maintenance') ||
    path.startsWith('/api/auth') ||
    path === '/api/health'
  ) {
    return next();
  }

  // Check bypass key
  const bypassHeader = req.headers['x-bypass-key'] as string;
  const bypassQuery = req.query.bypass as string;

  if (
    (bypassHeader && bypassHeader.trim() === state.bypassCode) ||
    (bypassQuery && bypassQuery.trim() === state.bypassCode)
  ) {
    return next();
  }

  // Check if admin user
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  res.status(503).json({
    status: 'SERVICE_UNAVAILABLE',
    isMaintenance: true,
    message: state.message,
    estimatedUptime: state.estimatedUptime,
    updatedAt: state.updatedAt,
    hint: 'Website is currently on hold for maintenance. Use admin credentials or provide x-bypass-key.'
  });
}
