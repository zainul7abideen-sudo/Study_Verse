import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, 
  X, Sparkles, CheckCircle2, ChevronRight, BookOpen, 
  Calculator, ArrowRightLeft, Brain, ShoppingCart, 
  ExternalLink, Layers, Search, ShieldCheck, Zap,
  TrendingDown, ArrowRight, Bot, BellRing, FastForward, Rewind
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface AIVideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

interface Chapter {
  id: number;
  title: string;
  duration: number; // in seconds
  timestamp: string;
  category: string;
  tab: ActiveTab;
  narration: string;
  summary: string;
  badges: string[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Multi-Platform Price Arbitrage & AI Lowest-Price Bot',
    duration: 35,
    timestamp: '0:00',
    category: 'Price Intelligence',
    tab: 'search',
    narration: 'Welcome to Study Student Shop. Our AI price engine monitors Amazon, Flipkart, and peer sellers in real-time, automatically identifying the lowest price so students never overpay.',
    summary: 'Real-time multi-vendor price comparison with automated arbitrage savings lock.',
    badges: ['Google Books API', 'Amazon & Flipkart Sync', 'Auto Savings ~35%']
  },
  {
    id: 2,
    title: 'P2P Campus Used Resale & Free Book Swap',
    duration: 35,
    timestamp: '0:35',
    category: 'Campus Marketplace',
    tab: 'resell',
    narration: 'Need to pass on your previous semester textbooks? List them directly for cash or propose a zero-cost 1-to-1 book exchange with classmates right on your campus.',
    summary: 'Direct peer-to-peer textbook resale and zero-commission course exchange barter.',
    badges: ['Zero Platform Fee', 'Campus Handover', 'Instant Barter Proposals']
  },
  {
    id: 3,
    title: 'StudyVerse 24/7 AI Academic Tutor & Flashcards',
    duration: 40,
    timestamp: '1:10',
    category: 'AI Academic Engine',
    tab: 'studyhub',
    narration: 'Powered by Google Gemini AI, your 24/7 personal tutor explains complex university engineering concepts, summarizes long lecture notes, and generates active-recall flashcards.',
    summary: 'Context-aware AI tutor tailored to Indian University syllabi with 3D flashcards.',
    badges: ['Gemini AI Live', 'Lecture Note Condenser', 'Interactive Flashcards']
  },
  {
    id: 4,
    title: 'Indian Universities CGPA Matrix & 75% Bunk Radar',
    duration: 40,
    timestamp: '1:50',
    category: 'Academic Tools',
    tab: 'academic',
    narration: 'Calculate university-accurate SGPA and CGPA for AKTU, VTU, DU, SPPU, and MU with CBCS conversion. Plus, our Attendance Radar tells you exactly how many lectures you can safely bunk.',
    summary: 'Official CBCS formula calculations and 75% attendance bunk strategy engine.',
    badges: ['AKTU / VTU / DU / SPPU / MU', 'Target Predictor', '75% Bunk Radar']
  },
  {
    id: 5,
    title: 'Automated Dropship Fulfillment & EmailJS Security',
    duration: 35,
    timestamp: '2:30',
    category: 'Commerce & Security',
    tab: 'profile',
    narration: 'When you place an order, our autonomous dropship worker queues fulfillment at the lowest vendor while EmailJS dispatches 6-digit OTP verification codes and real-time invoices.',
    summary: 'End-to-end dropship fulfillment with item-level cancellations and instant wallet refunds.',
    badges: ['EmailJS OTP Verification', 'Automated Bot Purchase', 'Instant Wallet Refunds']
  }
];

const TOTAL_DURATION = CHAPTERS.reduce((acc, c) => acc + c.duration, 0); // 185 seconds

