import React, { useState } from 'react';
import { 
  BookOpen, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Sun, Moon, Bookmark, Download, X, List, Sparkles, Check
} from 'lucide-react';
import { Book } from '../types';

interface EbookReaderModalProps {
  ebook: Book;
  onClose: () => void;
}

export const EbookReaderModal: React.FC<EbookReaderModalProps> = ({ ebook, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<number>(15);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);

  const pages = ebook.sampleContent || [
    `CHAPTER 1: INTRODUCTION TO ${ebook.title.toUpperCase()}\n\nWelcome to this comprehensive academic reference. This digital publication has been verified against the official university curriculum.\n\nKey Concepts:\n1. Theoretical Frameworks\n2. Practical System Architectures\n3. Solved University Examination Case Studies\n\nStudy Tip: Use the academic calculator tool in SSS to benchmark your semester goals.`,
    `CHAPTER 2: ADVANCED TOPICS & ALGORITHMIC PROOFS\n\nSection 2.1: Mathematical Modeling\nWhen architecting high-throughput distributed systems, non-blocking asynchronous event loops ensure sub-100ms response times for real-time web scraping and price discovery.\n\nSection 2.2: Performance Metrics\nLatency (L) = Propagation Time + Transmission Time + Queuing Delay.\nThroughput (T) = Packets / Unit Time.`,
    `CHAPTER 3: SEMESTER PRACTICE PROBLEMS & FORMULA SHEET\n\nProblem 1: Derive the time complexity of the randomized quicksort partition scheme.\n\nProblem 2: For a 10-point credit grading system (e.g. AKTU / VTU), calculate the equivalent percentage of 8.65 CGPA using formula: Percentage = (CGPA - 0.75) * 10.\nSolution: (8.65 - 0.75) * 10 = 7.90 * 10 = 79.0%.`
  ];

  const totalPages = pages.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className={`w-full max-w-4xl h-[90vh] rounded-3xl border flex flex-col shadow-2xl overflow-hidden transition-colors ${
        readingTheme === 'dark' ? 'bg-slate-950 text-slate-100 border-slate-800' :
        readingTheme === 'sepia' ? 'bg-[#fbf0d9] text-[#433422] border-[#e2d0b5]' :
        'bg-white text-slate-900 border-slate-200'
      }`}>
        
        {/* Top Reader Controls Bar */}
        <div className={`p-4 border-b flex items-center justify-between gap-4 ${
          readingTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-200' :
          readingTheme === 'sepia' ? 'bg-[#f4e4c9] border-[#e2d0b5] text-[#433422]' :
          'bg-slate-100 border-slate-200 text-slate-800'
        }`}>
          
          {/* Left info */}
          <div className="flex items-center gap-3 truncate">
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
              title="Table of Contents"
            >
              <List className="w-5 h-5" />
            </button>
            <div className="truncate">
              <h3 className="text-xs sm:text-sm font-bold truncate">{ebook.title}</h3>
              <p className="text-[10px] opacity-70 truncate">{ebook.author} • Licensed to Study Student Shop</p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Theme switcher */}
            <div className="flex items-center gap-1 bg-black/10 p-1 rounded-xl text-xs">
              <button
                onClick={() => setReadingTheme('dark')}
                className={`px-2 py-0.5 rounded-lg ${readingTheme === 'dark' ? 'bg-slate-800 text-white font-bold' : 'opacity-60'}`}
              >
                Dark
              </button>
              <button
                onClick={() => setReadingTheme('sepia')}
                className={`px-2 py-0.5 rounded-lg ${readingTheme === 'sepia' ? 'bg-[#dfc8a5] text-amber-950 font-bold' : 'opacity-60'}`}
              >
                Sepia
              </button>
              <button
                onClick={() => setReadingTheme('light')}
                className={`px-2 py-0.5 rounded-lg ${readingTheme === 'light' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'opacity-60'}`}
              >
                Light
              </button>
            </div>

            {/* Font Size */}
            <div className="hidden sm:flex items-center gap-1 bg-black/10 p-1 rounded-xl text-xs">
              <button 
                onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
                className="px-2 py-0.5 hover:bg-black/10 rounded font-bold"
              >
                A-
              </button>
              <span className="text-[10px] px-1 font-mono">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                className="px-2 py-0.5 hover:bg-black/10 rounded font-bold"
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked ? 'text-amber-500 bg-amber-500/20' : 'hover:bg-black/10 opacity-70'
              }`}
              title="Bookmark Page"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 text-rose-400"
              title="Exit Reader"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Reader Body & Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Table of Contents Drawer */}
          {showToc && (
            <div className={`w-64 border-r p-4 overflow-y-auto absolute sm:relative z-20 h-full backdrop-blur-md ${
              readingTheme === 'dark' ? 'bg-slate-950 border-slate-800' :
              readingTheme === 'sepia' ? 'bg-[#f4e4c9] border-[#e2d0b5]' :
              'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Contents</h4>
              <div className="space-y-1 text-xs">
                {pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPage(idx);
                      setShowToc(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      currentPage === idx ? 'bg-blue-600 text-white font-bold' : 'hover:bg-black/10'
                    }`}
                  >
                    Section / Page {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reading Page Text Canvas */}
          <div className="flex-1 p-6 sm:p-12 overflow-y-auto max-w-3xl mx-auto flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* DRM Stamp Header */}
              <div className="text-[10px] uppercase font-mono tracking-widest opacity-40 border-b pb-2 flex justify-between">
                <span>STUDY STUDENT SHOP (SSS) DIGITAL E-READER</span>
                <span>DRM SECURE INSTANCE #{ebook.isbn}</span>
              </div>

              {/* Text Render */}
              <div 
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                className="whitespace-pre-line font-serif selection:bg-amber-300 selection:text-black pt-2"
              >
                {pages[currentPage]}
              </div>
            </div>

            <div className="pt-8 text-center text-xs opacity-50 font-mono">
              — Page {currentPage + 1} of {totalPages} —
            </div>

          </div>

        </div>

        {/* Bottom Pagination Bar */}
        <div className={`p-3 border-t flex items-center justify-between px-6 ${
          readingTheme === 'dark' ? 'bg-slate-900/80 border-slate-800' :
          readingTheme === 'sepia' ? 'bg-[#f4e4c9] border-[#e2d0b5]' :
          'bg-slate-100 border-slate-200'
        }`}>
          
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-black/20 disabled:opacity-30 text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Page
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">
              Page {currentPage + 1} / {totalPages}
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-black/20 disabled:opacity-30 text-xs font-semibold transition-all"
          >
            Next Page
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
