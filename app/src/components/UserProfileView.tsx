import React, { useState, useEffect } from 'react';
import { 
  User, Package, BookOpen, ArrowRightLeft, Award, 
  Wallet, MapPin, ShieldCheck, Clock, ExternalLink, 
  Trash2, Eye, Printer, Sparkles, CheckCircle2, ChevronRight,
  MailCheck, ShieldAlert, X, AlertCircle, RefreshCw, Undo2,
  Check, ArrowRight, ShoppingCart, ShoppingBag, CornerDownLeft,
  GraduationCap, LogOut, LogIn, Edit3, KeyRound, QrCode,
  Phone, Building, Layers, Hash, BookMarked, Bell, Lock,
  Download, Camera, CreditCard, Send, ArrowUpRight, ArrowDownLeft,
  Shield, Sliders, Smartphone, CheckCheck, FileText, Info,
  TrendingUp, HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderItem, WalletTransaction } from '../types';

// Preset Avatars for Student Selection
const AVATAR_PRESETS = [
  { label: 'Tech / CS Student', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Scholar (Male)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
  { label: 'Commerce / MBA', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { label: 'Engineering Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Medical Scholar', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
  { label: 'Science Researcher', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Campus Ambassador', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80' },
  { label: 'Creative Designer', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80' },
];

const UNIVERSITY_PRESETS = [
  'AKTU (Dr. A.P.J. Abdul Kalam Technical University)',
  'VTU (Visvesvaraya Technological University)',
  'DU (University of Delhi)',
  'SPPU (Savitribai Phule Pune University)',
  'Mumbai University (MU)',
  'Anna University Chennai',
  'WBUT / MAKAUT West Bengal',
  'JNTU Hyderabad',
  'RGPV Madhya Pradesh',
  'IIT / NIT / IIIT National System',
  'Other State / Central University'
];

export const UserProfileView: React.FC = () => {
  const { 
    currentUser, logoutUser, openAuthModal, updateUserProfile,
    orders, usedBooks, deleteUsedBook, exchanges, savedRecords, 
    deleteAcademicRecord, openEbookReader, ebooks, cancelOrder, 
    cancelOrderItem, sendEmailOtp, verifyEmail, addToCart, addToast,
    walletTransactions, topUpWallet
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'edit_profile' | 'id_card' | 'wallet' | 'listings' | 'exchanges' | 'academic' | 'ebooks' | 'security'
  >('orders');

  // Edit Profile Form State
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    avatar: currentUser.avatar || AVATAR_PRESETS[0].url,
    university: currentUser.university || 'AKTU',
    collegeName: currentUser.collegeName || '',
    campusLocation: currentUser.campusLocation || '',
    degree: currentUser.degree || 'B.Tech / B.E',
    branch: currentUser.branch || 'Computer Science & Engineering',
    academicYear: currentUser.academicYear || '3rd Year',
    semester: currentUser.semester || 'Semester 5',
    rollNumber: currentUser.rollNumber || '',
    bio: currentUser.bio || '',
    targetExams: currentUser.targetExams || '',
    defaultShippingAddress: currentUser.defaultShippingAddress || '',
    hostelRoom: currentUser.hostelRoom || '',
    emergencyContact: currentUser.emergencyContact || '',
    preferredLanguage: currentUser.preferredLanguage || 'English'
  });

  // Sync form data when currentUser updates
  useEffect(() => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      avatar: currentUser.avatar || AVATAR_PRESETS[0].url,
      university: currentUser.university || 'AKTU',
      collegeName: currentUser.collegeName || '',
      campusLocation: currentUser.campusLocation || '',
      degree: currentUser.degree || 'B.Tech / B.E',
      branch: currentUser.branch || 'Computer Science & Engineering',
      academicYear: currentUser.academicYear || '3rd Year',
      semester: currentUser.semester || 'Semester 5',
      rollNumber: currentUser.rollNumber || '',
      bio: currentUser.bio || '',
      targetExams: currentUser.targetExams || '',
      defaultShippingAddress: currentUser.defaultShippingAddress || '',
      hostelRoom: currentUser.hostelRoom || '',
      emergencyContact: currentUser.emergencyContact || '',
      preferredLanguage: currentUser.preferredLanguage || 'English'
    });
  }, [currentUser]);

  // ID Card flip state
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Wallet Top-up Modal State
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(500);
  const [topUpMethod, setTopUpMethod] = useState<string>('UPI (GPay / PhonePe / Paytm)');
  const [customTopUpInput, setCustomTopUpInput] = useState<string>('');

  // Password change modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Preferences toggles
  const [prefDropshipSms, setPrefDropshipSms] = useState<boolean>(true);
  const [prefExchangeAlerts, setPrefExchangeAlerts] = useState<boolean>(true);
  const [prefPriceDrop, setPrefPriceDrop] = useState<boolean>(true);
  const [prefExamReminders, setPrefExamReminders] = useState<boolean>(true);

  // Email verification modal state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [demoCodeHelper, setDemoCodeHelper] = useState<string>('482910');

  // Order cancellation modal state
  const [cancelModalData, setCancelModalData] = useState<{
    orderId: string;
    itemId?: string;
    itemTitle?: string;
    amount: number;
  } | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Found lower price on another website');
  const [customReason, setCustomReason] = useState<string>('');

  const myOrders = orders.filter(o => o.userId === currentUser.id);
  const myListings = usedBooks.filter(b => b.sellerId === currentUser.id);
  const myExchanges = exchanges.filter(e => e.senderId === currentUser.id || e.receiverId === currentUser.id);
  const myAcademicRecords = savedRecords.filter(r => r.userId === currentUser.id);
  const myTransactions = walletTransactions.filter(t => t.userId === currentUser.id);

  // Total savings calculation across orders
  const totalSavings = myOrders.reduce((sum, o) => sum + (o.totalSaved || 0), 0) + 420;

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isVerifyModalOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVerifyModalOpen, resendTimer]);

  const handleOpenVerifyModal = async () => {
    setIsVerifyModalOpen(true);
    setResendTimer(60);
    setIsSendingOtp(true);
    const res = await sendEmailOtp(currentUser.email);
    if (res.demoOtp) setDemoCodeHelper(res.demoOtp);
    setIsSendingOtp(false);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      addToast('warning', 'Incomplete Code', 'Please enter all 6 digits of the OTP code.');
      return;
    }
    const res = await verifyEmail(fullOtp);
    if (res.success) {
      setIsVerifyModalOpen(false);
      setOtpDigits(['', '', '', '', '', '']);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsSendingOtp(true);
    const res = await sendEmailOtp(currentUser.email);
    if (res.demoOtp) setDemoCodeHelper(res.demoOtp);
    setResendTimer(60);
    setIsSendingOtp(false);
  };

  const handleConfirmCancellation = async () => {
    if (!cancelModalData) return;
    const finalReason = cancelReason === 'Other' ? (customReason || 'Cancelled by student') : cancelReason;
    
    if (cancelModalData.itemId) {
      await cancelOrderItem(cancelModalData.orderId, cancelModalData.itemId, finalReason);
    } else {
      await cancelOrder(cancelModalData.orderId, finalReason);
    }
    setCancelModalData(null);
    setCustomReason('');
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        coverImage: item.coverImage,
        type: item.type,
        price: item.price,
        quantity: 1,
        vendorName: item.vendorName
      });
    });
    addToast('success', 'Added to Cart', 'Items from this order added to your cart.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('warning', 'Missing Name', 'Please enter your full student name.');
      return;
    }

    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: formData.avatar,
      university: formData.university,
      collegeName: formData.collegeName,
      campusLocation: formData.campusLocation,
      degree: formData.degree,
      branch: formData.branch,
      academicYear: formData.academicYear,
      semester: formData.semester,
      rollNumber: formData.rollNumber,
      bio: formData.bio,
      targetExams: formData.targetExams,
      defaultShippingAddress: formData.defaultShippingAddress,
      hostelRoom: formData.hostelRoom,
      emergencyContact: formData.emergencyContact,
      preferredLanguage: formData.preferredLanguage
    });
  };

  const handleExecuteTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmt = customTopUpInput ? Number(customTopUpInput) : topUpAmount;
    if (isNaN(finalAmt) || finalAmt <= 0) {
      addToast('warning', 'Invalid Amount', 'Please enter a valid top-up amount.');
      return;
    }
    topUpWallet(finalAmt, topUpMethod);
    setIsTopUpModalOpen(false);
    setCustomTopUpInput('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('warning', 'Enter Current Password', 'Please enter your existing password.');
      return;
    }
    if (newPassword.length < 6) {
      addToast('warning', 'Weak Password', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'Mismatch', 'New password and confirmation do not match.');
      return;
    }
    addToast('success', 'Password Updated', 'Your security password has been changed successfully.');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Profile Header Banner */}
      <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl relative overflow-hidden">
        
        {/* Avatar & Quick Edit Overlay */}
        <div className="relative flex-shrink-0 group">
          <img 
            src={currentUser.avatar || AVATAR_PRESETS[0].url} 
            alt={currentUser.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-2xl transition-transform group-hover:scale-105"
          />
          {currentUser.isEmailVerified && (
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg" title="Verified University Student">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          <button
            onClick={() => setActiveTab('edit_profile')}
            className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-bold transition-opacity cursor-pointer gap-1"
            title="Change Avatar & Profile"
          >
            <Camera className="w-5 h-5" />
            <span>Edit Photo</span>
          </button>
        </div>

        {/* User Identity Details */}
        <div className="flex-1 text-center sm:text-left space-y-2.5 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black theme-text-heading tracking-tight truncate">{currentUser.name}</h1>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
              currentUser.role === 'admin' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30' :
              currentUser.role === 'moderator' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30' :
              currentUser.role === 'verified_seller' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30' :
              'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
            }`}>
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          {/* Student Academic Credentials Row */}
          <div className="text-xs theme-text-muted flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-4 h-4" />
              {currentUser.university || 'AKTU'} • {currentUser.degree || 'B.Tech'}
            </span>
            <span className="opacity-50">•</span>
            <span className="font-semibold theme-text-heading">
              {currentUser.branch || 'Computer Science & Engineering'}
            </span>
            <span className="opacity-50">•</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold font-mono text-[11px]">
              {currentUser.academicYear || '3rd Year'} ({currentUser.semester || 'Semester 5'})
            </span>
          </div>

          <div className="text-xs theme-text-muted flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-0.5">
            <span className="flex items-center gap-1 theme-text-heading">
              <Building className="w-3.5 h-3.5 text-blue-500" />
              {currentUser.collegeName || 'Institute of Engineering and Technology'}
            </span>
            <span className="opacity-50">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {currentUser.campusLocation || 'Lucknow, UP'}
            </span>
            {currentUser.rollNumber && (
              <>
                <span className="opacity-50">•</span>
                <span className="font-mono text-[11px] opacity-80 flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Roll: {currentUser.rollNumber}
                </span>
              </>
            )}
          </div>

          {/* Bio snippet if available */}
          {currentUser.bio && (
            <p className="text-xs theme-text-muted italic pt-1 line-clamp-2 max-w-xl">
              "{currentUser.bio}"
            </p>
          )}

          {/* Quick Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <button
              onClick={() => setActiveTab('edit_profile')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Student Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('id_card')}
              className="px-3 py-1.5 theme-card-sub hover:opacity-80 theme-text-heading border theme-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Digital Student ID Pass</span>
            </button>

            {/* Email Verification Action */}
            {currentUser.isEmailVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Student Email
              </span>
            ) : (
              <button
                onClick={handleOpenVerifyModal}
                className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MailCheck className="w-3.5 h-3.5" />
                <span>Verify Email (OTP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Campus Wallet Balance & Quick Top-Up Box */}
        <div className="theme-card-sub border theme-border p-4 sm:p-5 rounded-2xl text-center sm:text-right flex-shrink-0 min-w-[210px] space-y-2.5 shadow-sm">
          <div>
            <div className="text-[10px] uppercase font-bold theme-text-muted flex items-center justify-center sm:justify-end gap-1">
              <Wallet className="w-3 h-3 text-blue-500" />
              Campus Wallet Balance
            </div>
            <div className="text-3xl font-black text-blue-500 dark:text-cyan-300 my-0.5">
              ₹{currentUser.walletBalance}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center sm:justify-end gap-1">
              <Sparkles className="w-3 h-3" />
              Instant Refund & Book Drop Active
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-1.5">
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Add Funds / Top-Up</span>
            </button>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-1.5 pt-1.5 border-t theme-border">
            <button
              onClick={openAuthModal}
              className="px-2.5 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Switch demo account"
            >
              <LogIn className="w-3 h-3" />
              <span>Switch</span>
            </button>
            <button
              onClick={logoutUser}
              className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Log out of student session"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="theme-card border theme-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold theme-text-muted">Total Orders</div>
            <div className="text-lg font-black theme-text-heading">{myOrders.length} Books</div>
          </div>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold theme-text-muted">Aggregator Savings</div>
            <div className="text-lg font-black text-emerald-500 dark:text-emerald-400">₹{totalSavings}</div>
          </div>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold theme-text-muted">Used Books Resold</div>
            <div className="text-lg font-black theme-text-heading">{myListings.length} Listed</div>
          </div>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold theme-text-muted">Campus Standing</div>
            <div className="text-lg font-black text-amber-500">Tier 1 Scholar</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b theme-border pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: `My Orders & Fulfillment (${myOrders.length})`, icon: Package },
          { id: 'edit_profile', label: 'Edit Profile & Academic Info', icon: Edit3 },
          { id: 'id_card', label: 'Smart Student ID Pass', icon: QrCode },
          { id: 'wallet', label: `Campus Wallet & Ledger (₹${currentUser.walletBalance})`, icon: Wallet },
          { id: 'listings', label: `My Used Listings (${myListings.length})`, icon: BookOpen },
          { id: 'exchanges', label: `Trade Proposals (${myExchanges.length})`, icon: ArrowRightLeft },
          { id: 'academic', label: `Academic Vault (${myAcademicRecords.length})`, icon: Award },
          { id: 'ebooks', label: 'My Digital Library', icon: Eye },
          { id: 'security', label: 'Security & Preferences', icon: Shield },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold scale-[1.02]'
                  : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS & CANCEL ITEMS */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold theme-text-heading">Your Book Orders & Fulfillment</h2>
              <p className="text-xs theme-text-muted">Track auto-purchased books, manage dropship shipments, or cancel items before delivery.</p>
            </div>
            
            <div className="text-xs theme-text-muted">
              Total Placed: <b className="theme-text-heading">{myOrders.length}</b>
            </div>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-16 theme-card border theme-border rounded-3xl p-8 space-y-3">
              <Package className="w-14 h-14 theme-text-muted mx-auto" />
              <h3 className="text-base font-bold theme-text-heading">No Orders Placed Yet</h3>
              <p className="text-xs theme-text-muted max-w-md mx-auto">
                Search textbooks in the Aggregator tab to find the lowest prices across Amazon, Flipkart, and Bookswagon.
              </p>
            </div>
          ) : (
            myOrders.map((order) => {
              const isCancelled = order.status === 'Cancelled';
              const canCancelOrder = !isCancelled && order.status !== 'Delivered';

              return (
                <div 
                  key={order.id}
                  className={`theme-card border theme-border rounded-2xl p-5 space-y-4 shadow-lg transition-all ${
                    isCancelled ? 'opacity-85 border-rose-500/30' : ''
                  }`}
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border pb-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm theme-text-heading font-mono">{order.id}</span>
                        <span className="text-[10px] theme-text-muted font-mono">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                      </div>
                      <div className="text-xs theme-text-muted">
                        Delivery to: <span className="theme-text-heading font-medium">{order.shippingAddress || order.collegeCampus}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-black ${isCancelled ? 'line-through text-slate-400' : 'text-blue-500 dark:text-cyan-300'}`}>
                          ₹{order.totalAmount}
                        </div>
                        {order.totalSaved > 0 && !isCancelled && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Saved ₹{order.totalSaved}
                          </div>
                        )}
                        {isCancelled && (
                          <div className="text-[10px] text-emerald-500 font-semibold">
                            Refunded to Wallet
                          </div>
                        )}
                      </div>

                      <span className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase tracking-wider ${
                        isCancelled
                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                          : order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items in Order with Individual Cancellation Control */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">
                      Ordered Book Items ({order.items.length})
                    </div>

                    {order.items.map((item, idx) => {
                      const isItemCancelled = isCancelled || item.itemStatus === 'Cancelled';
                      const canCancelItem = canCancelOrder && !isItemCancelled && order.items.length > 1;

                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between gap-3 theme-card-sub p-3 rounded-xl border theme-border ${
                            isItemCancelled ? 'opacity-60 bg-rose-500/5 border-rose-500/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={item.coverImage} alt={item.title} className="w-10 h-14 object-cover rounded-md flex-shrink-0" />
                            <div className="min-w-0">
                              <div className={`text-xs font-bold theme-text-heading truncate ${isItemCancelled ? 'line-through' : ''}`}>
                                {item.title}
                              </div>
                              <div className="text-[10px] theme-text-muted">
                                Qty: {item.quantity} • ₹{item.price} each • By {item.author}
                              </div>
                              {item.vendorName && (
                                <div className="text-[10px] text-blue-500 font-semibold mt-0.5">
                                  Auto-Ordered via {item.vendorName}
                                </div>
                              )}
                              {isItemCancelled && (
                                <div className="text-[10px] text-rose-500 font-bold mt-0.5 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Item Cancelled {item.cancellationReason ? `(${item.cancellationReason})` : ''}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="text-right">
                              <div className={`text-xs font-bold ${isItemCancelled ? 'line-through theme-text-muted' : 'theme-text-heading'}`}>
                                ₹{item.price * item.quantity}
                              </div>
                            </div>

                            {canCancelItem && (
                              <button
                                onClick={() => setCancelModalData({
                                  orderId: order.id,
                                  itemId: item.id,
                                  itemTitle: item.title,
                                  amount: item.price * item.quantity
                                })}
                                className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                title="Cancel this specific item"
                              >
                                Cancel Item
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Cancellation Reason Notice if cancelled */}
                  {isCancelled && order.cancellationReason && (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-rose-500 font-medium">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span><b>Order Cancelled:</b> {order.cancellationReason}</span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold whitespace-nowrap">
                        100% Refunded to Wallet
                      </span>
                    </div>
                  )}

                  {/* Dropship & Tracking Live Log */}
                  {order.dropshipVendor && !isCancelled && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-blue-600 dark:text-cyan-300">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                          Automated Dropship Fulfillment: {order.dropshipVendor}
                        </span>
                        {order.externalTrackingId && (
                          <span className="font-mono text-[11px] theme-text-muted">
                            Tracking: <b className="theme-text-heading">{order.externalTrackingId}</b>
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 pt-1 border-t border-blue-500/20">
                        {order.fulfillmentLog.map((log, lidx) => (
                          <div key={lidx} className="text-[11px] theme-text-heading flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span><b>{log.step}:</b> {log.detail}</span>
                            <span className="theme-text-muted ml-auto font-mono text-[10px]">{log.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t theme-border text-xs">
                    <div className="theme-text-muted text-[11px]">
                      SSS Guarantee: Free replacements & instant refund on campus handovers.
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3 py-1.5 theme-card-sub hover:opacity-80 border theme-border rounded-xl font-bold text-blue-500 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reorder / Buy Again</span>
                      </button>

                      {canCancelOrder && (
                        <button
                          onClick={() => setCancelModalData({
                            orderId: order.id,
                            amount: order.totalAmount
                          })}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel Entire Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: EDIT PROFILE & ACADEMIC INFO */}
      {activeTab === 'edit_profile' && (
        <form onSubmit={handleSaveProfile} className="theme-card border theme-border rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b theme-border pb-4">
            <div>
              <h2 className="text-lg font-black theme-text-heading flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                Edit Student Profile & Academic Credentials
              </h2>
              <p className="text-xs theme-text-muted mt-0.5">
                Keep your institution, degree, and semester updated to auto-calibrate textbook recommendations and grading engines.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          {/* Section 1: Choose Avatar Preset */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider theme-text-muted block">
              1. Choose Profile Avatar
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {AVATAR_PRESETS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: av.url })}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-1 ${
                    formData.avatar === av.url ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={av.label}
                >
                  <img src={av.url} alt={av.label} className="w-full h-14 sm:h-16 object-cover rounded-xl" />
                  {formData.avatar === av.url && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5 shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs theme-text-muted">Or custom image URL:</span>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="flex-1 p-2 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Section 2: Personal Identity & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              2. Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border opacity-70 cursor-not-allowed font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Student Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold theme-text-muted">Student Bio / Interests</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Share your academic specialization, tech stacks, or favourite research domains..."
                className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Section 3: University & Institution Credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              3. University & Academic Program Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">University / Examination Board</label>
                <select
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                >
                  {UNIVERSITY_PRESETS.map((u, idx) => (
                    <option key={idx} value={u.split(' ')[0]}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">College / Campus Name</label>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  placeholder="e.g. BMS College of Engineering"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Campus City / State</label>
                <input
                  type="text"
                  value={formData.campusLocation}
                  onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Degree Program</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                >
                  <option value="B.Tech / B.E">B.Tech / B.E (Engineering)</option>
                  <option value="BCA">BCA (Computer Applications)</option>
                  <option value="B.Sc">B.Sc (Sciences / IT)</option>
                  <option value="B.Com (Hons)">B.Com (Commerce)</option>
                  <option value="MBA / PGDM">MBA / PGDM (Management)</option>
                  <option value="MBBS / BDS">MBBS / BDS (Medical)</option>
                  <option value="BA / LLB">BA / LLB (Humanities & Law)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Branch / Specialization</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. Computer Science & Engg"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Academic Class / Year</label>
                <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                >
                  <option value="1st Year">1st Year (Fresher)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior / Final)</option>
                  <option value="5th Year">5th Year (Dual Degree / MBBS)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Current Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                >
                  {Array.from({ length: 10 }, (_, i) => `Semester ${i + 1}`).map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Student Roll Number / USN</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. 2200520100088 / 1BM22IS045"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Target Exam / Goal</label>
                <input
                  type="text"
                  value={formData.targetExams}
                  onChange={(e) => setFormData({ ...formData, targetExams: e.target.value })}
                  placeholder="e.g. GATE 2027 / CAT / Placements"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Preferred Study Language</label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bilingual (English + Hindi)">Bilingual (English + Hindi)</option>
                  <option value="Regional (Marathi/Kannada/Tamil)">Regional Indian Language</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Campus Logistics & Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              4. Campus Residence & Book Delivery Point
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Hostel / Hall & Room Number</label>
                <input
                  type="text"
                  value={formData.hostelRoom}
                  onChange={(e) => setFormData({ ...formData, hostelRoom: e.target.value })}
                  placeholder="e.g. Aryabhatta Hall - Room 304"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Emergency / Guardian Contact</label>
                <input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold theme-text-muted">Default Campus Book Delivery Address</label>
              <input
                type="text"
                value={formData.defaultShippingAddress}
                onChange={(e) => setFormData({ ...formData, defaultShippingAddress: e.target.value })}
                placeholder="e.g. Aryabhatta Hostel, Block B, Room 304, IET Campus, Lucknow"
                className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t theme-border">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="px-5 py-2.5 theme-card-sub border theme-border rounded-xl text-xs font-semibold hover:opacity-80 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Student Profile & Calibrate App</span>
            </button>
          </div>

        </form>
      )}

      {/* TAB 3: SMART STUDENT DIGITAL ID CARD */}
      {activeTab === 'id_card' && (
        <div className="space-y-6 max-w-xl mx-auto">
          
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black theme-text-heading flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-blue-500" />
              Smart Student Digital ID & Campus Pass
            </h2>
            <p className="text-xs theme-text-muted">
              Use this verified digital student badge for campus book drop-offs, peer exchanges, and library access.
            </p>
          </div>

          {/* Interactive Card Container */}
          <div className="perspective-1000 flex justify-center">
            <div 
              className={`w-full max-w-md rounded-3xl p-6 sm:p-7 text-white shadow-2xl relative overflow-hidden transition-all duration-500 transform ${
                isCardFlipped 
                  ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40' 
                  : 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 border border-blue-400/30'
              }`}
            >
              {/* Hologram Shimmer Accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              {!isCardFlipped ? (
                // FRONT OF CARD
                <div className="space-y-5 relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm">
                        SSS
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-300">Study Student Shop</div>
                        <div className="text-xs font-bold">{currentUser.university || 'AKTU'} VERIFIED PASS</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-400/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>AUTHENTIC</span>
                    </div>
                  </div>

                  {/* Student Photo & Bio */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentUser.avatar || AVATAR_PRESETS[0].url} 
                      alt={currentUser.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-xl flex-shrink-0"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="text-lg font-black truncate">{currentUser.name}</h3>
                      <div className="text-xs text-cyan-200 font-semibold truncate">
                        {currentUser.degree || 'B.Tech'} • {currentUser.branch || 'CSE'}
                      </div>
                      <div className="text-[11px] text-white/80 truncate">
                        {currentUser.collegeName || 'Institute of Engg & Tech'}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-300 pt-0.5">
                        USN / Roll: <b>{currentUser.rollNumber || '2200520100088'}</b>
                      </div>
                    </div>
                  </div>

                  {/* Footer with QR & Verification Stamp */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">Class Term</div>
                      <div className="text-xs font-mono font-bold text-white">
                        {currentUser.academicYear || '3rd Year'} • {currentUser.semester || 'Sem 5'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-[9px] uppercase tracking-wider text-white/60">Campus</div>
                      <div className="text-xs font-bold text-white truncate max-w-[120px]">
                        {currentUser.campusLocation || 'Main Campus'}
                      </div>
                    </div>

                    {/* QR Code Icon Simulation */}
                    <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg text-slate-900">
                      <QrCode className="w-10 h-10" />
                    </div>
                  </div>
                </div>
              ) : (
                // BACK OF CARD
                <div className="space-y-4 relative z-10 text-xs">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">Security & Emergency Contact</span>
                    <span className="text-[10px] font-mono text-white/60">ID: {currentUser.id}</span>
                  </div>

                  <div className="space-y-2 text-white/90">
                    <div className="flex justify-between">
                      <span className="text-white/60">Hostel / Hall:</span>
                      <span className="font-semibold">{currentUser.hostelRoom || 'Aryabhatta Hall - Room 304'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Emergency Phone:</span>
                      <span className="font-mono font-semibold">{currentUser.emergencyContact || currentUser.phone || '+91 98765 43210'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Delivery Point:</span>
                      <span className="font-semibold truncate max-w-[200px]">{currentUser.defaultShippingAddress || 'Campus Reception / Gate 1'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/60">Preferred Lang:</span>
                      <span className="font-semibold">{currentUser.preferredLanguage || 'English'}</span>
                    </div>
                  </div>

                  {/* Simulated Security Barcode */}
                  <div className="pt-2 border-t border-white/15 text-center space-y-1">
                    <div className="font-mono text-[9px] tracking-widest text-cyan-200 uppercase">
                      STUDY STUDENT SHOP CAMPUS ENROLLMENT
                    </div>
                    <div className="h-7 bg-white/10 rounded flex items-center justify-around px-2 font-mono text-[9px] text-white/50">
                      ||| | | |||| || | ||||| || | |||| ||| | | ||||
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flip & Download Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="px-4 py-2 theme-card border theme-border rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-80 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <span>{isCardFlipped ? 'View Front Side' : 'Flip Card ↺'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Student Pass</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 4: CAMPUS WALLET & TRANSACTION LEDGER */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          
          {/* Wallet Header & Quick Top-Up Bar */}
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs uppercase font-bold text-blue-500 flex items-center justify-center md:justify-start gap-1.5">
                <Wallet className="w-4 h-4" />
                Active Campus Wallet Balance
              </div>
              <div className="text-4xl sm:text-5xl font-black theme-text-heading">
                ₹{currentUser.walletBalance}
              </div>
              <p className="text-xs theme-text-muted max-w-md">
                Funds are instantly usable for 1-click book checkouts, dropshipping orders, and peer-to-peer campus book handovers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                {[100, 250, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => topUpWallet(amt, 'Instant UPI')}
                    className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsTopUpModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Custom Top-Up</span>
              </button>
            </div>
          </div>

          {/* Transactions Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold theme-text-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Wallet Ledger & Financial History ({myTransactions.length})
              </h3>
              <span className="text-xs theme-text-muted">Instant Ledger Sync</span>
            </div>

            {myTransactions.length === 0 ? (
              <div className="theme-card border theme-border rounded-2xl p-8 text-center text-xs theme-text-muted">
                No financial transactions recorded yet. Top up your wallet or place an order to see ledger logs.
              </div>
            ) : (
              <div className="theme-card border theme-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="theme-card-sub border-b theme-border text-[11px] font-bold theme-text-muted uppercase">
                      <tr>
                        <th className="p-3.5">Transaction</th>
                        <th className="p-3.5">Type & Reference</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y theme-border">
                      {myTransactions.map(tx => {
                        const isCredit = tx.type === 'credit';
                        return (
                          <tr key={tx.id} className="hover:bg-blue-500/5 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold theme-text-heading flex items-center gap-2">
                                {isCredit ? (
                                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <ArrowDownLeft className="w-3.5 h-3.5" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0">
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <span>{tx.title}</span>
                              </div>
                              <div className="text-[10px] theme-text-muted mt-0.5">{tx.description}</div>
                            </td>

                            <td className="p-3.5">
                              <span className="font-mono text-[10px] text-blue-500 font-semibold block">
                                {tx.referenceId || tx.id}
                              </span>
                              <span className="text-[10px] theme-text-muted capitalize">
                                {tx.category.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="p-3.5 text-[11px] font-mono theme-text-muted">
                              {tx.timestamp}
                            </td>

                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                {tx.status}
                              </span>
                            </td>

                            <td className="p-3.5 text-right font-mono font-black text-sm">
                              <span className={isCredit ? 'text-emerald-500' : 'text-rose-500'}>
                                {isCredit ? '+' : '-'}₹{tx.amount}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 5: MY USED LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold theme-text-heading">Your Listed Pre-Owned Textbooks</h2>
            <span className="text-xs theme-text-muted">Total: <b>{myListings.length}</b></span>
          </div>

          {myListings.length === 0 ? (
            <div className="text-center py-16 theme-card border theme-border rounded-3xl p-8">
              <BookOpen className="w-12 h-12 theme-text-muted mx-auto mb-3" />
              <h3 className="text-base font-bold theme-text-heading">No Books Listed by You</h3>
              <p className="text-xs theme-text-muted mt-1">Go to the Resell & Exchange tab to list your previous semester textbooks.</p>
            </div>
          ) : (
            myListings.map(book => (
              <div key={book.id} className="theme-card border theme-border rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded-lg border theme-border" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm theme-text-heading">{book.title}</h4>
                    <p className="text-xs theme-text-muted">Listed Price: <b className="text-emerald-500 dark:text-emerald-400">₹{book.resalePrice}</b></p>
                    <span className="text-[10px] theme-text-muted uppercase">Condition: {book.condition}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteUsedBook(book.id)}
                    className="p-2 theme-text-muted hover:text-rose-500 rounded-lg theme-card-sub border theme-border cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 6: TRADE PROPOSALS */}
      {activeTab === 'exchanges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold theme-text-heading">Campus Textbook Barter & Trade Proposals</h2>
            <span className="text-xs theme-text-muted">Total: <b>{myExchanges.length}</b></span>
          </div>

          {myExchanges.length === 0 ? (
            <div className="text-center py-16 theme-card border theme-border rounded-3xl p-8">
              <ArrowRightLeft className="w-12 h-12 theme-text-muted mx-auto mb-3" />
              <h3 className="text-base font-bold theme-text-heading">No Active Trade Proposals</h3>
              <p className="text-xs theme-text-muted mt-1">Initiate barter proposals with students in the Resell & Barter tab.</p>
            </div>
          ) : (
            myExchanges.map(ex => (
              <div key={ex.id} className="theme-card border theme-border rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold theme-text-heading">Trade: {ex.offeredBookTitle} ⟷ {ex.requestedBookTitle}</span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold uppercase rounded border border-purple-500/30">{ex.status}</span>
                </div>
                <p className="theme-text-muted">Meetup Location: {ex.meetupLocation}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 7: ACADEMIC VAULT */}
      {activeTab === 'academic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold theme-text-heading">Saved Marksheets & Semester Transcripts</h2>
            <span className="text-xs theme-text-muted">Total: <b>{myAcademicRecords.length}</b></span>
          </div>

          {myAcademicRecords.length === 0 ? (
            <div className="text-center py-16 theme-card border theme-border rounded-3xl p-8">
              <Award className="w-12 h-12 theme-text-muted mx-auto mb-3" />
              <h3 className="text-base font-bold theme-text-heading">No Saved Marksheets Yet</h3>
              <p className="text-xs theme-text-muted mt-1">Use the CGPA & Marks calculator tab to compute and save your semester transcripts.</p>
            </div>
          ) : (
            myAcademicRecords.map(rec => (
              <div key={rec.id} className="theme-card border theme-border rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg">
                <div>
                  <div className="text-xs font-bold text-amber-500 uppercase">{rec.universityName} • Semester {rec.semester}</div>
                  <div className="text-lg font-black theme-text-heading mt-1">SGPA: {rec.sgpa.toFixed(2)} ({rec.percentage.toFixed(2)}%)</div>
                  <div className="text-[11px] theme-text-muted">{rec.branch} • {rec.subjects.length} Courses Calculated</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 theme-card-sub hover:opacity-80 theme-text-heading rounded-xl text-xs font-bold flex items-center gap-1 border theme-border cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <span className="hidden sm:inline">Print Transcript</span>
                  </button>

                  <button
                    onClick={() => deleteAcademicRecord(rec.id)}
                    className="p-2.5 theme-text-muted hover:text-rose-500 theme-card-sub rounded-xl border theme-border cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 8: E-BOOKS LIBRARY */}
      {activeTab === 'ebooks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold theme-text-heading">Your DRM Licensed Digital E-Books</h2>
            <span className="text-xs theme-text-muted">Instant In-Browser Web Reader</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map(eb => (
              <div key={eb.id} className="theme-card border theme-border rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                <div className="flex gap-3 mb-3">
                  <img src={eb.coverImage} alt={eb.title} className="w-16 h-22 object-cover rounded-lg border theme-border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold theme-text-heading truncate">{eb.title}</h4>
                    <p className="text-[10px] theme-text-muted mt-1">By {eb.author}</p>
                    <span className="inline-block mt-2 text-[9px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-bold border border-purple-500/30">
                      DRM LICENSED
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openEbookReader(eb)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch in Web-Reader</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SECURITY & PREFERENCES */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b theme-border pb-4">
              <h2 className="text-base font-bold theme-text-heading flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Account Security & Credentials
              </h2>
              <p className="text-xs theme-text-muted mt-0.5">Manage login credentials, session verification, and university authentication.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="theme-card-sub border theme-border p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold theme-text-heading flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-blue-500" />
                    Account Password
                  </div>
                  <p className="text-[11px] theme-text-muted mt-0.5">Last updated 2 weeks ago</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Change Password
                </button>
              </div>

              <div className="theme-card-sub border theme-border p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold theme-text-heading flex items-center gap-1.5">
                    <MailCheck className="w-4 h-4 text-emerald-500" />
                    University Email OTP
                  </div>
                  <p className="text-[11px] theme-text-muted mt-0.5">
                    {currentUser.isEmailVerified ? 'Email is verified & secured' : 'Verify via 6-digit code'}
                  </p>
                </div>
                {!currentUser.isEmailVerified ? (
                  <button
                    onClick={handleOpenVerifyModal}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Verify Email
                  </button>
                ) : (
                  <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </span>
                )}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 border-t theme-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider theme-text-heading flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-500" />
                Notification & Alert Preferences
              </h3>

              <div className="space-y-2">
                {[
                  { label: 'Dropship Order & Dispatch Live SMS/Email', desc: 'Real-time updates when Amazon/Flipkart vendors ship your books', val: prefDropshipSms, setVal: setPrefDropshipSms },
                  { label: 'Campus P2P Book Exchange Alerts', desc: 'Instant notifications when students propose a book barter on your campus', val: prefExchangeAlerts, setVal: setPrefExchangeAlerts },
                  { label: 'Price Drop Alerts on Syllabus Books', desc: 'Notify when aggregated price dips below previous recorded lowest price', val: prefPriceDrop, setVal: setPrefPriceDrop },
                  { label: 'Semester Exam & CGPA Calculation Reminders', desc: 'Alerts for semester grading matrix updates and marksheets', val: prefExamReminders, setVal: setPrefExamReminders },
                ].map((pref, pidx) => (
                  <label key={pidx} className="flex items-center justify-between p-3 rounded-xl theme-card-sub border theme-border cursor-pointer hover:opacity-90">
                    <div>
                      <div className="text-xs font-bold theme-text-heading">{pref.label}</div>
                      <div className="text-[10px] theme-text-muted">{pref.desc}</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={pref.val} 
                      onChange={(e) => pref.setVal(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Active Device Session */}
            <div className="pt-4 border-t theme-border">
              <div className="text-xs font-bold theme-text-heading mb-1 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-500" />
                Active Session Info
              </div>
              <div className="text-xs theme-text-muted flex items-center gap-2">
                <span>Chrome Desktop (Windows)</span>
                <span>•</span>
                <span className="text-emerald-500 font-semibold">Campus WiFi Active Now</span>
                <span>•</span>
                <span className="font-mono text-[10px]">192.168.1.108</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TOP-UP WALLET MODAL */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setIsTopUpModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full theme-card-sub border theme-border hover:opacity-80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black theme-text-heading">Top-Up Campus Wallet</h3>
              <p className="text-xs theme-text-muted">
                Add instant funds for seamless textbook purchases, peer exchanges, and dropship orders.
              </p>
            </div>

            <form onSubmit={handleExecuteTopUp} className="space-y-5">
              
              {/* Preset Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider theme-text-muted block">Select Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {[200, 500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setTopUpAmount(amt);
                        setCustomTopUpInput('');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        topUpAmount === amt && !customTopUpInput 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                          : 'theme-card-sub border theme-border theme-text-heading'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="number"
                    value={customTopUpInput}
                    onChange={(e) => setCustomTopUpInput(e.target.value)}
                    placeholder="Or enter custom amount in ₹"
                    className="w-full p-3 rounded-xl theme-input border theme-border text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider theme-text-muted block">Payment Method</label>
                <select
                  value={topUpMethod}
                  onChange={(e) => setTopUpMethod(e.target.value)}
                  className="w-full p-3 rounded-xl theme-input border theme-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="UPI (GPay / PhonePe / Paytm)">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="Student Campus Debit Card">Student Campus Debit Card</option>
                  <option value="NetBanking">NetBanking (SBI / HDFC / ICICI / PNB)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add ₹{customTopUpInput || topUpAmount} to Wallet</span>
              </button>

            </form>

          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full theme-card-sub border theme-border hover:opacity-80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/30 flex items-center justify-center mx-auto shadow-lg">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black theme-text-heading">Change Password</h3>
              <p className="text-xs theme-text-muted">Ensure your account is secure with a strong password.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-muted">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full p-3 text-xs rounded-xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* EMAIL VERIFICATION OTP MODAL */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setIsVerifyModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full theme-card-sub border theme-border hover:opacity-80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/30 flex items-center justify-center mx-auto shadow-lg">
                <MailCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black theme-text-heading">Verify University Email</h3>
              <p className="text-xs theme-text-muted leading-relaxed">
                We sent a 6-digit verification security code to <b className="theme-text-heading">{currentUser.email}</b>
              </p>
            </div>

            {/* Demo Testing Helper Chip */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-xs text-blue-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Demo Testing Code:
              </span>
              <button
                onClick={() => {
                  const arr = demoCodeHelper.split('');
                  setOtpDigits(arr);
                }}
                className="font-mono font-black text-sm bg-blue-600 text-white px-2 py-0.5 rounded-lg shadow-sm hover:scale-105 transition-transform"
                title="Click to auto-fill code"
              >
                {demoCodeHelper} (Auto-Fill)
              </button>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              
              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prev = document.getElementById(`otp-input-${index - 1}`);
                        if (prev) (prev as HTMLInputElement).focus();
                      }
                    }}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-2xl theme-input border theme-border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Verify Email</span>
              </button>

              <div className="flex items-center justify-between text-xs theme-text-muted pt-2 border-t theme-border">
                <span>Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isSendingOtp}
                  className={`font-bold transition-colors cursor-pointer ${
                    resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'text-blue-500 hover:underline'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ORDER / ITEM CANCELLATION MODAL */}
      {cancelModalData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setCancelModalData(null)}
              className="absolute top-4 right-4 p-2 rounded-full theme-card-sub border theme-border hover:opacity-80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black theme-text-heading">
                {cancelModalData.itemId ? 'Cancel Book Item' : 'Cancel Order'}
              </h3>
              <p className="text-xs theme-text-muted leading-relaxed">
                {cancelModalData.itemId 
                  ? `Are you sure you want to cancel "${cancelModalData.itemTitle}"?` 
                  : `Are you sure you want to cancel order #${cancelModalData.orderId}?`}
              </p>
            </div>

            {/* Refund Info Banner */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                Wallet Refund Amount:
              </span>
              <span className="font-black text-sm">₹{cancelModalData.amount}</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                Reason for Cancellation:
              </label>

              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 rounded-xl theme-input border theme-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Found lower price on another website">Found lower price on another website</option>
                <option value="Accidentally ordered wrong edition/book">Accidentally ordered wrong edition/book</option>
                <option value="Semester curriculum / subject changed">Semester curriculum / subject changed</option>
                <option value="Delivery timeframe too long">Delivery timeframe too long</option>
                <option value="Already received notes from senior student">Already received notes from senior student</option>
                <option value="Other">Other reason</option>
              </select>

              {cancelReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-3 rounded-xl theme-input border theme-border text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalData(null)}
                className="flex-1 py-3 theme-card-sub border theme-border hover:opacity-80 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Cancel & Refund</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
