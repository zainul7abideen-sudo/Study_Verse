import React from 'react';
import { 
  X, Sparkles, ArrowRightLeft, BookCheck, Calculator, 
  ShieldCheck, ShoppingCart, User as UserIcon, Moon, Sun, 
  Palette, LogIn, LogOut, CheckCircle2, ChevronRight, Package,
  Brain, Zap, Laptop, GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from './Navbar';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCart: () => void;
  openAuthModal: () => void;
  openAIAssistant?: () => void;
  openLegalModal?: (tab: 'privacy' | 'terms' | 'contact') => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen, onClose, activeTab, setActiveTab, openCart, openAuthModal, openAIAssistant = () => {}, openLegalModal = () => {}
}) => {
  const { 
    currentUser, switchUser, logoutUser, cart, 
    theme, setTheme 
  } = useApp();

  if (!isOpen) return null;

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logoutUser();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Slide-over Drawer Panel on the LEFT side */}
      <div className="relative z-10 w-full max-w-md theme-card border-r theme-border h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b theme-border flex items-center justify-between theme-card-sub">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-blue-500/30">
              SSS
            </div>
            <div>
              <h3 className="font-bold text-sm theme-text-heading leading-none">Minimal SaaS Hub</h3>
              <p className="text-[10px] theme-text-muted mt-0.5">Study Student Shop Platform</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full theme-card-sub border theme-border hover:opacity-80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card & Email Verification Badge */}
        <div className="p-4 theme-card-sub border-b theme-border space-y-2.5">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-3 cursor-pointer group"
              title="Click to open full User Profile"
            >
              <div className="relative">
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt={currentUser.name} 
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-blue-500/50 group-hover:scale-105 transition-transform"
                />
                {currentUser.isEmailVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
                )}
              </div>
              <div>
                <div className="font-bold text-xs theme-text-heading group-hover:text-blue-500 transition-colors">
                  {currentUser.name} ➔
                </div>
                <div className="text-[10px] theme-text-muted truncate max-w-[150px]">
                  {currentUser.university || 'AKTU'} • {currentUser.semester || 'Sem 5'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block text-[9px] uppercase font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 rounded">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">
                    ₹{currentUser.walletBalance}
                  </span>
                </div>
              </div>
            </div>

            {/* Auth Action Buttons (Switch Account + Logout) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="px-2 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Switch User Account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Sign Out of Account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Main Navigation Group */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold theme-text-muted px-2 tracking-wider mb-1">
              Modules & Features
            </div>

            {/* User Profile Section Button */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                  : 'theme-card-sub hover:opacity-90 border theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500">
                  <Package className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">User Profile & Orders Section</div>
                  <div className="text-[10px] opacity-75">Order history, item cancellations & wallet balance</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            {/* Admin Command Center Link: Strictly visible only when logged in as Admin */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-500">
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Admin Command Center (Active)</div>
                    <div className="text-[10px] opacity-75">Maintenance Mode, RBAC Users & Audit Logs</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>
            )}

            {/* StudyVerse AI Copilot & Guidance Button */}
            <button
              onClick={() => {
                onClose();
                openAIAssistant();
              }}
              className="w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-blue-500/15 hover:from-purple-500/25 hover:to-blue-500/25 border border-purple-500/30 text-purple-600 dark:text-purple-300 cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/25 text-purple-600 dark:text-purple-300">
                  <Brain className="w-4 h-4 text-purple-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black flex items-center gap-1.5">
                    <span>StudyVerse AI Assistant</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-[9px] uppercase font-bold">
                      Gemini
                    </span>
                  </div>
                  <div className="text-[10px] opacity-85">Instant concept answers, study guidance & book lookup</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-75" />
            </button>

            <button
              onClick={() => handleNavClick('search')}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                  : 'theme-card-sub hover:opacity-90 border theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">Find Books & Price Aggregator</div>
                  <div className="text-[10px] opacity-75">Amazon, Flipkart, Bookswagon Lowest Prices</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('resell')}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                activeTab === 'resell'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                  : 'theme-card-sub hover:opacity-90 border theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">P2P Used Resale & Book Swap</div>
                  <div className="text-[10px] opacity-75">Sell course materials or exchange for free</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('studyhub')}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                activeTab === 'studyhub'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'theme-card-sub hover:opacity-90 border theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-500">
                  <Brain className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">AI Study Hub & Attendance</div>
                  <div className="text-[10px] opacity-75">75% Bunk radar, AI summarizer & flashcards</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('academic')}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                activeTab === 'academic'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                  : 'theme-card-sub hover:opacity-90 border theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500">
                  <Calculator className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">Indian Universities CGPA Engine</div>
                  <div className="text-[10px] opacity-75">AKTU, VTU, DU, SPPU, MU & Marks Predictor</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              onClick={() => handleNavClick('ebooks')}
              className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                activeTab === 'ebooks'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'theme-card-sub hover:opacity-90 border theme-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-500">
                  <BookCheck className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">E-Books & Interactive Web Reader</div>
                  <div className="text-[10px] opacity-75">Instant digital notes & solved papers</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>

          {/* Minimal SaaS Appearance Selector (Light Mode & Dark Mode) */}
          <div className="space-y-2 pt-2 border-t theme-border">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold theme-text-muted px-2">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-500" />
                Theme Appearance
              </span>
              <span className="text-[10px] font-semibold text-blue-500">Minimal SaaS</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 border-blue-500 ring-2 ring-blue-500/30 font-bold shadow-md'
                    : 'theme-card-sub border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-xs font-bold">Light Mode</div>
                    <div className="text-[10px] opacity-70">Clean SaaS</div>
                  </div>
                </div>
                {theme === 'light' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-white border-blue-500 ring-2 ring-blue-500/30 font-bold shadow-md'
                    : 'theme-card-sub border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold">Dark Mode</div>
                    <div className="text-[10px] opacity-70">Obsidian Slate</div>
                  </div>
                </div>
                {theme === 'dark' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                )}
              </button>
            </div>
          </div>

          {/* Trust, Legal & Student Support Links */}
          <div className="space-y-1.5 pt-2 border-t theme-border">
            <div className="text-[10px] uppercase font-bold theme-text-muted px-2 tracking-wider">
              Trust & Governance
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 px-1">
              <button
                onClick={() => {
                  onClose();
                  openLegalModal('privacy');
                }}
                className="p-2 rounded-xl theme-card-sub border theme-border text-[11px] font-semibold text-center hover:text-blue-500 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                onClick={() => {
                  onClose();
                  openLegalModal('terms');
                }}
                className="p-2 rounded-xl theme-card-sub border theme-border text-[11px] font-semibold text-center hover:text-blue-500 transition-colors cursor-pointer"
              >
                Terms
              </button>
              <button
                onClick={() => {
                  onClose();
                  openLegalModal('contact');
                }}
                className="p-2 rounded-xl theme-card-sub border theme-border text-[11px] font-semibold text-center hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Help Desk
              </button>
            </div>
          </div>

          {/* Cart Quick Action & Logout Button */}
          <div className="pt-2 border-t theme-border space-y-2">
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="w-full py-2.5 px-4 theme-card-sub border theme-border hover:opacity-90 font-semibold text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                <span>Open Cart & Checkout</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  {cartCount} Items
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Account</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
