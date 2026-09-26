import fs from 'fs';
import path from 'path';
import { 
  User, Book, ExchangeProposal, Order, 
  AuditLog, MaintenanceState, AcademicRecord 
} from '../types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

function readJSON<T>(filename: string, defaultValue: T): T {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Initial Seed Data
const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Ekbal (System Admin)',
    email: 'admin@sss.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    university: 'AKTU',
    collegeName: 'Institute of Engineering and Technology (IET)',
    campusLocation: 'Lucknow, UP',
    isBanned: false,
    walletBalance: 2450,
    phone: '+91 98765 43210',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'usr-student-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@vtu.ac.in',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    university: 'VTU',
    collegeName: 'BMS College of Engineering',
    campusLocation: 'Bangalore, Karnataka',
    isBanned: false,
    walletBalance: 820,
    phone: '+91 98111 22334',
    createdAt: '2026-08-15T12:00:00Z'
  },
  {
    id: 'usr-student-2',
    name: 'Ananya Verma',
    email: 'ananya.v@du.ac.in',
    role: 'verified_seller',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    university: 'DU',
    collegeName: 'Hansraj College, North Campus',
    campusLocation: 'New Delhi',
    isBanned: false,
    walletBalance: 1450,
    phone: '+91 97222 33445',
    createdAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'usr-mod-1',
    name: 'Rohan Deshmukh (Mod)',
    email: 'rohan.mod@sppu.edu',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    university: 'SPPU',
    collegeName: 'College of Engineering Pune (COEP)',
    campusLocation: 'Pune, Maharashtra',
    isBanned: false,
    walletBalance: 500,
    phone: '+91 98333 44556',
    createdAt: '2026-08-25T09:15:00Z'
  }
];

const DEFAULT_USED_BOOKS: Book[] = [
  {
    id: 'used-001',
    title: 'Design and Analysis of Algorithms',
    author: 'Ellis Horowitz, Sartaj Sahni, Sanguthevar Rajasekaran',
    isbn: '978-8173716126',
    edition: '2nd Edition',
    publisher: 'Universities Press',
    category: 'Computer Science & IT',
    description: 'Neatly maintained textbook with highlighted key algorithm concepts. No missing pages. Perfect for 5th semester AKTU & VTU CSE students.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    type: 'used_resale',
    sellerId: 'usr-student-1',
    sellerName: 'Aarav Sharma',
    sellerCampus: 'BMS College of Engineering, Bangalore',
    sellerUniversity: 'VTU',
    condition: 'Like New',
    resalePrice: 280,
    originalMrp: 625,
    isAvailableForExchange: true,
    exchangeTargetDesc: 'Looking for Database Systems (Korth 7th Ed) or Compiler Design (Ullman)',
    status: 'available',
    createdAt: '2026-09-10T11:00:00Z'
  },
  {
    id: 'used-002',
    title: 'Principles of Compiler Design',
    author: 'Alfred V. Aho, Jeffrey D. Ullman (Dragon Book)',
    isbn: '978-8185015613',
    edition: '2nd Edition',
    publisher: 'Pearson',
    category: 'Computer Science & IT',
    description: 'The legendary Dragon Book for Compilers. Contains handwritten lecture summary sheets tucked inside. Great condition.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    type: 'used_resale',
    sellerId: 'usr-student-2',
    sellerName: 'Ananya Verma',
    sellerCampus: 'Hansraj College, New Delhi',
    sellerUniversity: 'DU',
    condition: 'Good',
    resalePrice: 320,
    originalMrp: 799,
    isAvailableForExchange: true,
    exchangeTargetDesc: 'Willing to trade for Computer Networks (Peterson & Davie) or OS Galvin',
    status: 'available',
    createdAt: '2026-09-12T15:20:00Z'
  },
  {
    id: 'used-003',
    title: 'Theory of Machines',
    author: 'R.S. Khurmi, J.K. Gupta',
    isbn: '978-8121925242',
    edition: '14th Revised Edition',
    publisher: 'S Chand Publishing',
    category: 'Mechanical Engineering',
    description: 'Essential textbook for 4th/5th Sem Mechanical Engineering. Solved question papers attached from last 5 years.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    type: 'used_resale',
    sellerId: 'usr-mod-1',
    sellerName: 'Rohan Deshmukh',
    sellerCampus: 'COEP Pune',
    sellerUniversity: 'SPPU',
    condition: 'Fair',
    resalePrice: 240,
    originalMrp: 595,
    isAvailableForExchange: false,
    status: 'available',
    createdAt: '2026-09-14T09:00:00Z'
  }
];

