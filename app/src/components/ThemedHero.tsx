import React, { useState } from 'react';
import { 
  ArrowRight, Search, Play, Users, BookOpen, 
  DollarSign, Building2, TrendingUp, Sparkles, CheckCircle2,
  ArrowRightLeft, BookCheck, Calculator, Smartphone, Laptop,
  ShieldCheck, Zap, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from './Navbar';
import { AIVideoDemoModal } from './AIVideoDemoModal';
import { MobileAppSimulatorModal } from './MobileAppSimulatorModal';

interface ThemedHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ThemedHero: React.FC<ThemedHeroProps> = ({ setActiveTab }) => {
  const { currentUser } = useApp();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileAppModalOpen, setIsMobileAppModalOpen] = useState(false);

  return (
    <div className="relative mb-10">
      
      {/* Main Minimal SaaS Hero Container */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12 theme-card border theme-border transition-all">
        
        {/* Soft Ambient Glow in Background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Badge: One Platform. Endless Possibilities. */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span>One Platform. Endless Possibilities.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black theme-text-heading tracking-tight leading-[1.18]">
              Everything Students Need. <br />
              <span className="text-blue-600 dark:text-blue-400">
                One Intelligent Platform.
              </span>
            </h1>

            {/* Sub-headline description */}
            <p className="theme-text-muted text-sm sm:text-base leading-relaxed max-w-xl">
              Buy, Sell, Compare, Exchange Books, Calculate CGPA, Read E-Books and access powerful student tools — simple, clean and fast.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => setActiveTab('search')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-5 py-3.5 theme-card-sub hover:opacity-90 active:scale-98 theme-text-heading border theme-border rounded-xl font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-102 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Metrics Ribbon (50K+ Students, 10K+ Books, ₹2M+ Saved, 100+ Colleges) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t theme-border">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 text-left p-1.5 rounded-xl hover:bg-blue-500/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black theme-text-heading leading-tight">50K+</div>
                  <div className="text-[11px] theme-text-muted">Students</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className="flex items-center gap-2.5 text-left p-1.5 rounded-xl hover:bg-emerald-500/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black theme-text-heading leading-tight">10K+</div>
                  <div className="text-[11px] theme-text-muted">Books</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 text-left p-1.5 rounded-xl hover:bg-indigo-500/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black theme-text-heading leading-tight">₹2M+</div>
                  <div className="text-[11px] theme-text-muted">Saved</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('academic')}
                className="flex items-center gap-2.5 text-left p-1.5 rounded-xl hover:bg-purple-500/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-black theme-text-heading leading-tight">100+</div>
                  <div className="text-[11px] theme-text-muted">Colleges</div>
                </div>
              </button>
            </div>

          </div>

          {/* Right Column: Realistic Minimal SaaS Laptop & Phone Studio Mockup */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Main Laptop Mockup Frame */}
            <div className="w-full max-w-md bg-slate-900 dark:bg-slate-950 p-3 rounded-2xl border border-slate-700/80 shadow-2xl relative">
              
              {/* Laptop Screen Bezel */}
              <div className="relative rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 space-y-3">
                
                {/* Laptop Top Browser/App Navigation Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 ml-2">Study Student Shop OS</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    Live v2.5
                  </span>
                </div>

                {/* Dashboard Top Row Stats: CGPA 8.24 + Books Saved ₹4,200 */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveTab('academic')}
                    className="p-3 bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm text-left transition-all group cursor-pointer"
                    title="Click to calculate your university SGPA/CGPA"
                  >
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider group-hover:text-blue-500">
                      Target CGPA
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">8.24</span>
                      <span className="text-xs font-bold text-emerald-500">↑ +0.3</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="p-3 bg-white dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm text-left transition-all group cursor-pointer"
                    title="Click to view your orders and wallet balance"
                  >
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider group-hover:text-emerald-500">
                      Books Saved
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹4,200</span>
                    </div>
                  </button>
                </div>

                {/* Interactive 4-Tile Feature Grid in Mockup Screen */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('search')}
                    className="p-2.5 bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      <Search className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span>Find Books</span>
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                      AI Price Finder
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('search')}
                    className="p-2.5 bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                      <span>Compare</span>
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Across Platforms
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('resell')}
                    className="p-2.5 bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                      <span>Sell/Exchange</span>
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Campus Community
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('ebooks')}
                    className="p-2.5 bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-left transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      <BookCheck className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span>E-Books</span>
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Read Anywhere
                    </div>
                  </button>
                </div>

              </div>

              {/* Laptop Keyboard Base Notch & Shadow */}
              <div className="w-32 h-1.5 bg-slate-600 rounded-full mx-auto mt-2" />
            </div>

            {/* Mobile Companion App Mockup Overlay on Bottom-Right */}
            <button
              onClick={() => setIsMobileAppModalOpen(true)}
              className="absolute -bottom-4 -right-2 sm:-right-4 w-28 sm:w-32 bg-slate-900 dark:bg-black p-1.5 rounded-2xl border-2 border-slate-600/80 shadow-2xl hidden sm:block text-left hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title="Click to launch interactive Mobile Companion App Simulator"
            >
              <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-1.5" />
              <div className="bg-white dark:bg-slate-900 rounded-xl p-2 space-y-1.5 text-center">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[9px] flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                  SSS
                </div>
                <div className="text-[9px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                  Mobile App
                </div>
                <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  ₹ Lowest Sync
                </div>
              </div>
            </button>

          </div>

        </div>

      </div>

      {/* AI Video Demo Walkthrough Modal */}
      <AIVideoDemoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Mobile Companion App Interactive Simulator Modal */}
      <MobileAppSimulatorModal
        isOpen={isMobileAppModalOpen}
        onClose={() => setIsMobileAppModalOpen(false)}
        setActiveTab={setActiveTab}
      />

    </div>
  );
};
