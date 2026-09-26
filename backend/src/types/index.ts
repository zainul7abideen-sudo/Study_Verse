export type UserRole = 'admin' | 'moderator' | 'student' | 'verified_seller';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  university: string;
  collegeName: string;
  campusLocation: string;
  degree?: string;
  branch?: string;
  academicYear?: string;
  semester?: string;
  rollNumber?: string;
  bio?: string;
  targetExams?: string;
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
  type: 'used_resale' | 'aggregated_new' | 'ebook';
  
  // Used resale fields
  sellerId?: string;
  sellerName?: string;
  sellerCampus?: string;
  sellerUniversity?: string;
  condition?: BookCondition;
  resalePrice?: number;
  originalMrp?: number;
  isAvailableForExchange?: boolean;
  exchangeTargetDesc?: string;
  
  // Aggregated new fields
  prices?: VendorPrice[];
  lowestPrice?: number;
  
  // E-book fields
  ebookPrice?: number;
  fileSize?: string;
  previewPages?: number;
  sampleContent?: string[];
  pdfUrl?: string;
  
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
  paymentStatus: 'Paid' | 'Pending Handover';
  status: OrderStatus;
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
  estimatedUptime: string;
  updatedBy: string;
  updatedAt: string;
  bypassCode: string;
}
