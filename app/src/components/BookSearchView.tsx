import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, TrendingDown, ExternalLink, ShoppingCart, 
  Zap, Star, Filter, Check, Info, ShieldCheck, ArrowRight, BookOpen,
  GraduationCap, X, SlidersHorizontal, ArrowUpDown, Brain, Lightbulb,
  CheckCircle2, Globe, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, BookCategory, VendorPrice } from '../types';
import { ThemedHero } from './ThemedHero';
import { ActiveTab } from './Navbar';
import { getAIBookRecommendation, AIBookRecommendation } from '../services/aiService';

const CATEGORIES: (BookCategory | 'All Categories')[] = [
  'All Categories',
  'Computer Science & IT',
  'Basic Sciences & Math',
  'Mechanical Engineering',
  'Medical & Dental',
  'Commerce & MBA',
  'Competitive Exams (GATE/CAT/UPSC)'
];

interface BookSearchViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onAutoOrderClick?: (book: Book, selectedVendor?: VendorPrice) => void;
}

export const BookSearchView: React.FC<BookSearchViewProps> = ({ setActiveTab = () => {} }) => {
  const { 
    searchQuery, setSearchQuery, searchResults, 
    performSearch, isSearching, addToCart, currentUser, addToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'All Categories'>('All Categories');
  const [sortBy, setSortBy] = useState<'relevance' | 'lowest_price' | 'highest_savings' | 'rating'>('relevance');
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);


  // AI Syllabus & Requirement Recommendation State
  const [aiRecommendation, setAiRecommendation] = useState<AIBookRecommendation | null>(null);
  const [isAiRecommending, setIsAiRecommending] = useState<boolean>(false);

  // Debounce search input for immediate live Google search execution
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleAiSyllabusMatch = async (customQuery?: string) => {
    const targetQ = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (!targetQ) {
      addToast('info', 'Enter Requirement', 'Please type a subject, topic, or university semester requirement.');
      return;
    }

    setIsAiRecommending(true);
    performSearch(targetQ);

    try {
      const rec = await getAIBookRecommendation(targetQ);
      if (rec) {
        setAiRecommendation(rec);
        if (rec.primaryTextbook?.title) {
          // Trigger search for recommended primary textbook as well
          performSearch(rec.primaryTextbook.title);
        }
        addToast('success', 'AI Recommendation Ready', `Found prescribed textbook match for "${targetQ}"`);
      }
    } catch (err) {
      console.error('AI book recommendation error:', err);
    } finally {
      setIsAiRecommending(false);
    }
  };

  // Filter and Sort results
  const processedResults = searchResults
    .filter(book => {
      if (selectedCategory === 'All Categories') return true;
      return book.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'relevance') {
        return 0; // Preserve high-relevance match ranking from search engine
      }
      if (sortBy === 'lowest_price') {
        return (a.lowestPrice || 0) - (b.lowestPrice || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'highest_savings') {
        const savingsA = (a.prices?.[0]?.originalPrice || 1000) - (a.lowestPrice || 500);
        const savingsB = (b.prices?.[0]?.originalPrice || 1000) - (b.lowestPrice || 500);
        return savingsB - savingsA;
      }
      return 0;
    });


  // Recommended search tags based on registered student profile
  const studentTags = currentUser.branch?.includes('Computer') || currentUser.branch?.includes('CS')
    ? ['Operating Systems Galvin', 'Algorithms CLRS', 'DBMS Korth', 'Computer Networks Peterson', 'GATE CSE Topic-Wise']
    : currentUser.branch?.includes('Mechanical') || currentUser.branch?.includes('Mech')
    ? ['Engineering Thermodynamics PK Nag', 'Strength of Materials RK Rajput', 'Fluid Mechanics RK Bansal', 'Theory of Machines SS Rattan']
    : currentUser.branch?.includes('Commerce') || currentUser.degree?.includes('B.Com')
    ? ['Financial Management Prasanna Chandra', 'Cost Accounting Maheshwari', 'Corporate Law', 'Direct Tax Singhania']
    : ['Higher Engineering Mathematics Grewal', 'Engineering Physics', 'Data Structures in C', 'Basic Electrical Engg'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Dynamic Themed Hero Matching Selected Visual Style */}
      <ThemedHero setActiveTab={setActiveTab} />
      
      {/* 2. Real-Time Price Search & Aggregator */}
      <section className="relative rounded-3xl theme-card border theme-border p-6 sm:p-10 overflow-hidden shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-500 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
            <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 animate-pulse" />
            Live Google Books & Search Engine Price Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight theme-text-heading">
            Find Any Book at the Guaranteed Lowest Price
          </h1>

          <p className="theme-text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Search any course requirement, topic, author, or ISBN. Our engine accesses Google Books search and compares live pricing across Amazon, Flipkart, Bookswagon, and campus peer sellers.
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleManualSearch} className="pt-4 max-w-2xl mx-auto space-y-3">
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none theme-text-muted">
                <Search className={`w-5 h-5 ${isSearching || isAiRecommending ? 'text-blue-500 animate-pulse' : 'theme-text-muted'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Requirement, Title, Author, ISBN (e.g. 'Operating Systems', 'Galvin', 'CLRS', 'Maths Grewal')..."
                className="w-full theme-input theme-text-heading placeholder:opacity-60 pl-12 pr-44 py-4 rounded-2xl border theme-border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm sm:text-base outline-none transition-all shadow-inner font-medium"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setAiRecommendation(null);
                      performSearch('');
                    }}
                    className="p-1 rounded-full theme-card-sub hover:opacity-80 text-xs theme-text-muted cursor-pointer"
                    title="Clear Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleAiSyllabusMatch()}
                  disabled={isAiRecommending}
                  className="px-2.5 sm:px-3 py-2 bg-purple-600/15 hover:bg-purple-600/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  title="Use Gemini AI to match university syllabus"
                >
                  <Brain className={`w-3.5 h-3.5 ${isAiRecommending ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">AI Match</span>
                </button>

                <button
                  type="submit"
                  className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Personalized Recommended tags based on User's registered University & Branch */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs theme-text-muted">
              <span className="font-semibold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <GraduationCap className="w-3.5 h-3.5" />
                {currentUser.university || 'AKTU'} {currentUser.semester || 'Sem 5'} Recommended:
              </span>
              {studentTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    performSearch(tag);
                  }}
                  className="px-2.5 py-0.5 rounded-full theme-card-sub hover:opacity-90 text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium transition-colors border theme-border cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

        </div>

      </section>

      {/* AI Syllabus & Requirement Recommendation Box if active */}
      {aiRecommendation && (
        <div className="theme-card border border-purple-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl relative overflow-hidden bg-purple-500/5">
          <div className="flex items-center justify-between border-b theme-border pb-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-black text-sm sm:text-base">
              <Brain className="w-5 h-5 text-purple-500" />
              <span>StudyVerse AI Syllabus & Textbook Analysis</span>
            </div>
            <button
              onClick={() => setAiRecommendation(null)}
              className="p-1 rounded-full theme-card-sub border theme-border text-xs text-slate-400 hover:opacity-80"
              title="Close AI card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs theme-text-heading font-medium leading-relaxed">
            {aiRecommendation.aiSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Primary Textbook */}
            <div className="theme-card-sub border theme-border p-4 rounded-2xl space-y-2">
              <div className="text-[10px] uppercase font-bold text-purple-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Primary Prescribed Standard Textbook
              </div>
              <h4 className="font-bold text-sm theme-text-heading">
                {aiRecommendation.primaryTextbook.title}
              </h4>
              <p className="text-xs theme-text-muted">
                Author: <b className="theme-text-heading">{aiRecommendation.primaryTextbook.author}</b> • {aiRecommendation.primaryTextbook.publisher || 'Academic Press'}
              </p>
              {aiRecommendation.primaryTextbook.syllabusRelevance && (
                <p className="text-[11px] text-blue-500 dark:text-cyan-400 italic">
                  "{aiRecommendation.primaryTextbook.syllabusRelevance}"
                </p>
              )}
              <button
                onClick={() => {
                  setSearchQuery(aiRecommendation.primaryTextbook.title);
                  performSearch(aiRecommendation.primaryTextbook.title);
                }}
                className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>View Multi-Vendor Prices for this Book</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Exam Strategy & Alternatives */}
            <div className="theme-card-sub border theme-border p-4 rounded-2xl space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-500 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  University Exam 9+ SGPA Strategy
                </div>
                <p className="text-xs theme-text-muted mt-1 leading-relaxed">
                  {aiRecommendation.examPreparationTip}
                </p>
              </div>

              {aiRecommendation.alternativeBooks?.length > 0 && (
                <div className="pt-2 border-t theme-border">
                  <div className="text-[10px] uppercase font-bold theme-text-muted mb-1">Alternative Reference:</div>
                  <div className="text-xs theme-text-heading font-medium">
                    {aiRecommendation.alternativeBooks[0].title} ({aiRecommendation.alternativeBooks[0].author})
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Academic Personalization Ribbon */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
            {currentUser.university?.slice(0, 3) || 'SSS'}
          </div>
          <div>
            <div className="font-bold theme-text-heading">
              Prescribed Textbooks for {currentUser.name} ({currentUser.university || 'AKTU'} • {currentUser.branch || 'CSE'} • {currentUser.semester || 'Semester 5'})
            </div>
            <div className="theme-text-muted text-[11px]">
              Campus: {currentUser.collegeName || 'Institute of Engineering and Technology'} • {currentUser.campusLocation}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('academic')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer self-end sm:self-center"
        >
          <span>Calculate {currentUser.university} CGPA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-1">
          <Filter className="w-4 h-4 theme-text-muted flex-shrink-0 ml-1 mr-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 flex-shrink-0 text-xs theme-text-muted">
          <ArrowUpDown className="w-3.5 h-3.5 text-blue-500" />
          <label htmlFor="book-sort-by" className="font-semibold theme-text-muted">Sort by:</label>
          <select
            id="book-sort-by"
            name="sortBy"
            aria-label="Sort books by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="theme-card-sub theme-text-heading border theme-border rounded-xl px-2.5 py-1.5 text-xs outline-none cursor-pointer font-semibold"
          >
            <option value="relevance">Best Match (Relevance)</option>
            <option value="lowest_price">Lowest Price (Guaranteed)</option>
            <option value="highest_savings">Highest Savings (₹ / %)</option>
            <option value="rating">Top Rated (★)</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold theme-text-heading flex items-center gap-2">
            <span>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Prescribed Textbooks & Multi-Vendor Arbitrage'}
            </span>
            <span className="text-xs font-semibold theme-card-sub text-blue-500 px-2.5 py-0.5 rounded-full border theme-border">
              {processedResults.length} Found
            </span>
          </h2>
          <p className="text-xs theme-text-muted">
            Live prices auto-compared across Amazon, Flipkart, Bookswagon & SSS Peer Resale
          </p>
        </div>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedResults.map((book) => {
          const prices = book.prices || [];
          const lowestVendor = prices.find(p => p.isLowest) || prices[0];
          const mrp = lowestVendor ? lowestVendor.originalPrice : (book.lowestPrice || 600) * 1.3;
          const bestPrice = book.lowestPrice || (lowestVendor ? lowestVendor.price : 450);
          const savingsAmount = Math.max(0, mrp - bestPrice);
          const savingsPercent = Math.round((savingsAmount / mrp) * 100);

          return (
            <div 
              key={book.id}
              className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xl transition-all group"
            >
              <div>
                {/* Book Header info & Thumbnail */}
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden theme-card-sub border theme-border relative shadow-md">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-300">
                      ★ {book.rating || '4.8'}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1 truncate">
                      {book.category}
                    </div>
                    <h3 className="font-bold text-sm theme-text-heading line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs theme-text-muted mt-1 truncate">By {book.author}</p>
                    <div className="text-[10px] theme-text-muted mt-1 font-mono">
                      ISBN: {book.isbn}
                    </div>
                    {book.edition && (
                      <span className="inline-block mt-1.5 text-[10px] theme-card-sub theme-text-muted border theme-border px-2 py-0.5 rounded">
                        {book.edition}
                      </span>
                    )}
                  </div>
                </div>

                {/* Best Price & Savings Badge */}
                <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-3 mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] theme-text-muted font-semibold uppercase">Guaranteed Lowest Price</div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl font-black theme-text-heading">₹{bestPrice}</span>
                      <span className="text-xs theme-text-muted line-through">₹{Math.round(mrp)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <TrendingDown className="w-3 h-3" />
                      Save {savingsPercent}% (₹{Math.round(savingsAmount)})
                    </span>
                    {lowestVendor && (
                      <div className="text-[10px] text-blue-500 dark:text-cyan-300 font-bold mt-1">
                        on {lowestVendor.vendor}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Vendor Price Comparison Table */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Live Multi-Platform Prices</span>
                    <span className="text-[10px] opacity-70">Real-time sync</span>
                  </div>

                  {prices.map((vp) => (
                    <div 
                      key={vp.vendor}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                        vp.isLowest 
                          ? 'bg-blue-500/15 border-blue-500/40 theme-text-heading font-medium' 
                          : 'theme-card-sub border theme-border theme-text-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold theme-text-heading">{vp.vendor}</span>
                        {vp.isLowest && (
                          <span className="bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Lowest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${vp.isLowest ? 'text-blue-500 dark:text-cyan-300' : 'theme-text-muted'}`}>
                          ₹{vp.price}
                        </span>
                        <span className="text-[10px] theme-text-muted">{vp.deliveryDays}d delivery</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t theme-border">
                <button
                  onClick={() => {
                    addToCart({
                      bookId: book.id,
                      title: book.title,
                      author: book.author,
                      coverImage: book.coverImage,
                      type: book.type,
                      price: bestPrice,
                      quantity: 1,
                      vendorName: lowestVendor?.vendor || 'Auto-Aggregated'
                    });
                    addToast('success', 'Added to Cart', `Added "${book.title}" at lowest price ₹${bestPrice} (${lowestVendor?.vendor})`);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy at Lowest Price (₹{bestPrice})</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookForDetails(book)}
                    className="flex-1 py-1.5 theme-card-sub hover:opacity-80 border theme-border rounded-xl text-xs font-semibold theme-text-muted transition-all cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleAiSyllabusMatch(book.title)}
                    className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Ask AI about syllabus exam relevance"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>AI Notes</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detailed Book Modal */}
      {selectedBookForDetails && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedBookForDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-full theme-card-sub border theme-border hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img 
                src={selectedBookForDetails.coverImage} 
                alt={selectedBookForDetails.title}
                className="w-28 h-40 object-cover rounded-2xl border theme-border shadow-md flex-shrink-0"
              />
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                  {selectedBookForDetails.category}
                </span>
                <h3 className="text-lg font-bold theme-text-heading">{selectedBookForDetails.title}</h3>
                <p className="text-xs theme-text-muted">By <b className="theme-text-heading">{selectedBookForDetails.author}</b> • {selectedBookForDetails.publisher || 'Academic Press'}</p>
                <p className="text-xs theme-text-muted font-mono">ISBN: {selectedBookForDetails.isbn} • {selectedBookForDetails.pages || 650} Pages</p>
                <div className="text-lg font-black text-emerald-500 pt-1">
                  Lowest Price: ₹{selectedBookForDetails.lowestPrice || 500}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t theme-border">
              <h4 className="text-xs font-bold uppercase theme-text-heading">Syllabus Overview & Description</h4>
              <p className="text-xs theme-text-muted leading-relaxed">
                {selectedBookForDetails.description}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  addToCart({
                    bookId: selectedBookForDetails.id,
                    title: selectedBookForDetails.title,
                    author: selectedBookForDetails.author,
                    coverImage: selectedBookForDetails.coverImage,
                    type: selectedBookForDetails.type,
                    price: selectedBookForDetails.lowestPrice || 500,
                    quantity: 1
                  });
                  setSelectedBookForDetails(null);
                  addToast('success', 'Added to Cart', `Added "${selectedBookForDetails.title}"`);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart (₹{selectedBookForDetails.lowestPrice || 500})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
