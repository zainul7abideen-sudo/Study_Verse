import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { AuthModal } from './components/AuthModal';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { BookSearchView } from './components/BookSearchView';
import { ResellExchangeView } from './components/ResellExchangeView';
import { AcademicCalculatorsView } from './components/AcademicCalculatorsView';
import { StudyHubView } from './components/StudyHubView';
import { EbookStoreView } from './components/EbookStoreView';
import { EbookReaderModal } from './components/EbookReaderModal';
import { CartAndCheckoutModal } from './components/CartAndCheckoutModal';
import { UserProfileView } from './components/UserProfileView';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { ToastContainer } from './components/ToastContainer';
import { BookOpen, ShieldCheck, Heart, Sparkles, MapPin, ExternalLink, ArrowUpRight, Palette } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentUser, maintenanceState, isBypassed, 
    activeEbook, closeEbookReader, theme,
    isAuthModalOpen, closeAuthModal, openAuthModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>('search');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // MAINTENANCE MODE GUARD:
  if (maintenanceState.isMaintenanceMode && !isBypassed && currentUser.role !== 'admin') {
    return <MaintenanceScreen />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden ${
      theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-[#fbfcfd] text-slate-900'
    }`}>
      
      {/* Background Ambient Glow & Subtle Grid */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-50 z-0" />
      
      {/* Dynamic Minimal SaaS Accent Glow Orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-25 bg-blue-500/15 dark:bg-blue-600/20 z-0" />
      <div className="fixed bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none opacity-20 bg-indigo-500/10 dark:bg-indigo-600/15 z-0" />

      {/* Top Sticky Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openCart={() => setIsCartOpen(true)} 
        openMenuDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {activeTab === 'search' && <BookSearchView setActiveTab={setActiveTab} />}
        {activeTab === 'resell' && <ResellExchangeView />}
        {activeTab === 'studyhub' && <StudyHubView />}
        {activeTab === 'ebooks' && <EbookStoreView />}
        {activeTab === 'academic' && <AcademicCalculatorsView />}
        {activeTab === 'profile' && <UserProfileView />}
        {activeTab === 'admin' && <AdminCommandCenter />}
      </main>

      {/* 3-Line Hamburger Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCart={() => setIsCartOpen(true)}
        openAuthModal={openAuthModal}
      />

      {/* Unified Auth Modal (Login, Register, Forgot Password & Admin Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />

      {/* Cart & Unified Checkout Modal */}
      <CartAndCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(orderId) => {
          setActiveTab('profile');
        }}
      />

      {/* Interactive In-Browser E-Reader Modal */}
      {activeEbook && (
        <EbookReaderModal
          ebook={activeEbook}
          onClose={closeEbookReader}
        />
      )}

      {/* Floating System Toast Alerts */}
      <ToastContainer />

      {/* Modern Theme-Adaptive Footer */}
      <footer className="border-t theme-border theme-card-sub py-10 mt-16 theme-text-muted text-xs relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/25">
                  SSS
                </div>
                <span className="font-bold text-sm theme-text-heading">Study Student Shop</span>
              </div>
              <p className="theme-text-muted text-xs leading-relaxed">
                Empowering college students across India with peer-to-peer textbook resale, automated lowest-price book ordering, digital e-books, and university CGPA engines.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider mb-3">Campus Commerce</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('search')} className="hover:text-blue-500 transition-colors">Search Lowest Book Prices</button></li>
                <li><button onClick={() => setActiveTab('resell')} className="hover:text-blue-500 transition-colors">P2P Book Resale Marketplace</button></li>
                <li><button onClick={() => setActiveTab('resell')} className="hover:text-blue-500 transition-colors">Book Exchange / Barter</button></li>
                <li><button onClick={() => setActiveTab('ebooks')} className="hover:text-blue-500 transition-colors">Digital Library & Notes</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider mb-3">Academic University Tools</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('academic')} className="hover:text-amber-500 transition-colors">AKTU CGPA & % Calculator</button></li>
                <li><button onClick={() => setActiveTab('academic')} className="hover:text-amber-500 transition-colors">VTU 10-Point CBCS Engine</button></li>
                <li><button onClick={() => setActiveTab('academic')} className="hover:text-amber-500 transition-colors">Delhi University (DU) Scale</button></li>
                <li><button onClick={() => setActiveTab('academic')} className="hover:text-amber-500 transition-colors">SPPU & Mumbai University</button></li>
                <li><button onClick={() => setActiveTab('academic')} className="hover:text-amber-500 transition-colors">End-Sem Target Predictor</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider mb-3">Governance & Access</h4>
              <ul className="space-y-2">
                <li><button onClick={openAuthModal} className="text-blue-500 font-semibold hover:underline">Student / Admin Sign In</button></li>
                <li><span>Automated Dropship Worker: Active</span></li>
                <li><span>Real-time Google Books Sync: Active</span></li>
                <li>
                  <button 
                    onClick={() => {
                      if (currentUser.role === 'admin') setActiveTab('admin');
                      else openAuthModal();
                    }} 
                    className="hover:text-rose-500 theme-text-muted font-mono transition-colors"
                  >
                    Admin Control Panel
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t theme-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] theme-text-muted">
            <div>
              © 2026 Study Student Shop (SSS). All rights reserved. Built for engineering & degree students across India.
            </div>
            <div className="flex items-center gap-1">
              <span>Crafted for student success</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
