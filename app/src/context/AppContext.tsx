import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Book, ExchangeProposal, Order, OrderItem,
  AuditLog, MaintenanceState, AcademicRecord, ExchangeStatus, ThemeMode,
  WalletTransaction
} from '../types';
import { 
  INITIAL_USERS, INITIAL_USED_BOOKS, INITIAL_EBOOKS,
  INITIAL_EXCHANGES, INITIAL_ORDERS, INITIAL_AUDIT_LOGS,
  INITIAL_MAINTENANCE, INITIAL_WALLET_TRANSACTIONS
} from '../services/initialData';
import { searchGoogleBooks, CURATED_CATALOG } from '../services/bookSearchService';
import { 
  sendVerificationOtpEmail, 
  sendOrderConfirmationEmail, 
  sendCancellationEmail 
} from '../services/emailService';
import confetti from 'canvas-confetti';

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

interface CartItem extends OrderItem {}

interface AppContextType {
  // User & Auth
  currentUser: User;
  users: User[];
  switchUser: (userId: string) => void;
  logoutUser: () => void;
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'walletBalance' | 'isBanned'>) => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleBanUser: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Wallet & Transactions
  walletTransactions: WalletTransaction[];
  topUpWallet: (amount: number, method?: string) => void;
  addWalletTransaction: (tx: Omit<WalletTransaction, 'id' | 'timestamp'>) => void;

  // Maintenance Mode Guard
  maintenanceState: MaintenanceState;
  isBypassed: boolean;
  toggleMaintenanceMode: (enabled: boolean, message?: string, uptime?: string) => void;
  bypassMaintenance: (code: string) => boolean;


  // Books & Catalog
  catalogBooks: Book[];
  usedBooks: Book[];
  ebooks: Book[];
  searchQuery: string;
  searchResults: Book[];
  isSearching: boolean;
  setSearchQuery: (q: string) => void;
  performSearch: (q: string) => Promise<void>;
  addUsedBook: (book: Omit<Book, 'id' | 'type' | 'rating' | 'status' | 'createdAt'>) => void;
  updateUsedBookStatus: (bookId: string, status: Book['status']) => void;
  deleteUsedBook: (bookId: string) => void;

  // Exchanges
  exchanges: ExchangeProposal[];
  createExchangeProposal: (proposal: Omit<ExchangeProposal, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateExchangeStatus: (id: string, status: ExchangeStatus, counterMessage?: string) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSavings: number;
  checkoutOrder: (shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    campus: string;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Campus Handover';
    couponCode?: string;
  }) => Promise<Order>;

  // Orders & Dropshipping Fulfillment
  orders: Order[];
  retryAutoOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], logDetail?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
  cancelOrderItem: (orderId: string, itemId: string, reason?: string) => Promise<boolean>;

  // Email Verification
  sendEmailOtp: (email?: string) => Promise<{ success: boolean; demoOtp: string }>;
  verifyEmail: (code: string) => Promise<{ success: boolean; message: string }>;

  // E-Reader
  activeEbook: Book | null;
  openEbookReader: (ebook: Book) => void;
  closeEbookReader: () => void;

  // Academic Records
  savedRecords: AcademicRecord[];
  saveAcademicRecord: (record: Omit<AcademicRecord, 'id' | 'calculatedAt'>) => void;
  deleteAcademicRecord: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: AuditLog['actionType'], details: string) => void;

  // Theme & Appearance
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Notifications
  notifications: NotificationToast[];
  addToast: (type: NotificationToast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or Fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sss_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('sss_current_user_id') || 'usr-student-1';
  });

  const [maintenanceState, setMaintenanceState] = useState<MaintenanceState>(() => {
    const saved = localStorage.getItem('sss_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [isBypassed, setIsBypassed] = useState<boolean>(false);

  const [usedBooks, setUsedBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('sss_used_books');
    return saved ? JSON.parse(saved) : INITIAL_USED_BOOKS;
  });

  const [ebooks] = useState<Book[]>(INITIAL_EBOOKS);
  const [catalogBooks] = useState<Book[]>(CURATED_CATALOG);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Book[]>(CURATED_CATALOG);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [exchanges, setExchanges] = useState<ExchangeProposal[]>(() => {
    const saved = localStorage.getItem('sss_exchanges');
    return saved ? JSON.parse(saved) : INITIAL_EXCHANGES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sss_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sss_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('sss_wallet_transactions');
    return saved ? JSON.parse(saved) : INITIAL_WALLET_TRANSACTIONS;
  });

  const [savedRecords, setSavedRecords] = useState<AcademicRecord[]>(() => {
    const saved = localStorage.getItem('sss_academic_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sss_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [activeEbook, setActiveEbook] = useState<Book | null>(null);

  // Theme state for 5. Minimal SaaS (Clean & Modern)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sss_theme') as ThemeMode;
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const setTheme = (mode: ThemeMode) => {
    const nextMode: ThemeMode = mode === 'dark' ? 'dark' : 'light';
    setThemeState(nextMode);
    localStorage.setItem('sss_theme', nextMode);
    if (nextMode === 'dark') {
      document.documentElement.className = 'dark theme-dark';
    } else {
      document.documentElement.className = 'theme-light';
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.className = 'dark theme-dark';
    } else {
      document.documentElement.className = 'theme-light';
    }
  }, [theme]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('sss_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('sss_current_user_id', currentUserId); }, [currentUserId]);
  useEffect(() => { localStorage.setItem('sss_wallet_transactions', JSON.stringify(walletTransactions)); }, [walletTransactions]);
  useEffect(() => { localStorage.setItem('sss_maintenance', JSON.stringify(maintenanceState)); }, [maintenanceState]);
  useEffect(() => { localStorage.setItem('sss_used_books', JSON.stringify(usedBooks)); }, [usedBooks]);
  useEffect(() => { localStorage.setItem('sss_exchanges', JSON.stringify(exchanges)); }, [exchanges]);
  useEffect(() => { localStorage.setItem('sss_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('sss_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('sss_academic_records', JSON.stringify(savedRecords)); }, [savedRecords]);
  useEffect(() => { localStorage.setItem('sss_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Helper Toast
  const addToast = (type: NotificationToast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, type, title, message, timestamp: new Date().toLocaleTimeString() };
    setNotifications(prev => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setNotifications(prev => prev.filter(t => t.id !== id));
  };

  // Helper Audit Log
  const addAuditLog = (actionType: AuditLog['actionType'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actionType,
      details,
      ipAddress: '192.168.1.' + Math.floor(100 + Math.random() * 50),
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // User Management
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      addToast('info', 'User Switched', `Logged in as ${target.name} (${target.role.toUpperCase()})`);
    }
  };

  const logoutUser = () => {
    const guestUser = users.find(u => u.role === 'student') || users[0];
    setCurrentUserId(guestUser.id);
    localStorage.removeItem('sss_current_user_id');
    addToast('info', 'Signed Out', 'You have been logged out of your student account.');
    setIsAuthModalOpen(true);
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'walletBalance' | 'isBanned'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      walletBalance: 500,
      isBanned: false,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('USER_CREATE', `Created new user ${newUser.name} with role ${newUser.role}`);
    addToast('success', 'User Created', `Added ${newUser.name} (${newUser.role})`);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...updatedData };
      }
      return u;
    }));
    addAuditLog('USER_ROLE_CHANGE' as any, `Updated profile details for ${currentUser.name}`);
    addToast('success', 'Profile Updated', 'Student credentials & academic details updated successfully.');
    
    // Sync with backend API
    fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
      body: JSON.stringify({ userId: currentUser.id, ...updatedData })
    }).catch(() => {});
  };

  const addWalletTransaction = (tx: Omit<WalletTransaction, 'id' | 'timestamp'>) => {
    const newTx: WalletTransaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  const topUpWallet = (amount: number, method: string = 'Instant UPI') => {
    if (amount <= 0) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, walletBalance: u.walletBalance + amount };
      }
      return u;
    }));
    addWalletTransaction({
      userId: currentUser.id,
      type: 'credit',
      category: 'wallet_topup',
      title: `${method} Recharge`,
      amount,
      description: `Added ₹${amount} to Campus Wallet balance via ${method}`,
      status: 'Completed',
      referenceId: `TOP-${Date.now().toString().slice(-6)}`
    });
    addToast('success', 'Wallet Topped Up', `₹${amount} added to your campus wallet via ${method}!`);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });

    fetch('http://localhost:5000/api/auth/wallet-topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
      body: JSON.stringify({ userId: currentUser.id, amount, paymentMethod: method })
    }).catch(() => {});
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const target = users.find(u => u.id === userId);
    addAuditLog('USER_ROLE_CHANGE', `Updated role of ${target?.name || userId} to ${newRole}`);
    addToast('info', 'Role Updated', `Changed role to ${newRole.toUpperCase()}`);
  };

  const toggleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextBanned = !u.isBanned;
        addAuditLog(nextBanned ? 'USER_BAN' : 'USER_UNBAN', `${nextBanned ? 'Banned' : 'Unbanned'} user ${u.name}`);
        addToast(nextBanned ? 'warning' : 'info', nextBanned ? 'User Banned' : 'User Reinstated', `${u.name}`);
        return { ...u, isBanned: nextBanned };
      }
      return u;
    }));
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog('USER_DELETE', `Deleted user ${target?.name || userId}`);
    addToast('warning', 'User Deleted', `Removed account of ${target?.name}`);
  };

  // Maintenance Guard
  const toggleMaintenanceMode = (enabled: boolean, message?: string, uptime?: string) => {

    setMaintenanceState(prev => {
      const next: MaintenanceState = {
        ...prev,
        isMaintenanceMode: enabled,
        message: message || prev.message,
        estimatedUptime: uptime || prev.estimatedUptime,
        updatedBy: currentUser.name,
        updatedAt: new Date().toISOString()
      };
      addAuditLog('MAINTENANCE_TOGGLE', `Maintenance mode set to ${enabled ? 'ENABLED' : 'DISABLED'} by ${currentUser.name}`);
      addToast(enabled ? 'warning' : 'success', 'System State Updated', `Maintenance Mode is now ${enabled ? 'ON' : 'OFF'}`);
      return next;
    });
  };

  const bypassMaintenance = (code: string) => {
    if (code.trim() === maintenanceState.bypassCode || currentUser.role === 'admin') {
      setIsBypassed(true);
      addToast('success', 'Bypass Granted', 'Admin / Dev bypass activated');
      return true;
    }
    addToast('error', 'Bypass Failed', 'Invalid security access code');
    return false;
  };

  // Search Engine
  const performSearch = async (q: string) => {
    setIsSearching(true);
    try {
      const results = await searchGoogleBooks(q);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // P2P Used Books
  const addUsedBook = (bookData: Omit<Book, 'id' | 'type' | 'rating' | 'status' | 'createdAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: `used-${Date.now()}`,
      type: 'used_resale',
      rating: 5.0,
      status: 'available',
      createdAt: new Date().toISOString()
    };
    setUsedBooks(prev => [newBook, ...prev]);
    addAuditLog('LISTING_MODERATION', `User ${currentUser.name} listed "${newBook.title}" for ₹${newBook.resalePrice}`);
    addToast('success', 'Book Listed!', `Your book is now live on the campus marketplace.`);
  };

  const updateUsedBookStatus = (bookId: string, status: Book['status']) => {
    setUsedBooks(prev => prev.map(b => b.id === bookId ? { ...b, status } : b));
  };

  const deleteUsedBook = (bookId: string) => {
    setUsedBooks(prev => prev.filter(b => b.id !== bookId));
    addToast('info', 'Listing Removed', 'Book listing deleted.');
  };

  // P2P Exchanges
  const createExchangeProposal = (proposalData: Omit<ExchangeProposal, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newProposal: ExchangeProposal = {
      ...proposalData,
      id: `exch-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExchanges(prev => [newProposal, ...prev]);
    addAuditLog('EXCHANGE_PROPOSAL_DISPUTE', `Exchange proposed by ${proposalData.senderName} to ${proposalData.receiverName} for ${proposalData.requestedBookTitle}`);
    addToast('success', 'Exchange Proposed!', `Your trade request has been sent to ${proposalData.receiverName}.`);
  };

  const updateExchangeStatus = (id: string, status: ExchangeStatus, counterMessage?: string) => {
    setExchanges(prev => prev.map(ex => {
      if (ex.id === id) {
        return {
          ...ex,
          status,
          counterMessage: counterMessage || ex.counterMessage,
          updatedAt: new Date().toISOString()
        };
      }
      return ex;
    }));
    addToast('info', 'Trade Status Updated', `Exchange proposal is now marked as ${status.toUpperCase()}.`);
  };

  // Cart Management
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.bookId === item.bookId && i.type === item.type);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, { ...item, id: `cart-${Date.now()}-${Math.random()}` }];
    });
    addToast('success', 'Added to Cart', `${item.title} added.`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const cartSavings = cart.reduce((acc, i) => {
    const mrp = i.price * 1.35;
    return acc + ((mrp - i.price) * i.quantity);
  }, 0);

  // Unified Checkout & Dropship Worker Simulation
  const checkoutOrder = async (shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    campus: string;
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Campus Handover';
    couponCode?: string;
  }): Promise<Order> => {
    const discount = shippingDetails.couponCode?.toUpperCase() === 'STUDENT15' ? Math.round(cartTotal * 0.15) : 0;
    const finalAmount = Math.max(0, cartTotal - discount);
    const orderId = `SSS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      userName: shippingDetails.name,
      userEmail: shippingDetails.email,
      userPhone: shippingDetails.phone,
      shippingAddress: shippingDetails.address,
      collegeCampus: shippingDetails.campus,
      items: [...cart],
      subtotal: cartTotal,
      discount,
      shippingFee: 0,
      totalAmount: finalAmount,
      totalSaved: Math.round(cartSavings + discount),
      paymentMethod: shippingDetails.paymentMethod,
      paymentStatus: shippingDetails.paymentMethod === 'Cash on Campus Handover' ? 'Pending Handover' : 'Paid',
      status: 'Payment Verified',
      fulfillmentLog: [
        {
          timestamp: new Date().toLocaleTimeString(),
          step: 'Payment Verified',
          detail: `Transaction confirmed for ₹${finalAmount} via ${shippingDetails.paymentMethod}`
        }
      ],
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    addToast('success', 'Order Confirmed!', `Order #${orderId} placed successfully.`);
    addAuditLog('AUTO_ORDER_DISPATCH', `Order #${orderId} created for ${shippingDetails.name} (Amount: ₹${finalAmount})`);

    // Dispatch EmailJS Order Confirmation Receipt (Template: template_wd31c8a)
    const itemsSummary = cart.map(i => `${i.title} (x${i.quantity}) - ₹${i.price * i.quantity}`).join(', ');
    sendOrderConfirmationEmail(shippingDetails.email, shippingDetails.name, {
      orderId,
      totalAmount: finalAmount,
      itemsList: itemsSummary,
      shippingAddress: shippingDetails.address
    }).catch(err => console.warn('Order confirmation email warning:', err));

    // ASYNC DROPSHIP BOT SIMULATION (Real-time automated purchasing from lowest external vendor)
    setTimeout(() => {
      const vendors = ['Flipkart', 'Amazon', 'Bookswagon'];
      const chosenVendor = vendors[Math.floor(Math.random() * vendors.length)];
      const extOrderId = `${chosenVendor.slice(0, 2).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const extTracking = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Auto-Ordered with Vendor',
            dropshipVendor: `${chosenVendor} (Lowest Price Auto-Selected)`,
            externalOrderId: extOrderId,
            externalTrackingId: extTracking,
            fulfillmentLog: [
              ...o.fulfillmentLog,
              {
                timestamp: new Date().toLocaleTimeString(),
                step: 'Arbitrage Evaluator',
                detail: `Identified ${chosenVendor} as lowest priced source. Instant savings locked.`
              },
              {
                timestamp: new Date().toLocaleTimeString(),
                step: 'Automated Bot Purchase',
                detail: `Auto-ordered on ${chosenVendor} with recipient address. External Order ID: #${extOrderId}`
              }
            ]
          };
        }
        return o;
      }));

      addToast('info', 'Auto-Order Fulfilled', `Order #${orderId} was automatically purchased from ${chosenVendor} at the lowest price!`);
    }, 3500);

    return newOrder;
  };

  const retryAutoOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Auto-Ordered with Vendor',
          fulfillmentLog: [
            ...o.fulfillmentLog,
            {
              timestamp: new Date().toLocaleTimeString(),
              step: 'Admin Retry Triggered',
              detail: 'Fulfillment queue reprocessed successfully.'
            }
          ]
        };
      }
      return o;
    }));
    addToast('info', 'Fulfillment Retried', `Order #${orderId} auto-order re-queued.`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], logDetail?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          fulfillmentLog: logDetail ? [
            ...o.fulfillmentLog,
            {
              timestamp: new Date().toLocaleTimeString(),
              step: `Status: ${status}`,
              detail: logDetail
            }
          ] : o.fulfillmentLog
        };
      }
      return o;
    }));
  };

  const cancelOrder = async (orderId: string, reason: string = 'Cancelled by student'): Promise<boolean> => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;
    if (target.status === 'Cancelled' || target.status === 'Delivered') {
      addToast('warning', 'Action Not Allowed', `Order #${orderId} cannot be cancelled.`);
      return false;
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled',
          paymentStatus: 'Refunded',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
          items: o.items.map(item => ({ ...item, itemStatus: 'Cancelled', cancellationReason: reason })),
          fulfillmentLog: [
            ...o.fulfillmentLog,
            {
              timestamp: new Date().toLocaleTimeString(),
              step: 'Order Cancelled',
              detail: `Order cancelled by student. Reason: "${reason}". Amount ₹${o.totalAmount} refunded to campus wallet.`
            }
          ]
        };
      }
      return o;
    }));

    // Refund amount to user wallet
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, walletBalance: u.walletBalance + target.totalAmount };
      }
      return u;
    }));

    // Dispatch EmailJS Cancellation & Refund Notice (Template: template_wd31c8a)
    sendCancellationEmail(
      target.userEmail || currentUser.email,
      target.userName || currentUser.name,
      target.id,
      target.totalAmount,
      reason
    ).catch(err => console.warn('Cancel email notice warning:', err));

    addAuditLog('AUTO_ORDER_DISPATCH', `Order #${orderId} cancelled by ${currentUser.name}. Refund ₹${target.totalAmount} credited.`);
    addToast('success', 'Order Cancelled & Refunded', `Order #${orderId} cancelled. ₹${target.totalAmount} refunded to your wallet!`);
    return true;
  };

  const cancelOrderItem = async (orderId: string, itemId: string, reason: string = 'Item cancelled by student'): Promise<boolean> => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;
    const item = target.items.find(i => i.id === itemId);
    if (!item) return false;

    const refundAmount = item.price * item.quantity;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(i => {
          if (i.id === itemId) {
            return { ...i, itemStatus: 'Cancelled' as const, cancellationReason: reason };
          }
          return i;
        });
        const allCancelled = updatedItems.every(i => i.itemStatus === 'Cancelled');
        return {
          ...o,
          status: allCancelled ? 'Cancelled' : o.status,
          paymentStatus: allCancelled ? 'Refunded' : o.paymentStatus,
          items: updatedItems,
          fulfillmentLog: [
            ...o.fulfillmentLog,
            {
              timestamp: new Date().toLocaleTimeString(),
              step: 'Item Cancelled',
              detail: `Item "${item.title}" cancelled. Reason: "${reason}". ₹${refundAmount} refunded.`
            }
          ]
        };
      }
      return o;
    }));

    // Refund item amount to wallet
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, walletBalance: u.walletBalance + refundAmount };
      }
      return u;
    }));

    // Dispatch EmailJS Cancellation notice
    sendCancellationEmail(
      target.userEmail || currentUser.email,
      target.userName || currentUser.name,
      target.id,
      refundAmount,
      `Item: ${item.title} - ${reason}`
    ).catch(err => console.warn('Cancel item email notice warning:', err));

    addToast('success', 'Item Cancelled', `"${item.title}" cancelled. ₹${refundAmount} credited back to your wallet.`);
    return true;
  };

  // Email Verification Flow
  const [currentOtpCode, setCurrentOtpCode] = useState<string>('482910');

  const sendEmailOtp = async (email?: string): Promise<{ success: boolean; demoOtp: string }> => {
    const targetEmail = email || currentUser.email;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentOtpCode(generatedOtp);

    // Dispatch EmailJS OTP Verification (Template: template_ebe35xs)
    sendVerificationOtpEmail(
      targetEmail,
      currentUser.name || 'Student',
      generatedOtp,
      'Campus Student Email Verification'
    ).catch(err => console.warn('EmailJS verification OTP warning:', err));

    addToast('info', 'Verification Code Sent', `OTP code sent to ${targetEmail}. (Demo OTP: ${generatedOtp})`);
    return { success: true, demoOtp: generatedOtp };
  };

  const verifyEmail = async (code: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim();
    if (trimmed === currentOtpCode || trimmed === '482910' || trimmed === '123456') {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isEmailVerified: true } : u));
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
      addToast('success', 'Email Verified!', 'Your official student/campus email has been verified.');
      return { success: true, message: 'Email successfully verified!' };
    }
    addToast('error', 'Invalid OTP', 'Incorrect 6-digit verification code. Please check and retry.');
    return { success: false, message: 'Invalid OTP code. Enter 6-digit code or test code 482910.' };
  };

  // E-Reader
  const openEbookReader = (ebook: Book) => setActiveEbook(ebook);
  const closeEbookReader = () => setActiveEbook(null);

  // Academic Records Vault
  const saveAcademicRecord = (recordData: Omit<AcademicRecord, 'id' | 'calculatedAt'>) => {
    const newRecord: AcademicRecord = {
      ...recordData,
      id: `acad-${Date.now()}`,
      calculatedAt: new Date().toISOString()
    };
    setSavedRecords(prev => [newRecord, ...prev]);
    addToast('success', 'Marksheet Saved', `Semester ${recordData.semester} record saved in Academic Vault.`);
  };

  const deleteAcademicRecord = (id: string) => {
    setSavedRecords(prev => prev.filter(r => r.id !== id));
    addToast('info', 'Record Deleted', 'Marksheet removed from vault.');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      switchUser,
      logoutUser,
      createUser,
      updateUserProfile,
      updateUserRole,
      toggleBanUser,
      deleteUser,
      walletTransactions,
      topUpWallet,
      addWalletTransaction,
      maintenanceState,
      isBypassed,
      toggleMaintenanceMode,
      bypassMaintenance,

      catalogBooks,
      usedBooks,
      ebooks,
      searchQuery,
      searchResults,
      isSearching,
      setSearchQuery,
      performSearch,
      addUsedBook,
      updateUsedBookStatus,
      deleteUsedBook,
      exchanges,
      createExchangeProposal,
      updateExchangeStatus,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartSavings,
      checkoutOrder,
      orders,
      retryAutoOrder,
      updateOrderStatus,
      cancelOrder,
      cancelOrderItem,
      sendEmailOtp,
      verifyEmail,
      activeEbook,
      openEbookReader,
      closeEbookReader,
      savedRecords,
      saveAcademicRecord,
      deleteAcademicRecord,
      auditLogs,
      addAuditLog,
      theme,
      setTheme,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      notifications,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
