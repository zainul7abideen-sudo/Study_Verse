import React from 'react';
import { BookCheck, BookOpen, Download, Star, ShieldCheck, Sparkles, ShoppingCart, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';

export const EbookStoreView: React.FC = () => {
  const { ebooks, openEbookReader, addToCart } = useApp();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
            <BookCheck className="w-3.5 h-3.5" />
            Digital Academic Library & Notes
          </div>
          <h1 className="text-2xl sm:text-3xl font-black theme-text-heading">
            Instant E-Books & High-Yield Exam Handbooks
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted max-w-xl leading-relaxed">
            Read instantly in your browser with interactive notes, dark/sepia themes, and offline DRM-stamped PDF downloads.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs theme-card-sub border theme-border p-3.5 rounded-2xl flex-shrink-0">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <div className="text-left">
            <div className="theme-text-heading font-bold">100% Instant Delivery</div>
            <div className="theme-text-muted text-[11px]">Read anywhere on mobile or laptop</div>
          </div>
        </div>
      </div>

      {/* Grid of E-Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ebooks.map((ebook) => (
          <div 
            key={ebook.id}
            className="theme-card border theme-border rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition-all group"
          >
            <div>
              {/* Cover & Top Info */}
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden theme-card-sub border theme-border relative shadow-md">
                  <img 
                    src={ebook.coverImage} 
                    alt={ebook.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    E-BOOK
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase font-bold text-purple-500 truncate mb-1">
                    {ebook.category}
                  </div>
                  <h3 className="font-bold text-sm theme-text-heading line-clamp-2 group-hover:text-purple-500 transition-colors">
                    {ebook.title}
                  </h3>
                  <p className="text-xs theme-text-muted mt-1 truncate">By {ebook.author}</p>
                  
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-black text-purple-600 dark:text-purple-400">₹{ebook.ebookPrice}</span>
                    <span className="text-xs theme-text-muted line-through">₹{Math.round((ebook.ebookPrice || 99) * 4)}</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                      75% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs Badge */}
              <div className="theme-card-sub border theme-border rounded-xl p-2.5 mb-4 text-[11px] theme-text-muted flex items-center justify-between">
                <span>Format: PDF / Web-Reader</span>
                <span>Size: {ebook.fileSize || '15 MB'}</span>
                <span>Pages: {ebook.pages || 450}</span>
              </div>

              <p className="text-xs theme-text-muted line-clamp-3 mb-4 leading-relaxed">
                {ebook.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t theme-border">
              <button
                onClick={() => openEbookReader(ebook)}
                className="w-full py-2.5 px-4 bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Read Free Sample in Web-Reader</span>
              </button>

              <button
                onClick={() => {
                  addToCart({
                    bookId: ebook.id,
                    title: ebook.title,
                    author: ebook.author,
                    coverImage: ebook.coverImage,
                    type: 'ebook',
                    price: ebook.ebookPrice || 99,
                    quantity: 1,
                    vendorName: 'Study Student Shop Digital Library'
                  });
                }}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Unlock Full E-Book (₹{ebook.ebookPrice})</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
