export type UserRole = 'admin' | 'moderator' | 'student' | 'verified_seller';

export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university: string;
  collegeName: string;
  campusLocation: string;
  degree?: string;          // e.g. B.Tech / B.E, B.Com, MBA, MBBS, BCA, Law
  branch?: string;          // e.g. Computer Science & Engineering, Information Technology, Mechanical, Commerce
  academicYear?: string;    // e.g. 1st Year, 2nd Year, 3rd Year, 4th Year
  semester?: string;        // e.g. Semester 1, Semester 3, Semester 5, Semester 7
  rollNumber?: string;      // e.g. 2200520100045
  bio?: string;
  targetExams?: string;     // e.g. GATE 2027, CAT, Campus Placements
  defaultShippingAddress?: string;
  hostelRoom?: string;
  emergencyContact?: string;
  preferredLanguage?: string;
  isBanned: boolean;
  walletBalance: number;
  phone?: string;
  isEmailVerified?: boolean;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  category: 'wallet_topup' | 'order_payment' | 'order_refund' | 'resale_payout' | 'campus_reward';
  title: string;
  amount: number;
  description: string;
  timestamp: string;
  status: 'Completed' | 'Processing';
  referenceId?: string;
}


export type BookCondition = 'Like New' | 'Good' | 'Fair' | 'Acceptable';

export type BookCategory = 
  | 'Computer Science & IT'
  | 'Mechanical Engineering'
  | 'Electrical & Electronics'
  | 'Civil Engineering'
  | 'Medical & Dental'
  | 'Commerce & MBA'
  | 'Law & Humanities'
  | 'Basic Sciences & Math'
  | 'Competitive Exams (GATE/CAT/UPSC)';

export interface VendorPrice {
  vendor: 'Amazon' | 'Flipkart' | 'Bookswagon' | 'SSS Marketplace' | 'Google Play Books';
  price: number;
  originalPrice: number;
  inStock: boolean;
  deliveryDays: number;
  url: string;
  isLowest?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition?: string;
  publisher?: string;
  category: BookCategory;
  description: string;
  coverImage: string;
  rating: number;
  ratingsCount?: number;
  pages?: number;
  // Type of listing
  type: 'used_resale' | 'aggregated_new' | 'ebook';
  // Resale specific
  sellerId?: string;
  sellerName?: string;
  sellerCampus?: string;
  sellerUniversity?: string;
  condition?: BookCondition;
  resalePrice?: number;
  originalMrp?: number;
  isAvailableForExchange?: boolean;
  exchangeTargetDesc?: string;
  // Aggregated new specific
  prices?: VendorPrice[];
  lowestPrice?: number;
  // E-book specific
  ebookPrice?: number;
  fileSize?: string;
  previewPages?: number;
  sampleContent?: string[];
  pdfUrl?: string;
  // Status
  status: 'available' | 'in_exchange' | 'sold' | 'inactive';
  createdAt: string;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'completed' | 'cancelled';

export interface ExchangeProposal {
  id: string;
  senderId: string;
  senderName: string;
  senderCollege: string;
  receiverId: string;
  receiverName: string;
  offeredBookId: string;
  offeredBookTitle: string;
  offeredBookImage: string;
  requestedBookId: string;
  requestedBookTitle: string;
  requestedBookImage: string;
  message: string;
  meetupLocation: string;
  status: ExchangeStatus;
  counterMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'Payment Verified'
  | 'Auto-Ordering at Lowest Vendor'
  | 'Auto-Ordered with Vendor'
  | 'Vendor Dispatched'
  | 'Out for Campus Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  type: 'used_resale' | 'aggregated_new' | 'ebook';
  price: number;
  quantity: number;
  vendorName?: string;
  externalOrderId?: string;
  trackingNumber?: string;
  condition?: BookCondition;
  itemStatus?: 'Active' | 'Cancelled';
  cancellationReason?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  shippingAddress: string;
  collegeCampus: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  totalSaved: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Campus Handover';
  paymentStatus: 'Paid' | 'Pending Handover' | 'Refunded';
  status: OrderStatus;
  cancellationReason?: string;
  cancelledAt?: string;
  // Dropshipping specific
  dropshipVendor?: string;
  externalOrderId?: string;
  externalTrackingId?: string;
  fulfillmentLog: Array<{
    timestamp: string;
    step: string;
    detail: string;
  }>;
  createdAt: string;
}

export interface UniversityConfig {
  code: string;
  name: string;
  state: string;
  gradingSystem: string;
  scale: 10 | 7 | 4;
  formulaDescription: string;
  calculatePercentage: (cgpa: number) => number;
  gradeScale: Array<{
    grade: string;
    points: number;
    description: string;
    marksRange: string;
  }>;
  defaultSubjects: Array<{
    code: string;
    name: string;
    credits: number;
  }>;
}

export interface SubjectGrade {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
  internalMarks?: number;
  externalMarks?: number;
  totalMarks?: number;
}

export interface AcademicRecord {
  id: string;
  userId: string;
  universityCode: string;
  universityName: string;
  semester: number;
  branch: string;
  sgpa: number;
  cgpa: number;
  percentage: number;
  subjects: SubjectGrade[];
  targetCgpa?: number;
  targetRequiredMarks?: string;
  calculatedAt: string;
}

export type AuditActionType = 
  | 'MAINTENANCE_TOGGLE'
  | 'USER_ROLE_CHANGE'
  | 'USER_CREATE'
  | 'USER_DELETE'
  | 'USER_BAN'
  | 'USER_UNBAN'
  | 'AUTO_ORDER_DISPATCH'
  | 'PRICE_SCRAPER_SYNC'
  | 'LISTING_MODERATION'
  | 'EXCHANGE_PROPOSAL_DISPUTE';

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  actionType: AuditActionType;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface MaintenanceState {
  isMaintenanceMode: boolean;
  message: string;
  estimatedUptime: string; // ISO or human string
  updatedBy: string;
  updatedAt: string;
  bypassCode: string;
}