const DEFAULT_EBOOKS: Book[] = [
  {
    id: 'ebook-001',
    title: 'Modern Web Engineering & Full-Stack Architectures (2026 Edition)',
    author: 'Prof. S. R. Ramanujan & Dr. Elena Rostova',
    isbn: '978-0998877661',
    publisher: 'Academic Digital Press',
    category: 'Computer Science & IT',
    description: 'Complete hands-on curriculum covering modern reactive architectures, microservices, cloud deployments, caching matrices, and distributed systems.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingsCount: 1420,
    pages: 412,
    type: 'ebook',
    ebookPrice: 99,
    fileSize: '14.8 MB',
    previewPages: 12,
    sampleContent: [
      'CHAPTER 1: FOUNDATIONS OF REACTIVE ARCHITECTURES\n\nIn modern high-throughput web engineering, monolithic request-response models have given way to asynchronous, event-driven reactive paradigms. When a student places an order on a platform like Study Student Shop (SSS), the system must immediately confirm the transaction while asynchronously dispatching drop-shipping bots to compare and purchase from the lowest-priced supplier in real-time.\n\nKey Tenet 1: Non-blocking I/O ensures the web server can serve thousands of concurrent search queries without waiting for external affiliate scrapers to return.\n\nKey Tenet 2: Idempotency is crucial in automated purchasing workers to prevent duplicate orders if an external vendor API experiences temporary timeouts.',
      'CHAPTER 2: STATE MANAGEMENT & REALTIME CACHING\n\nClient-side performance depends heavily on intelligent caching layers. For textbook metadata that changes infrequently (ISBN, Author, Edition, Cover Image), a 24-hour cache TTL reduces Google Books API overhead by over 92%.\n\nConversely, dynamic price feeds from Amazon, Flipkart, and Bookswagon require short-term 5-to-15 minute TTL caches to balance fresh bargain detection with rate-limit compliance.'
    ],
    status: 'available',
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'ebook-002',
    title: 'GATE 2027 CSE: Complete Solved Papers & High-Yield Notes',
    author: 'SSS Academic Editorial Board',
    isbn: '978-9388123456',
    publisher: 'Student Success Media',
    category: 'Competitive Exams (GATE/CAT/UPSC)',
    description: 'Comprehensive 15-year chapter-wise solved questions with detailed explanations for Algorithms, Data Structures, TOC, Compiler Design, OS, DBMS, and Discrete Mathematics.',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingsCount: 3890,
    pages: 650,
    type: 'ebook',
    ebookPrice: 149,
    fileSize: '28.4 MB',
    previewPages: 18,
    sampleContent: [
      'MODULE 1: ALGORITHMS & ASYMPTOTIC COMPLEXITY\n\nMastering Recurrence Relations:\n1. Master Theorem Case 1: T(n) = aT(n/b) + f(n). If f(n) = O(n^(log_b(a) - epsilon)), then T(n) = Theta(n^(log_b(a))).\n2. Master Theorem Case 2: If f(n) = Theta(n^(log_b(a))), then T(n) = Theta(n^(log_b(a)) * log n).'
    ],
    status: 'available',
    createdAt: '2026-08-12T10:00:00Z'
  }
];

const DEFAULT_MAINTENANCE: MaintenanceState = {
  isMaintenanceMode: false,
  message: 'Study Student Shop is undergoing scheduled semester database upgrades. We will be back online shortly!',
  estimatedUptime: '2026-09-27T04:00:00Z',
  updatedBy: 'Ekbal (System Admin)',
  updatedAt: '2026-09-26T20:00:00Z',
  bypassCode: 'SSS-ADMIN-DEV-2026'
};