export const AIVideoDemoModal: React.FC<AIVideoDemoModalProps> = ({
  isOpen, onClose, setActiveTab
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Audio Speech Synthesis for AI Voiceover
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenChapterRef = useRef<number>(-1);

  // Determine current chapter from currentTime
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      if (currentTime >= accumulated && currentTime < accumulated + CHAPTERS[i].duration) {
        setActiveChapterIndex(i);
        break;
      }
      accumulated += CHAPTERS[i].duration;
    }
  }, [currentTime]);

  // Voice narration speech trigger
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      return;
    }

    if (isMuted || !isPlaying) {
      window.speechSynthesis?.cancel();
      return;
    }

    if (lastSpokenChapterRef.current !== activeChapterIndex) {
      lastSpokenChapterRef.current = activeChapterIndex;
      window.speechSynthesis?.cancel();
      
      if ('speechSynthesis' in window) {
        const text = CHAPTERS[activeChapterIndex].narration;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = playbackSpeed;
        utterance.pitch = 1.05;
        
        // Find a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
        if (preferredVoice) utterance.voice = preferredVoice;

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [activeChapterIndex, isMuted, isPlaying, isOpen, playbackSpeed]);

  // Playback timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed]);

  if (!isOpen) return null;

  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const jumpToChapter = (idx: number) => {
    let startSecs = 0;
    for (let i = 0; i < idx; i++) {
      startSecs += CHAPTERS[i].duration;
    }
    setCurrentTime(startSecs);
    setActiveChapterIndex(idx);
    lastSpokenChapterRef.current = -1; // retrigger speech
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    lastSpokenChapterRef.current = -1;
  };

  const togglePlayPause = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
      lastSpokenChapterRef.current = -1;
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
      if (isPlaying) {
        window.speechSynthesis?.cancel();
      } else {
        lastSpokenChapterRef.current = -1;
      }
    }
  };

  const handleLaunchLive = (tab: ActiveTab) => {
    window.speechSynthesis?.cancel();
    onClose();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="theme-card border theme-border rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col relative animate-slide-right my-auto">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:px-6 border-b theme-border flex items-center justify-between theme-card-sub">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base theme-text-heading">
                  Study Student Shop • AI Platform Demo
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                  AI Narrated
                </span>
              </div>
              <p className="text-[11px] theme-text-muted">
                Interactive Guided Tour of All 5 Key Modules
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-full theme-card-sub border theme-border theme-text-muted hover:theme-text-heading cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Display Screen */}
        <div className="relative bg-slate-950 aspect-video w-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
          
          {/* Animated Ambient Scene Background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Video Overlay: Chapter Label & Live Status */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-white font-semibold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-cyan-400 font-mono">CH {currentChapter.id}/5:</span>
              <span className="truncate max-w-[200px] sm:max-w-md">{currentChapter.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-bold">
                1080p HD
              </span>
            </div>
          </div>

          {/* Central Interactive Dynamic Scene Graphics */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center p-2 sm:p-4">
            
            {/* SCENE 1: Price Arbitrage Scan */}
            {currentChapter.id === 1 && (
              <div className="w-full max-w-xl space-y-4 animate-slide-left">
                <div className="inline-flex p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-cyan-400 shadow-xl">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Multi-Platform Book Price Arbitrage
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Comparing prices across Amazon, Flipkart, Bookswagon & Peer Sellers
                  </p>
                </div>

                {/* Animated Price Cards Matrix */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                    <div className="text-[10px] text-slate-400">Amazon.in</div>
                    <div className="text-base font-bold text-slate-300 line-through">₹699</div>
                    <div className="text-[9px] text-slate-500">Standard Price</div>
                  </div>
                  <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                    <div className="text-[10px] text-slate-400">Flipkart</div>
                    <div className="text-base font-bold text-slate-300">₹540</div>
                    <div className="text-[9px] text-slate-400">Delivery in 4 days</div>
                  </div>
                  <div className="p-3 bg-blue-950/80 border-2 border-cyan-400 rounded-xl shadow-lg shadow-cyan-500/20 relative">
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-cyan-400 text-slate-950 text-[8px] font-black rounded uppercase">Lowest</span>
                    <div className="text-[10px] text-cyan-300 font-bold">SSS Peer Resale</div>
                    <div className="text-lg font-black text-emerald-400">₹280</div>
                    <div className="text-[9px] text-emerald-300 font-bold">Save ₹419 (60%)</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 2: P2P Book Exchange Barter */}
            {currentChapter.id === 2 && (
              <div className="w-full max-w-xl space-y-4 animate-slide-left">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xl">
                  <ArrowRightLeft className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Peer-to-Peer Resale & Campus Book Barter
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Trade engineering, commerce & degree textbooks directly with campus peers.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 p-3 bg-slate-900/90 border border-slate-700 rounded-2xl max-w-md mx-auto text-xs">
                  <div className="text-left">
                    <div className="font-bold text-slate-200 truncate">Engineering Physics</div>
                    <div className="text-[10px] text-slate-400">Offered by Aarav (VTU)</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
                    ⇄ SWAP
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-200 truncate">Basic Electrical Engg</div>
                    <div className="text-[10px] text-emerald-400 font-bold">0% Platform Fee</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 3: AI Academic Study Hub */}
            {currentChapter.id === 3 && (
              <div className="w-full max-w-xl space-y-4 animate-slide-left">
                <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 shadow-xl">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Google Gemini 24/7 AI Academic Tutor
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Syllabus Q&A, active-recall flashcard generator & instant note summarizer.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-3.5 text-left text-xs max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
                    <Bot className="w-4 h-4" />
                    <span>Gemini AI Tutor:</span>
                  </div>
                  <p className="text-slate-200 text-xs italic">
                    "AKTU CBCS awards letter grades: O (10 pts), A+ (9 pts), A (8 pts), B+ (7 pts). Passing criteria is 40% aggregate..."
                  </p>
                </div>
              </div>
            )}

            {/* SCENE 4: CGPA Engine & 75% Bunk Radar */}
            {currentChapter.id === 4 && (
              <div className="w-full max-w-xl space-y-4 animate-slide-left">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-xl">
                  <Calculator className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    University CGPA Engine & 75% Bunk Radar
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Official CBCS formulas for AKTU, VTU, DU, SPPU, MU + attendance bunk strategy.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-xs">
                  <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">Calculated SGPA</div>
                    <div className="text-xl font-black text-blue-400">8.65 / 10.0</div>
                    <div className="text-[10px] text-emerald-400 font-bold">Percentage: 81.5%</div>
                  </div>
                  <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase">75% Bunk Radar</div>
                    <div className="text-xl font-black text-emerald-400">4 Safe Bunks</div>
                    <div className="text-[10px] text-slate-400">Attendance: 82.4%</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 5: Dropshipping & EmailJS */}
            {currentChapter.id === 5 && (
              <div className="w-full max-w-xl space-y-4 animate-slide-left">
                <div className="inline-flex p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 shadow-xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Automated Dropship Bot & EmailJS Invoices
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                    Auto-purchasing at lowest vendor with real-time email verification and tracking.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-2xl max-w-md mx-auto text-xs text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">✓ EmailJS Dispatched (200 OK)</span>
                    <span className="font-mono text-slate-400">Order #SSS-ORD-8812</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    OTP Verified • Dropship Worker Selected Amazon Fulfillment • Instant Wallet Refund Active
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Subtitles & Live Narration Banner */}
          <div className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 backdrop-blur-md text-left flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  AI Voiceover Subtitles
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  "{currentChapter.narration}"
                </p>
              </div>
            </div>

            <button
              onClick={() => handleLaunchLive(currentChapter.tab)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all hover:scale-105"
            >
              <span>Try Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Video Controls Timeline Bar */}
        <div className="p-4 sm:p-5 theme-card border-t theme-border space-y-3">
          
          {/* Timeline Slider with Chapter Markers */}
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <input
                type="range"
                min={0}
                max={TOTAL_DURATION}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono theme-text-muted">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(TOTAL_DURATION)}</span>
            </div>
          </div>

          {/* Playback Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlayPause}
                className="p-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-bold shadow-md shadow-blue-600/25 flex items-center justify-center cursor-pointer transition-all"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => jumpToChapter((activeChapterIndex - 1 + CHAPTERS.length) % CHAPTERS.length)}
                className="p-2.5 rounded-xl theme-card-sub border theme-border hover:opacity-80 cursor-pointer"
                title="Previous Chapter"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => jumpToChapter((activeChapterIndex + 1) % CHAPTERS.length)}
                className="p-2.5 rounded-xl theme-card-sub border theme-border hover:opacity-80 cursor-pointer"
                title="Next Chapter"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl border theme-border cursor-pointer transition-colors ${
                  isMuted ? 'bg-rose-500/10 text-rose-500' : 'theme-card-sub text-blue-500'
                }`}
                title={isMuted ? 'Unmute AI Voiceover' : 'Mute AI Voiceover'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="theme-text-muted text-[11px] mr-1 hidden sm:inline">Speed:</span>
              {[1, 1.25, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold border transition-all cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'theme-card-sub theme-border theme-text-muted hover:theme-text-heading'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

          </div>

          {/* Chapter Quick Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t theme-border">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => jumpToChapter(idx)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  activeChapterIndex === idx
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'theme-card-sub border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="text-[9px] uppercase font-mono opacity-80">
                  {ch.timestamp} • Ch {ch.id}
                </div>
                <div className="text-xs truncate font-bold mt-0.5">
                  {ch.category}
                </div>
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
