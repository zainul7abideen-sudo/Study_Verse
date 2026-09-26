import React, { useState } from 'react';
import { 
  ArrowRightLeft, PlusCircle, MapPin, Tag, ShieldCheck, CheckCircle2, 
  XCircle, MessageSquare, ShoppingCart, BookOpen, Clock, UserCheck, 
  Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, BookCondition, BookCategory } from '../types';

export const ResellExchangeView: React.FC = () => {
  const { 
    currentUser, usedBooks, addUsedBook, 
    exchanges, createExchangeProposal, updateExchangeStatus, 
    addToCart 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'my_trades'>('browse');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterCampus, setFilterCampus] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [proposingTradeTargetBook, setProposingTradeTargetBook] = useState<Book | null>(null);

  // Form states for new listing
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState<BookCategory>('Computer Science & IT');
  const [condition, setCondition] = useState<BookCondition>('Like New');
  const [resalePrice, setResalePrice] = useState('');
  const [originalMrp, setOriginalMrp] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailableForExchange, setIsAvailableForExchange] = useState(true);
  const [exchangeTargetDesc, setExchangeTargetDesc] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');

  // Form state for exchange proposal
  const [selectedMyBookForTrade, setSelectedMyBookForTrade] = useState<string>('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [meetupLocation, setMeetupLocation] = useState(currentUser.campusLocation || 'Main University Library');

  const myListedBooks = usedBooks.filter(b => b.sellerId === currentUser.id);

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !resalePrice) return;

    addUsedBook({
      title,
      author,
      isbn: isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category,
      description: description || 'Used semester textbook in good condition.',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerCampus: currentUser.collegeName,
      sellerUniversity: currentUser.university,
      condition,
      resalePrice: parseFloat(resalePrice),
      originalMrp: originalMrp ? parseFloat(originalMrp) : parseFloat(resalePrice) * 2,
      isAvailableForExchange,
      exchangeTargetDesc: isAvailableForExchange ? exchangeTargetDesc : undefined,
    });

    // Reset Form
    setTitle('');
    setAuthor('');
    setIsbn('');
    setResalePrice('');
    setOriginalMrp('');
    setDescription('');
    setExchangeTargetDesc('');
    setShowAddModal(false);
  };

  const handleProposeTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposingTradeTargetBook || !selectedMyBookForTrade) return;

    const myBook = myListedBooks.find(b => b.id === selectedMyBookForTrade);
    if (!myBook) return;

    createExchangeProposal({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderCollege: currentUser.collegeName,
      receiverId: proposingTradeTargetBook.sellerId || 'usr-student-1',
      receiverName: proposingTradeTargetBook.sellerName || 'Student Peer',
      offeredBookId: myBook.id,
      offeredBookTitle: myBook.title,
      offeredBookImage: myBook.coverImage,
      requestedBookId: proposingTradeTargetBook.id,
      requestedBookTitle: proposingTradeTargetBook.title,
      requestedBookImage: proposingTradeTargetBook.coverImage,
      message: proposalMessage || 'Hi! Would love to trade books for this semester course.',
      meetupLocation: meetupLocation || 'Campus Central Library'
    });

    setProposingTradeTargetBook(null);
    setProposalMessage('');
    setActiveTab('my_trades');
  };

  const filteredUsedBooks = usedBooks.filter(book => {
    if (filterCondition !== 'all' && book.condition !== filterCondition) return false;
    return true;
  });

  const myExchanges = exchanges.filter(
    ex => ex.senderId === currentUser.id || ex.receiverId === currentUser.id
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Campus Peer-to-Peer Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold theme-text-heading">
            Resell & Trade Used Books with Students
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted max-w-xl leading-relaxed">
            Save up to 80% on textbooks directly from seniors in your college. Sell your previous semester books or swap them for zero cash!
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-105 flex-shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>List a Book (Sell / Swap)</span>
        </button>
      </div>

      {/* Tabs Switcher (Browse vs Trade Inbox) */}
      <div className="flex items-center justify-between border-b theme-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
                : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
            }`}
          >
            Browse Used Listings ({filteredUsedBooks.length})
          </button>

          <button
            onClick={() => setActiveTab('my_trades')}
            className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'my_trades'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
                : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
            }`}
          >
            My Exchange Inbox ({myExchanges.length})
            {myExchanges.some(ex => ex.status === 'pending' && ex.receiverId === currentUser.id) && (
              <span className="ml-2 w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
            )}
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="filter-condition-select" className="theme-text-muted hidden sm:inline font-semibold">Condition:</label>
            <select
              id="filter-condition-select"
              name="filterCondition"
              aria-label="Filter books by condition"
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="theme-input theme-text-heading border theme-border rounded-lg px-2.5 py-1 outline-none text-xs cursor-pointer"
            >
              <option value="all">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Acceptable">Acceptable</option>
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: BROWSE USED LISTINGS */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsedBooks.map((book) => {
            const savings = book.originalMrp ? Math.round(((book.originalMrp - (book.resalePrice || 0)) / book.originalMrp) * 100) : 60;
            const isMine = book.sellerId === currentUser.id;

            return (
              <div 
                key={book.id}
                className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      book.condition === 'Like New' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30' :
                      book.condition === 'Good' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                    }`}>
                      Condition: {book.condition || 'Good'}
                    </span>

                    {book.isAvailableForExchange && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 uppercase">
                        <ArrowRightLeft className="w-2.5 h-2.5" />
                        Open to Trade
                      </span>
                    )}
                  </div>

                  {/* Book Image & Details */}
                  <div className="flex gap-4 mb-4">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-24 h-32 object-cover rounded-xl theme-card-sub border theme-border shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold theme-text-muted truncate">{book.category}</div>
                      <h3 className="font-bold text-sm theme-text-heading line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs theme-text-muted mt-1 truncate">By {book.author}</p>
                      
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{book.resalePrice}</span>
                        {book.originalMrp && (
                          <span className="text-xs theme-text-muted line-through">₹{book.originalMrp}</span>
                        )}
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                          {savings}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Campus & Seller Location */}
                  <div className="theme-card-sub border theme-border rounded-xl p-2.5 mb-4 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 theme-text-heading font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{book.sellerCampus || 'Campus Handover'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 theme-text-muted text-[11px] truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>Seller: {book.sellerName} ({book.sellerUniversity || 'Verified Student'})</span>
                    </div>
                    {book.exchangeTargetDesc && (
                      <div className="pt-1.5 border-t theme-border text-[11px] text-purple-600 dark:text-purple-300">
                        <span className="font-semibold">Looking for:</span> {book.exchangeTargetDesc}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t theme-border">
                  {isMine ? (
                    <div className="text-center py-2 text-xs font-semibold text-blue-500 bg-blue-500/10 rounded-xl border border-blue-500/30">
                      Your Active Listing
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addToCart({
                            bookId: book.id,
                            title: book.title,
                            author: book.author,
                            coverImage: book.coverImage,
                            type: 'used_resale',
                            price: book.resalePrice || 250,
                            quantity: 1,
                            condition: book.condition,
                            vendorName: `Peer Seller (${book.sellerName})`
                          });
                        }}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Buy for ₹{book.resalePrice}
                      </button>

                      {book.isAvailableForExchange && (
                        <button
                          onClick={() => setProposingTradeTargetBook(book)}
                          className="py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Propose a Book Exchange"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Swap</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: EXCHANGE INBOX & TRADE OFFERS */}
      {activeTab === 'my_trades' && (
        <div className="space-y-4">
          {myExchanges.length === 0 ? (
            <div className="text-center py-16 theme-card border theme-border rounded-3xl p-8">
              <ArrowRightLeft className="w-12 h-12 theme-text-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold theme-text-heading">No Exchange Proposals Yet</h3>
              <p className="text-xs theme-text-muted mt-1 max-w-sm mx-auto">
                List a book and enable "Open to Trade" to receive swap offers from college students on your campus.
              </p>
            </div>
          ) : (
            myExchanges.map((proposal) => {
              const isReceiver = proposal.receiverId === currentUser.id;
              
              return (
                <div 
                  key={proposal.id}
                  className="theme-card border theme-border rounded-2xl p-6 relative overflow-hidden shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* Trade Swap Visualizer */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Offered Book */}
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold theme-text-muted block mb-1">
                          {proposal.senderName.split(' ')[0]}'s Book
                        </span>
                        <img 
                          src={proposal.offeredBookImage} 
                          alt={proposal.offeredBookTitle} 
                          className="w-16 h-22 object-cover rounded-lg border theme-border shadow-md mx-auto"
                        />
                        <div className="text-xs font-semibold theme-text-heading mt-1 max-w-[120px] truncate">
                          {proposal.offeredBookTitle}
                        </div>
                      </div>

                      {/* Swap Arrow Icon */}
                      <div className="p-3 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500/30 flex-shrink-0 animate-pulse">
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>

                      {/* Requested Book */}
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold theme-text-muted block mb-1">
                          {proposal.receiverName.split(' ')[0]}'s Book
                        </span>
                        <img 
                          src={proposal.requestedBookImage} 
                          alt={proposal.requestedBookTitle} 
                          className="w-16 h-22 object-cover rounded-lg border theme-border shadow-md mx-auto"
                        />
                        <div className="text-xs font-semibold theme-text-heading mt-1 max-w-[120px] truncate">
                          {proposal.requestedBookTitle}
                        </div>
                      </div>

                      {/* Details & Notes */}
                      <div className="ml-4 space-y-1.5 hidden sm:block">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            proposal.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' :
                            proposal.status === 'rejected' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300' :
                            'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                          }`}>
                            Status: {proposal.status.toUpperCase()}
                          </span>
                          <span className="text-[11px] theme-text-muted">
                            {new Date(proposal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs theme-text-heading italic">"{proposal.message}"</p>
                        <div className="text-[11px] theme-text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>Meetup: {proposal.meetupLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for Receiver */}
                    {isReceiver && proposal.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateExchangeStatus(proposal.id, 'accepted')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept Trade
                        </button>

                        <button
                          onClick={() => updateExchangeStatus(proposal.id, 'rejected')}
                          className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    )}

                    {proposal.status === 'accepted' && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-600 dark:text-emerald-300 space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          Exchange Agreement Confirmed!
                        </div>
                        <div className="text-[11px] theme-text-muted">
                          Meet at <b className="theme-text-heading">{proposal.meetupLocation}</b> to inspect & swap books.
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL 1: ADD BOOK FOR RESALE / EXCHANGE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 theme-text-muted hover:theme-text-heading p-2 rounded-full theme-card-sub border theme-border"
            >
              ✕
            </button>

            <h2 className="text-xl font-extrabold theme-text-heading flex items-center gap-2 mb-1">
              <PlusCircle className="w-5 h-5 text-emerald-500" />
              List Used Book for Resale or Swap
            </h2>
            <p className="text-xs theme-text-muted mb-6">Make your semester books available to peers in your university.</p>

            <form onSubmit={handleAddBookSubmit} className="space-y-4 text-left">
              
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design and Analysis of Algorithms"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horowitz & Sahni"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">ISBN (Optional)</label>
                  <input
                    type="text"
                    placeholder="978-XXXXXXXXXX"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="listing-category-select" className="block text-xs font-semibold theme-text-heading mb-1">Category</label>
                  <select
                    id="listing-category-select"
                    name="category"
                    aria-label="Book Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BookCategory)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Basic Sciences & Math">Basic Sciences & Math</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Medical & Dental">Medical & Dental</option>
                    <option value="Commerce & MBA">Commerce & MBA</option>
                    <option value="Competitive Exams (GATE/CAT/UPSC)">Competitive Exams (GATE/CAT/UPSC)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="listing-condition-select" className="block text-xs font-semibold theme-text-heading mb-1">Condition</label>
                  <select
                    id="listing-condition-select"
                    name="condition"
                    aria-label="Book Condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as BookCondition)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Like New">Like New (Mint Condition)</option>
                    <option value="Good">Good (Minor Highlights)</option>
                    <option value="Fair">Fair (Readable, Intact)</option>
                    <option value="Acceptable">Acceptable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="e.g. 280"
                    value={resalePrice}
                    onChange={(e) => setResalePrice(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs font-bold placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 650"
                    value={originalMrp}
                    onChange={(e) => setOriginalMrp(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3.5 py-2.5 text-xs placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Exchange Toggle */}
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailableForExchange}
                    onChange={(e) => setIsAvailableForExchange(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-300">Available for Book Trade / Exchange (Barter)</span>
                </label>

                {isAvailableForExchange && (
                  <input
                    type="text"
                    placeholder="What books or subjects are you looking for in return?"
                    value={exchangeTargetDesc}
                    onChange={(e) => setExchangeTargetDesc(e.target.value)}
                    className="w-full theme-input theme-text-heading border border-purple-500/40 rounded-xl px-3 py-2 text-xs placeholder:opacity-60 outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="Mention edition, missing pages, or notes included..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs placeholder:opacity-60 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 theme-card-sub theme-text-heading rounded-xl text-xs font-semibold hover:opacity-80 border theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: PROPOSE TRADE SWAP */}
      {proposingTradeTargetBook && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-3xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <button
              onClick={() => setProposingTradeTargetBook(null)}
              className="absolute top-5 right-5 theme-text-muted hover:theme-text-heading p-2 rounded-full theme-card-sub border theme-border"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold theme-text-heading flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-5 h-5 text-purple-500" />
              Propose a Book Trade
            </h2>
            <p className="text-xs theme-text-muted mb-4">
              Swap one of your books with <b>{proposingTradeTargetBook.sellerName}</b> for "{proposingTradeTargetBook.title}".
            </p>

            <form onSubmit={handleProposeTradeSubmit} className="space-y-4 text-left">
              
              <div>
                <label htmlFor="trade-book-offer-select" className="block text-xs font-semibold theme-text-heading mb-1">
                  Select your book to offer in exchange: *
                </label>
                {myListedBooks.length === 0 ? (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-500">
                    You have not listed any used books yet. Please list a book first to propose a trade!
                  </div>
                ) : (
                  <select
                    id="trade-book-offer-select"
                    name="offeredBook"
                    aria-label="Select your book to offer in exchange"
                    required
                    value={selectedMyBookForTrade}
                    onChange={(e) => setSelectedMyBookForTrade(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2.5 text-xs outline-none"
                  >
                    <option value="">-- Choose one of your listed books --</option>
                    {myListedBooks.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} (Valued at ₹{b.resalePrice})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Custom Message to Student</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Hey! I have this book in like-new condition. Let me know if you are interested in a swap!"
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs placeholder:opacity-60 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Proposed Campus Meetup Spot</label>
                <input
                  type="text"
                  placeholder="e.g. Main Canteen / Central Library Counter"
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProposingTradeTargetBook(null)}
                  className="px-4 py-2 theme-card-sub theme-text-heading rounded-xl text-xs font-semibold hover:opacity-80 border theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={myListedBooks.length === 0 || !selectedMyBookForTrade}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Send Exchange Proposal
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
