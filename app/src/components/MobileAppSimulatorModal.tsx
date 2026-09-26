import React, { useState } from 'react';
import { 
  X, Smartphone, Sparkles, Search, ShoppingCart, 
  BookOpen, Calculator, ArrowRightLeft, CheckCircle2, 
  ArrowRight, ShieldCheck, Heart, User, Bell
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { useApp } from '../context/AppContext';

interface MobileAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileAppSimulatorModal: React.FC<MobileAppSimulatorModalProps> = ({
  isOpen, onClose, setActiveTab
}) => {
  const { currentUser, catalogBooks, cart, addToCart, addToast } = useApp();
  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'cgpa' | 'profile'>('home');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const featuredBooks = catalogBooks.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="theme-card border theme-border rounded-3xl max-w-sm w-full p-4 sm:p-5 relative shadow-2xl flex flex-col items-center animate-slide-right my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full theme-card-sub border theme-border theme-text-muted hover:theme-text-heading cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Companion App</span>
          </div>
          <p className="text-[11px] theme-text-muted">Live sync with web account ({currentUser.name})</p>
        </div>

        {/* Realistic iPhone Device Shell */}
        <div className="w-[280px] sm:w-[300px] h-[560px] bg-slate-950 rounded-[44px] p-3.5 border-4 border-slate-700 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          
          {/* Dynamic Island / Top Speaker Notch */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-900" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>

          {/* Mobile Screen Container */}
          <div className="flex-1 bg-slate-900 rounded-[32px] overflow-hidden flex flex-col text-slate-100 p-3 space-y-2.5 overflow-y-auto">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">
                  SSS
                </div>
                <span className="font-bold text-xs">Study Student Shop</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ₹{currentUser.walletBalance}
              </span>
            </div>

            {/* TAB: HOME */}
            {mobileTab === 'home' && (
              <div className="space-y-2.5 text-xs">
                {/* Hero Banner */}
                <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md">
                  <div className="text-[9px] font-bold uppercase opacity-80">Instant Campus Savings</div>
                  <div className="font-black text-sm mt-0.5">Lowest Book Prices</div>
                  <div className="text-[10px] opacity-90 mt-1">Amazon & Flipkart live comparisons</div>
                </div>

                {/* Quick 2x2 Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('search');
                    }}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left font-bold transition-colors cursor-pointer"
                  >
                    🔍 Find Lowest
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('academic');
                    }}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left font-bold transition-colors cursor-pointer"
                  >
                    📊 CGPA Engine
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('resell');
                    }}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left font-bold transition-colors cursor-pointer"
                  >
                    🔄 P2P Barter
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('studyhub');
                    }}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-left font-bold transition-colors cursor-pointer"
                  >
                    🤖 AI Tutor
                  </button>
                </div>

                {/* Featured Lowest Book List */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Trending Textbooks</div>
                  {featuredBooks.map(b => (
                    <div key={b.id} className="p-2 bg-slate-800/60 border border-slate-700/70 rounded-xl flex items-center justify-between text-left">
                      <div className="truncate max-w-[150px]">
                        <div className="font-bold text-[11px] truncate text-slate-200">{b.title}</div>
                        <div className="text-[9px] text-emerald-400 font-bold">Lowest: ₹{b.lowestPrice || 450}</div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            bookId: b.id,
                            title: b.title,
                            author: b.author,
                            coverImage: b.coverImage,
                            type: b.type,
                            price: b.lowestPrice || 450,
                            quantity: 1
                          });
                          addToast('success', 'Added to Cart', `${b.title} added via Mobile App`);
                        }}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SEARCH */}
            {mobileTab === 'search' && (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Search books, author, ISBN..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
                />
                <div className="text-[10px] text-slate-400">Quick suggestions:</div>
                <div className="flex flex-wrap gap-1">
                  {['Engineering Math', 'Data Structures', 'Physics', 'Circuit Theory'].map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        onClose();
                        setActiveTab('search');
                      }}
                      className="px-2 py-1 bg-slate-800 text-[10px] rounded-lg text-slate-300 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CGPA */}
            {mobileTab === 'cgpa' && (
              <div className="space-y-2.5 text-xs text-center">
                <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Target CGPA</div>
                  <div className="text-2xl font-black text-blue-400">8.24</div>
                  <div className="text-[10px] text-emerald-400 font-bold">AKTU CBCS Scale: 10.0</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('academic');
                  }}
                  className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Open Full CGPA Calculator ➔
                </button>
              </div>
            )}

            {/* TAB: PROFILE */}
            {mobileTab === 'profile' && (
              <div className="space-y-2 text-xs text-left">
                <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                  <div className="font-bold text-slate-200">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.collegeName}</div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-1">Wallet: ₹{currentUser.walletBalance}</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('profile');
                  }}
                  className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Manage Orders & OTP Verification ➔
                </button>
              </div>
            )}

          </div>

          {/* Bottom iOS Navigation Bar */}
          <div className="flex items-center justify-around pt-2 border-t border-slate-800 text-[9px] text-slate-400">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center cursor-pointer ${mobileTab === 'home' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => setMobileTab('search')}
              className={`flex flex-col items-center cursor-pointer ${mobileTab === 'search' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
            >
              <span>🔍</span>
              <span>Search</span>
            </button>
            <button
              onClick={() => setMobileTab('cgpa')}
              className={`flex flex-col items-center cursor-pointer ${mobileTab === 'cgpa' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
            >
              <span>📊</span>
              <span>CGPA</span>
            </button>
            <button
              onClick={() => setMobileTab('profile')}
              className={`flex flex-col items-center cursor-pointer ${mobileTab === 'profile' ? 'text-blue-400 font-bold' : 'hover:text-slate-200'}`}
            >
              <span>👤</span>
              <span>Account</span>
            </button>
          </div>

          {/* Bottom Home Indicator */}
          <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-1.5" />

        </div>

      </div>
    </div>
  );
};
