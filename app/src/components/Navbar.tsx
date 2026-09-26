import React from 'react';
import { 
  Menu, ShoppingCart, AlertTriangle, 
  Sun, Moon, CheckCircle2,
  ShieldCheck, Zap, LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type ActiveTab = 'search' | 'resell' | 'academic' | 'studyhub' | 'ebooks' | 'profile' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCart: () => void;
  openMenuDrawer: () => void;
  openAIAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, setActiveTab, openCart, openMenuDrawer, openAIAssistant = () => {} 
}) => {
  const { 
    currentUser, switchUser, logoutUser, cart, maintenanceState, 
    theme, setTheme 
  } = useApp();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleLightDark = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 theme-nav backdrop-blur-xl border-b theme-border transition-colors duration-200">
      
      {/* Maintenance Notice Banner if active */}
      {maintenanceState.isMaintenanceMode && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1 text-xs text-amber-500 dark:text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 animate-pulse text-amber-500" />
            <span className="font-bold text-[10px] uppercase tracking-wider bg-amber-500/20 px-1.5 py-0.5 rounded">
              Maintenance Active
            </span>
            <span className="truncate font-medium">{maintenanceState.message}</span>
          </div>
          <span className="text-[10px] opacity-80 font-mono hidden sm:inline">Admin Bypass Enabled</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: 3-LINE MENU BAR AT TOP LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={openMenuDrawer}
              className="p-2.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-white" />
              <span className="hidden sm:inline font-bold">Menu</span>
            </button>
          </div>

          {/* Right Action Bar: AI Assistant, Light/Dark Switcher, Admin Button, User Profile, Cart & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Assistant Quick Trigger Button */}
            <button
              onClick={openAIAssistant}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/15 to-blue-600/15 hover:from-purple-600/25 hover:to-blue-600/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
              title="Open StudyVerse AI Assistant"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Minimal SaaS Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleLightDark}
              className="p-2.5 rounded-xl theme-card-sub border theme-border hover:opacity-85 active:scale-95 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline theme-text-heading text-xs">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="hidden md:inline theme-text-heading text-xs">Dark</span>
                </>
              )}
            </button>

            {/* ADMIN CONTROLS BUTTON: Strictly visible only when logged in as Admin */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30'
                }`}
                title="Open Admin Command Center"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Controls</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}

            {/* USER PROFILE SECTION BUTTON */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border theme-border transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'theme-card-sub hover:opacity-85'
              }`}
              title="Open My Profile, Orders & Email Verification"
            >
              <div className="relative">
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40 flex-shrink-0"
                />
                {currentUser.isEmailVerified && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full" />
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold leading-none truncate max-w-[90px] theme-text-heading">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] theme-text-muted mt-0.5 font-mono">
                  ₹{currentUser.walletBalance}
                </div>
              </div>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl theme-card-sub border theme-border hover:opacity-85 transition-all active:scale-95 cursor-pointer"
              title="View Cart & Orders"
            >
              <ShoppingCart className="w-4 h-4 text-blue-500" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Logout Button */}
            <button
              onClick={logoutUser}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 transition-all active:scale-95 cursor-pointer"
              title="Log out of account"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
