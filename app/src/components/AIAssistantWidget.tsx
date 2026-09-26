import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Brain, X, Send, Maximize2, Minimize2, Trash2, 
  BookOpen, ShoppingCart, ArrowRight, Check, Copy, ThumbsUp, 
  ThumbsDown, ChevronRight, GraduationCap, Calculator, ShieldCheck, 
  Flame, ExternalLink, Lightbulb, Zap, HelpCircle, Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book, VendorPrice } from '../types';
import { askStudyVerseAssistant, AssistantResponse } from '../services/aiService';
import { ActiveTab } from './Navbar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relevantBooks?: Book[];
  suggestedActions?: string[];
}

interface AIAssistantWidgetProps {
  setActiveTab?: (tab: ActiveTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const INITIAL_PROMPTS = [
  '🎓 How do StudyVerse features work?',
  '📚 Find lowest price textbooks for my branch',
  '🧮 How to calculate AKTU / VTU CGPA?',
  '⚡ What is the 75% Bunk Radar?',
  '💡 Explain Normalization in DBMS with examples',
  '🤖 How to prepare for GATE CSE & Placements?',
  '🛒 How does automated lowest-price ordering work?'
];

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({ 
  setActiveTab = () => {}, 
  isOpen: controlledIsOpen,
  onClose: controlledOnClose 
}) => {
  const { currentUser, addToCart, addToast, setSearchQuery, performSearch } = useApp();

  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    setInternalIsOpen(true);
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `👋 **Hi ${currentUser.name.split(' ')[0]}!** I am your **StudyVerse AI Assistant**.\n\nYou don't need to search Google separately—ask me anything about:\n* **Campus Platform Guidance**: How to find lowest book prices, trade used books, calculate CGPA, or track attendance.\n* **Academic Explanations**: Concepts, formulas, algorithm proofs, and exam preparation.\n* **Textbook Recommendations**: Live price comparisons across Amazon, Flipkart, Bookswagon & SSS Pre-Loved.\n\n*What would you like to explore today?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'How do StudyVerse features work?',
          'Find lowest price textbooks for my branch',
          'How to calculate AKTU / VTU CGPA?',
          'What is the 75% Bunk Radar?'
        ]
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response: AssistantResponse = await askStudyVerseAssistant(query, {
        name: currentUser.name,
        university: currentUser.university,
        branch: currentUser.branch,
        semester: currentUser.semester,
        collegeName: currentUser.collegeName
      });

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relevantBooks: response.relevantBooks,
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I encountered a momentary connectivity issue. However, you can still explore all StudyVerse features using the navigation menu or search bar!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared! Ask me anything about your university subjects, syllabus, books, or StudyVerse features.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'How do StudyVerse features work?',
          'Find lowest price textbooks for my branch',
          'Calculate University CGPA'
        ]
      }
    ]);
  };

  const handleActionClick = (action: string) => {
    if (action.includes('CGPA') || action.includes('SGPA') || action.includes('Predictor')) {
      setActiveTab('academic');
      handleClose();
    } else if (action.includes('Bunk') || action.includes('Attendance') || action.includes('Summarizer')) {
      setActiveTab('studyhub');
      handleClose();
    } else if (action.includes('Pre-Loved') || action.includes('Resale') || action.includes('Swap')) {
      setActiveTab('resell');
      handleClose();
    } else if (action.includes('E-Book') || action.includes('Library')) {
      setActiveTab('ebooks');
      handleClose();
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <>
      {/* 1. Floating Circular Trigger Pill in Bottom-Right Corner */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 animate-bounce-subtle">
          <button
            onClick={handleOpen}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
            title="Ask StudyVerse AI Assistant (Campus Guide & Concept Explainer)"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="font-extrabold tracking-wide">AI Assistant</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-mono tracking-wider">
              Gemini
            </span>
          </button>
        </div>
      )}

      {/* 2. Interactive AI Assistant Window / Drawer */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col theme-card border theme-border shadow-2xl overflow-hidden ${
            isExpanded 
              ? 'inset-4 sm:inset-10 max-w-5xl mx-auto rounded-3xl' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[620px] max-h-[88vh] rounded-3xl'
          }`}
        >
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-white text-sm border border-white/20 shadow-inner">
                <Brain className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm leading-tight text-white">StudyVerse AI Copilot</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-white/80 mt-0.5">
                  {currentUser.university || 'AKTU'} • {currentUser.branch || 'CSE'} Mentor & Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Minimize Window' : 'Expand Window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer ml-1"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Suggestion Carousel (Visible when chat has few messages) */}
          <div className="px-3.5 py-2 bg-blue-500/5 border-b theme-border flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <Compass className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase theme-text-muted flex-shrink-0">Suggestions:</span>
            {INITIAL_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+\s*/, ''))}
                className="px-2.5 py-1 rounded-full theme-card-sub hover:opacity-90 text-blue-600 dark:text-cyan-300 font-medium whitespace-nowrap border theme-border text-[11px] transition-all cursor-pointer flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Thread Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'assistant';

              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in duration-150`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[85%] ${isAi ? 'items-start' : 'items-end'}`}>
                    
                    {/* Message Bubble */}
                    <div 
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 relative group shadow-sm ${
                        isAi 
                          ? 'theme-card-sub border theme-border theme-text-heading' 
                          : 'bg-blue-600 text-white font-medium rounded-tr-xs'
                      }`}
                    >
                      {/* Markdown-style formatting renderer */}
                      <div className="whitespace-pre-wrap">
                        {msg.text.split('\n').map((line, lIdx) => {
                          // Header 3
                          if (line.startsWith('### ')) {
                            return <h4 key={lIdx} className="font-black text-sm my-1.5 text-blue-500 dark:text-cyan-300">{line.replace('### ', '')}</h4>;
                          }
                          // Bullet
                          if (line.startsWith('* ') || line.startsWith('- ')) {
                            return (
                              <div key={lIdx} className="flex items-start gap-1.5 my-0.5 pl-1">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{renderBold(line.slice(2))}</span>
                              </div>
                            );
                          }
                          return <div key={lIdx} className={line.trim() === '' ? 'h-2' : 'my-0.5'}>{renderBold(line)}</div>;
                        })}
                      </div>

                      {/* AI Utilities: Copy & Feedback */}
                      {isAi && (
                        <div className="pt-2 mt-2 border-t theme-border flex items-center justify-between text-[10px] theme-text-muted">
                          <span>{msg.timestamp}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="p-1 rounded hover:opacity-75 flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy Answer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-500 font-bold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Attached Live Textbook Recommendation Cards if available */}
                    {isAi && msg.relevantBooks && msg.relevantBooks.length > 0 && (
                      <div className="space-y-2 pt-1 w-full">
                        <div className="text-[10px] font-bold uppercase text-blue-500 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Direct Live Textbook Pricing Match:</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {msg.relevantBooks.map((book) => {
                            const prices = book.prices || [];
                            const lowestVendor = prices.find(p => p.isLowest) || prices[0];
                            const bestPrice = book.lowestPrice || (lowestVendor ? lowestVendor.price : 450);

                            return (
                              <div 
                                key={book.id}
                                className="p-3 rounded-2xl theme-card border border-blue-500/30 shadow-md space-y-2.5 bg-blue-500/5 hover:border-blue-500 transition-all"
                              >
                                <div className="flex gap-3 items-start">
                                  <img 
                                    src={book.coverImage} 
                                    alt={book.title} 
                                    className="w-14 h-18 object-cover rounded-xl border theme-border shadow-sm flex-shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[9px] uppercase font-bold text-blue-500 truncate">
                                      {book.category}
                                    </div>
                                    <h5 className="font-bold text-xs theme-text-heading line-clamp-1">
                                      {book.title}
                                    </h5>
                                    <p className="text-[10px] theme-text-muted truncate">By {book.author}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-sm font-black text-emerald-500">₹{bestPrice}</span>
                                      {lowestVendor && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                                          Lowest on {lowestVendor.vendor}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Multi-vendor pills */}
                                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
                                  {prices.slice(0, 3).map(p => (
                                    <span 
                                      key={p.vendor}
                                      className={`px-2 py-0.5 rounded-lg border text-[9px] font-mono ${
                                        p.isLowest 
                                          ? 'bg-blue-600 text-white font-bold' 
                                          : 'theme-card-sub theme-text-muted border theme-border'
                                      }`}
                                    >
                                      {p.vendor}: ₹{p.price}
                                    </span>
                                  ))}
                                </div>

                                {/* Quick Action Buttons */}
                                <div className="flex items-center gap-2 pt-1 border-t theme-border">
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
                                      addToast('success', 'Added to Cart', `Added "${book.title}" at lowest price ₹${bestPrice}`);
                                    }}
                                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-600/25"
                                  >
                                    <ShoppingCart className="w-3 h-3" />
                                    <span>Buy at Lowest Price (₹{bestPrice})</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSearchQuery(book.title);
                                      performSearch(book.title);
                                      setActiveTab('search');
                                      handleClose();
                                    }}
                                    className="px-2.5 py-1.5 theme-card-sub hover:opacity-80 border theme-border rounded-xl text-[10px] font-semibold theme-text-muted transition-all cursor-pointer flex items-center gap-1"
                                    title="View full price breakdown across all online stores"
                                  >
                                    <span>Compare</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Next Suggested Action Chips */}
                    {isAi && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action) => (
                          <button
                            key={action}
                            onClick={() => handleActionClick(action)}
                            className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>{action}</span>
                            <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                          </button>
                        ))}
                      </div>
                    )}

                  </div>

                  {!isAi && (
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                      alt={currentUser.name} 
                      className="w-7 h-7 rounded-xl object-cover ring-1 ring-blue-500/50 flex-shrink-0 mt-0.5"
                    />
                  )}
                </div>
              );
            })}

            {/* Live Loading Pulse */}
            {isLoading && (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                </div>
                <div className="theme-card-sub border theme-border p-3 rounded-2xl text-xs theme-text-muted flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Searching Google Books & synthesizing academic advice with Gemini AI...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t theme-border theme-card-sub relative z-10">
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border theme-border focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all p-1">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about textbooks, course concepts, CGPA, or StudyVerse features (No Google needed!)..."
                rows={1}
                className="w-full bg-transparent px-3 py-2 text-xs theme-text-heading placeholder:opacity-60 outline-none resize-none max-h-24 font-medium"
              />

              <div className="flex items-center gap-1 pr-1">
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="p-1 rounded-full text-slate-400 hover:opacity-80 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer shadow-md shadow-blue-600/30"
                  title="Send Question"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] theme-text-muted px-2 pt-1.5">
              <span>Powered by Google Gemini Flash & Real-Time Price Search</span>
              <span>Press <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.2 rounded text-[8px]">Enter ↵</kbd> to send</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

// Helper function to render **bold text** cleanly
function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold theme-text-heading">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