const DEFAULT_EXCHANGES: ExchangeProposal[] = [
  {
    id: 'exch-101',
    senderId: 'usr-student-2',
    senderName: 'Ananya Verma',
    senderCollege: 'Hansraj College, New Delhi',
    receiverId: 'usr-student-1',
    receiverName: 'Aarav Sharma',
    offeredBookId: 'used-002',
    offeredBookTitle: 'Principles of Compiler Design (Dragon Book)',
    offeredBookImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    requestedBookId: 'used-001',
    requestedBookTitle: 'Design and Analysis of Algorithms (Horowitz)',
    requestedBookImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    message: 'Hey Aarav! I have the Compiler Design 2nd edition in great condition. Would love to trade for your DAA book for our 5th sem course.',
    meetupLocation: 'Inter-College Tech Fest / Central Library Lawn',
    status: 'pending',
    createdAt: '2026-09-24T14:00:00Z',
    updatedAt: '2026-09-24T14:00:00Z'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'SSS-ORD-9842',
    userId: 'usr-student-1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@vtu.ac.in',
    userPhone: '+91 98111 22334',
    shippingAddress: 'Room 304, Kaveri Hostel, BMS College of Engineering, Bull Temple Road',
    collegeCampus: 'BMS College of Engineering, Bangalore',
    items: [
      {
        id: 'item-1',
        bookId: 'b-001',
        title: 'Operating System Concepts (10th Edition)',
        author: 'Silberschatz, Galvin',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        type: 'aggregated_new',
        price: 680,
        quantity: 1,
        vendorName: 'Flipkart',
        externalOrderId: 'FK-99382109',
        trackingNumber: 'E-KART-BLR-4892'
      }
    ],
    subtotal: 680,
    discount: 50,
    shippingFee: 0,
    totalAmount: 630,
    totalSaved: 369,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Auto-Ordered with Vendor',
    dropshipVendor: 'Flipkart (Lowest Price Verified)',
    externalOrderId: 'FK-99382109',
    externalTrackingId: 'E-KART-BLR-4892',
    fulfillmentLog: [
      { timestamp: '2026-09-25 10:14:02', step: 'Order Placed on SSS', detail: 'Payment of ₹630 verified via UPI Ref: 9832049102' },
      { timestamp: '2026-09-25 10:14:05', step: 'Arbitrage Price Evaluation', detail: 'Flipkart identified as lowest vendor at ₹680 (vs Amazon ₹799, Bookswagon ₹745)' },
      { timestamp: '2026-09-25 10:14:18', step: 'Automated Bot Purchase', detail: 'SSS Dropship Bot auto-placed order with Flipkart ID #FK-99382109' },
      { timestamp: '2026-09-25 14:30:00', step: 'Vendor Dispatched', detail: 'Package packed and picked up by Ekart Logistics' }
    ],
    createdAt: '2026-09-25T10:14:00Z'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    actorId: 'usr-admin',
    actorName: 'Ekbal (System Admin)',
    actorRole: 'admin',
    actionType: 'MAINTENANCE_TOGGLE',
    details: 'System initialized in Normal Operational Mode',
    ipAddress: '192.168.1.101',
    timestamp: '2026-09-26 18:00:00'
  }
];

export const db = {
  // Users
  getUsers: (): User[] => readJSON('users.json', DEFAULT_USERS),
  setUsers: (users: User[]): void => writeJSON('users.json', users),
  
  // Used Books
  getUsedBooks: (): Book[] => readJSON('used_books.json', DEFAULT_USED_BOOKS),
  setUsedBooks: (books: Book[]): void => writeJSON('used_books.json', books),
  
  // E-books
  getEbooks: (): Book[] => readJSON('ebooks.json', DEFAULT_EBOOKS),
  setEbooks: (ebooks: Book[]): void => writeJSON('ebooks.json', ebooks),
  
  // Exchanges
  getExchanges: (): ExchangeProposal[] => readJSON('exchanges.json', DEFAULT_EXCHANGES),
  setExchanges: (exchanges: ExchangeProposal[]): void => writeJSON('exchanges.json', exchanges),
  
  // Orders
  getOrders: (): Order[] => readJSON('orders.json', DEFAULT_ORDERS),
  setOrders: (orders: Order[]): void => writeJSON('orders.json', orders),
  
  // Academic Records
  getAcademicRecords: (): AcademicRecord[] => readJSON('academic_records.json', []),
  setAcademicRecords: (records: AcademicRecord[]): void => writeJSON('academic_records.json', records),
  
  // Audit Logs
  getAuditLogs: (): AuditLog[] => readJSON('audit_logs.json', DEFAULT_AUDIT_LOGS),
  setAuditLogs: (logs: AuditLog[]): void => writeJSON('audit_logs.json', logs),
  
  // Maintenance State
  getMaintenanceState: (): MaintenanceState => readJSON('system_state.json', DEFAULT_MAINTENANCE),
  setMaintenanceState: (state: MaintenanceState): void => writeJSON('system_state.json', state),
};
