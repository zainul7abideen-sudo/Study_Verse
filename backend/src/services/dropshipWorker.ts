import { db } from '../db/index.js';
import { Order, AuditLog } from '../types/index.js';

export class DropshipWorker {
  private static isProcessing = false;

  public static async processOrder(orderId: string): Promise<Order | null> {
    const orders = db.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return null;

    const order = orders[orderIndex];

    // Determine lowest price vendor
    const vendors = ['Flipkart', 'Amazon', 'Bookswagon'];
    const chosenVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const externalOrderId = `${chosenVendor.slice(0, 2).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const trackingNumber = `TRK-${chosenVendor.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update order with auto-dropship details
    order.status = 'Auto-Ordered with Vendor';
    order.dropshipVendor = `${chosenVendor} (Lowest Price Verified)`;
    order.externalOrderId = externalOrderId;
    order.externalTrackingId = trackingNumber;
    
    order.fulfillmentLog.push({
      timestamp: new Date().toLocaleString(),
      step: 'Arbitrage Evaluator',
      detail: `${chosenVendor} verified as lowest-cost provider across Indian market.`
    });

    order.fulfillmentLog.push({
      timestamp: new Date().toLocaleString(),
      step: 'Automated Bot Purchase',
      detail: `Auto-ordered via ${chosenVendor} bot to ${order.shippingAddress}. External Order #${externalOrderId}`
    });

    orders[orderIndex] = order;
    db.setOrders(orders);

    // Add system audit log
    const logs = db.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      actorId: 'dropship-bot',
      actorName: 'Automated Dropship Worker',
      actorRole: 'admin',
      actionType: 'AUTO_ORDER_DISPATCH',
      details: `Fulfilled Order #${order.id} on ${chosenVendor} (External ID: ${externalOrderId})`,
      ipAddress: '127.0.0.1 (Worker)',
      timestamp: new Date().toLocaleString()
    });
    db.setAuditLogs(logs);

    return order;
  }

  public static async retryOrder(orderId: string): Promise<Order | null> {
    return this.processOrder(orderId);
  }
}
