import React, { useState } from 'react';
import { 
  Sparkles, Brain, Clock, CheckCircle2, AlertTriangle, 
  RotateCw, Plus, Trash2, BookOpen, Layers, Flame, 
  FileText, ArrowRight, Download, Check, Target, 
  Award, ShieldAlert, Zap, BarChart3, Filter, Send, Bot,
  User as UserIcon, RefreshCw, HelpCircle, MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  generateAISummary, generateAIFlashcards, 
  chatWithAITutor, getAIBunkAdvice 
} from '../services/aiService';

export const StudyHubView: React.FC = () => {
  const { addToast } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'ai_summarizer' | 'flashcards' | 'ai_tutor' | 'assignments' | 'resources'>('attendance');

  // Attendance & Bunk Forecaster State
  const [courses, setCourses] = useState([
    {
      id: 'cs-301',
      code: 'CS301',
      name: 'Operating Systems & Concurrency',
      instructor: 'Dr. A. Sharma',
      credits: 4,
      attended: 32,
      total: 36,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'cs-302',
      code: 'CS302',
      name: 'Database Management Systems (DBMS)',
      instructor: 'Prof. R. Verma',
      credits: 4,
      attended: 28,
      total: 30,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'cs-303',
      code: 'CS303',
      name: 'Data Structures & Algorithms (DSA)',
      instructor: 'Dr. K. Patel',
      credits: 4,
      attended: 38,
      total: 40,
      color: 'from-amber-600 to-orange-600'
    },
    {
      id: 'cs-304',
      code: 'CS304',
      name: 'Computer Networks & Security',
      instructor: 'Prof. M. Sen',
      credits: 3,
      attended: 18,
      total: 26,
      color: 'from-purple-600 to-fuchsia-600'
    }
  ]);

  // AI Bunk Advice state
  const [aiBunkAdvice, setAiBunkAdvice] = useState<{ [courseId: string]: string }>({});
  const [loadingBunkAdviceId, setLoadingBunkAdviceId] = useState<string | null>(null);

  // AI Summarizer State
  const [noteContent, setNoteContent] = useState('');
  const [noteSubject, setNoteSubject] = useState('Operating Systems');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<any>(null);

  // Flashcards State
  const [flashcards, setFlashcards] = useState([
    {
      id: 'fc-1',
      courseCode: 'CS301 (OS)',
      question: 'What are the 4 Coffman conditions required for a Deadlock in Operating Systems?',
      answer: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
      mastery: 'Mastered',
      isFlipped: false
    },
    {
      id: 'fc-2',
      courseCode: 'CS302 (DBMS)',
      question: 'What is the key architectural difference between B-Tree and B+ Tree?',
      answer: 'In a B+ Tree, data record pointers are exclusively stored in the leaf nodes, which are linked together as a doubly linked list for fast range scan queries.',
      mastery: 'Reviewing',
      isFlipped: false
    },
    {
      id: 'fc-3',
      courseCode: 'CS304 (Networks)',
      question: 'Explain the 3 steps of the TCP 3-Way Handshake protocol.',
      answer: '1. Client sends SYN\n2. Server responds with SYN-ACK\n3. Client responds with ACK. Connection is established.',
      mastery: 'Mastered',
      isFlipped: false
    },
    {
      id: 'fc-4',
      courseCode: 'CS303 (DSA)',
      question: 'What is the Master Theorem condition for T(n) = 2T(n/2) + O(n)?',
      answer: 'a = 2, b = 2, f(n) = n. Since n^(log_2(2)) = n^1 = f(n), Case 2 applies: Time Complexity is Theta(n log n).',
      mastery: 'New',
      isFlipped: false
    }
  ]);

  // AI Flashcards Generator Form
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [aiCardSubject, setAiCardSubject] = useState('Operating Systems');
  const [aiCardTopic, setAiCardTopic] = useState('Virtual Memory & Paging Algorithms');
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);

  // 24/7 AI Study Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your StudyVerse AI Academic Mentor powered by Google Gemini. Ask me about textbook comparisons (Galvin vs Tanenbaum, Cormen vs Sahni), university engineering syllabus derivations, or 75% attendance strategies!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Assignment Radar State
  const [assignments, setAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Multi-threaded CPU Process Scheduler in C/Java',
      courseCode: 'CS301 (OS)',
      dueDate: '2026-09-29',
      priority: 'Urgent',
      status: 'In Progress',
      weightage: '15%'
    },
    {
      id: 'asg-2',
      title: 'Design B+ Tree Indexing Engine & Normalization Schema',
      courseCode: 'CS302 (DBMS)',
      dueDate: '2026-10-04',
      priority: 'High',
      status: 'Pending',
      weightage: '10%'
    },
    {
      id: 'asg-3',
      title: 'Dynamic Programming & Graph Traversal Problem Set',
      courseCode: 'CS303 (DSA)',
      dueDate: '2026-09-27',
      priority: 'Urgent',
      status: 'Completed',
      weightage: '10%'
    }
  ]);

  const [showAddAsgModal, setShowAddAsgModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgCourse, setNewAsgCourse] = useState('CS301 (OS)');
  const [newAsgDate, setNewAsgDate] = useState('2026-10-05');
  const [newAsgPriority, setNewAsgPriority] = useState('High');

  // Resource Vault
  const resources = [
    {
      id: 'res-1',
      title: 'OS Process Synchronization & Semaphores Ultimate Cheat Sheet',
      category: 'Cheat Sheet',
      courseCode: 'CS301 (OS)',
      tags: ['Semaphores', 'Mutex', 'Monitors', 'Dining Philosophers'],
      rating: 4.9,
      downloads: 1840
    },
    {
      id: 'res-2',
      title: 'DBMS Normalization (1NF to BCNF) & Dependency Matrix Solved PYQs',
      category: 'Exam Notes',
      courseCode: 'CS302 (DBMS)',
      tags: ['Normalization', 'Functional Dependencies', 'Canonical Cover'],
      rating: 4.8,
      downloads: 2410
    },
    {
      id: 'res-3',
      title: 'Top 50 LeetCode Java & C++ Patterns with Asymptotic Analysis',
      category: 'Code Guide',
      courseCode: 'CS303 (DSA)',
      tags: ['Dynamic Programming', 'Sliding Window', 'Graphs', 'Trees'],
      rating: 5.0,
      downloads: 5120
    },
    {
      id: 'res-4',
      title: 'Computer Networks Subnetting & IP Header Formula Reference',
      category: 'Formula Card',
      courseCode: 'CS304 (Networks)',
      tags: ['Subnetting', 'CIDR', 'TCP Header', 'OSI Layers'],
      rating: 4.7,
      downloads: 1670
    }
  ];

  // Attendance Handlers
  const handleAttendanceAction = (courseId: string, action: 'attend' | 'miss') => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        if (action === 'attend') {
          return { ...c, attended: c.attended + 1, total: c.total + 1 };
        } else {
          return { ...c, total: c.total + 1 };
        }
      }
      return c;
    }));
    addToast('info', 'Attendance Updated', `Class record updated.`);
  };

  const handleFetchAIBunkAdvice = async (course: any) => {
    setLoadingBunkAdviceId(course.id);
    const pct = course.total > 0 ? (course.attended / course.total) * 100 : 0;
    try {
      const advice = await getAIBunkAdvice(course.total, course.attended, course.name, pct);
      setAiBunkAdvice(prev => ({ ...prev, [course.id]: advice }));
    } catch (err: any) {
      addToast('error', 'AI Advice Error', err.message);
    } finally {
      setLoadingBunkAdviceId(null);
    }
  };

  // AI Summarizer Handler
  const handleRunSummarizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent) return;

    setIsSummarizing(true);
    try {
      const res = await generateAISummary(noteContent, noteSubject);
      setSummaryResult(res);
      addToast('success', 'Gemini AI Summary Generated', 'High-yield exam takeaways extracted!');
    } catch (err: any) {
      addToast('error', 'AI Summarizer Failed', err.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  // AI Flashcards Generator Handler
  const handleGenerateAIFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCardTopic) return;

    setIsGeneratingCards(true);
    try {
      const newCards = await generateAIFlashcards(aiCardSubject, aiCardTopic, 4);
      setFlashcards(prev => [
        ...newCards.map(c => ({ ...c, isFlipped: false })),
        ...prev
      ]);
      setShowAddCardModal(false);
      setAiCardTopic('');
      addToast('success', 'AI Flashcards Generated', `Added ${newCards.length} revision cards to your deck!`);
    } catch (err: any) {
      addToast('error', 'AI Generation Error', err.message);
    } finally {
      setIsGeneratingCards(false);
    }
  };

  // Flashcards Flip & Mastery
  const toggleCardFlip = (id: string) => {
    setFlashcards(prev => prev.map(f => f.id === id ? { ...f, isFlipped: !f.isFlipped } : f));
  };

  const setCardMastery = (id: string, mastery: string) => {
    setFlashcards(prev => prev.map(f => f.id === id ? { ...f, mastery } : f));
    addToast('info', 'Mastery Updated', `Card marked as ${mastery}`);
  };

  // AI Chat Tutor Handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: timeNow }]);
    setIsChatLoading(true);

    try {
      const reply = await chatWithAITutor(userText);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply, time: replyTime }]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Encountered temporary connection delay. Please retry your question.', time: '' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Assignment Handlers
  const handleToggleAsgStatus = (id: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        const next = a.status === 'Pending' ? 'In Progress' : a.status === 'In Progress' ? 'Completed' : 'Pending';
        return { ...a, status: next };
      }
      return a;
    }));
  };

  const handleAddAsgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle) return;

    setAssignments(prev => [
      {
        id: `asg-${Date.now()}`,
        title: newAsgTitle,
        courseCode: newAsgCourse,
        dueDate: newAsgDate,
        priority: newAsgPriority,
        status: 'Pending',
        weightage: '10%'
      },
      ...prev
    ]);
    setNewAsgTitle('');
    setShowAddAsgModal(false);
    addToast('success', 'Assignment Added', 'Scheduled on Deadline Radar.');
  };

  // Global attendance calculation
  const totalAttendedAll = courses.reduce((acc, c) => acc + c.attended, 0);
  const totalClassesAll = courses.reduce((acc, c) => acc + c.total, 0);
  const aggregatePct = totalClassesAll > 0 ? ((totalAttendedAll / totalClassesAll) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
            <Brain className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            StudyVerse AI Academic Workspace (Google Gemini Connected)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black theme-text-heading">
            AI Study Engine, Attendance & 24/7 Academic Tutor
          </h1>
          <p className="text-xs sm:text-sm theme-text-muted max-w-xl leading-relaxed">
            Statutory 75% university bunk forecaster, Gemini AI note summarizer, active-recall 3D flashcards, and 24/7 syllabus doubt solving.
          </p>
        </div>

        {/* Aggregate Attendance Card */}
        <div className="theme-card-sub border theme-border p-4 rounded-2xl text-center flex-shrink-0 min-w-[200px]">
          <div className="text-[10px] uppercase font-bold theme-text-muted">Semester Aggregate Attendance</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 my-1">{aggregatePct}%</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {parseFloat(aggregatePct) >= 75 ? 'Eligible for Exams (≥ 75%)' : 'Caution: Below 75%'}
          </div>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center gap-2 border-b theme-border pb-3 overflow-x-auto">
        {[
          { id: 'attendance', label: 'Attendance & 75% Bunk Radar', icon: Target },
          { id: 'ai_summarizer', label: 'AI Note Condenser (Gemini)', icon: Sparkles },
          { id: 'flashcards', label: `Active-Recall Flashcards (${flashcards.length})`, icon: Layers },
          { id: 'ai_tutor', label: '24/7 AI Study Tutor & Chat', icon: Bot },
          { id: 'assignments', label: `Assignment Radar (${assignments.length})`, icon: Clock },
          { id: 'resources', label: 'Resource Vault & Solved PYQs', icon: BookOpen },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSubTab === t.id
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 font-bold'
                  : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: ATTENDANCE & 75% BUNK FORECASTER */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => {
              const pct = course.total > 0 ? parseFloat(((course.attended / course.total) * 100).toFixed(1)) : 0;
              const isSafe = pct >= 75;
              const safeBunks = isSafe ? Math.floor((course.attended / 0.75) - course.total) : 0;
              const requiredToAttend = !isSafe ? Math.ceil((0.75 * course.total - course.attended) / 0.25) : 0;

              return (
                <div 
                  key={course.id}
                  className="theme-card border theme-border rounded-3xl p-6 relative overflow-hidden shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-blue-500 dark:text-cyan-300 uppercase theme-card-sub px-2 py-0.5 rounded border theme-border">
                        {course.code} • {course.credits} Credits
                      </span>
                      <h3 className="text-base font-bold theme-text-heading mt-1.5">{course.name}</h3>
                      <p className="text-xs theme-text-muted">{course.instructor}</p>
                    </div>

                    <div className="text-right">
                      <div className={`text-2xl font-black ${isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {pct}%
                      </div>
                      <div className="text-[10px] theme-text-muted font-mono">
                        {course.attended} / {course.total} Classes
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full theme-card-sub rounded-full h-2.5 overflow-hidden border theme-border">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 85 ? 'bg-emerald-500' :
                        pct >= 75 ? 'bg-cyan-500' :
                        'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {/* Statutory 75% Bunk Radar Pill */}
                  <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${
                    isSafe 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                  }`}>
                    {isSafe ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                    <div className="leading-tight">
                      {isSafe ? (
                        <span>
                          <b>Safe:</b> You can bunk <b>{safeBunks}</b> more class(es) without falling below 75%.
                        </span>
                      ) : (
                        <span>
                          <b>Warning:</b> Danger zone! Attend <b>{requiredToAttend}</b> consecutive classes to reach 75%.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Strategic Bunk Advice */}
                  {aiBunkAdvice[course.id] ? (
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-cyan-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Strategic Study Plan:
                      </div>
                      <p className="theme-text-heading leading-relaxed text-[11px]">{aiBunkAdvice[course.id]}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFetchAIBunkAdvice(course)}
                      disabled={loadingBunkAdviceId === course.id}
                      className="w-full py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{loadingBunkAdviceId === course.id ? 'Analyzing with Gemini...' : 'Get Gemini AI Bunk Strategy'}</span>
                    </button>
                  )}

                  {/* Quick Attendance Buttons */}
                  <div className="flex gap-2 pt-1 border-t theme-border">
                    <button
                      onClick={() => handleAttendanceAction(course.id, 'attend')}
                      className="flex-1 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Attended Class (+1)</span>
                    </button>

                    <button
                      onClick={() => handleAttendanceAction(course.id, 'miss')}
                      className="flex-1 py-2 px-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Missed / Bunked (+1)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: AI STUDY SUMMARIZER (GEMINI POWERED) */}
      {activeSubTab === 'ai_summarizer' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold theme-text-heading">
                Intelligent Textbook & Note Condenser
              </h2>
              <p className="text-xs theme-text-muted">
                Powered by Google Gemini AI: Condenses syllabus chapters into high-yield 2-mark & 10-mark exam takeaways.
              </p>
            </div>

            <form onSubmit={handleRunSummarizer} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Subject / University Course</label>
                <input
                  type="text"
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  placeholder="e.g. Operating Systems / Database Management / Engineering Math"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Lecture Content / Textbook Excerpt *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste dense textbook paragraphs here (e.g. Semaphores, Peterson algorithm, Normalization rules, B+ tree indexing, Quicksort partition)..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-2xl p-4 text-xs sm:text-sm placeholder:opacity-60 outline-none focus:ring-2 focus:ring-cyan-500 font-serif leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSummarizing || !noteContent}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSummarizing ? 'Analyzing with Google Gemini...' : 'Generate Gemini AI High-Yield Summary'}</span>
              </button>
            </form>

            {/* AI Summary Output Card */}
            {summaryResult && (
              <div className="theme-card-sub border theme-border rounded-2xl p-6 space-y-4 text-left shadow-xl animate-in fade-in duration-300">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b theme-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 uppercase">{summaryResult.subject}</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold">
                      {summaryResult.readingTimeSaved}
                    </span>
                  </div>
                  <div className="text-[10px] theme-text-muted">
                    Condensed from {summaryResult.originalWordCount} to {summaryResult.condensedWordCount} words
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold theme-text-muted mb-1">Executive Summary</h4>
                  <p className="text-xs sm:text-sm theme-text-heading leading-relaxed font-serif">
                    {summaryResult.executiveSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-blue-500 dark:text-cyan-400 mb-2">High-Yield Takeaways</h4>
                  <ul className="space-y-1.5 text-xs theme-text-heading">
                    {summaryResult.keyTakeaways?.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-cyan-500 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {summaryResult.highYieldExamQuestions && summaryResult.highYieldExamQuestions.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-bold text-purple-500 dark:text-purple-400 mb-2">
                      University Exam Questions (2M / 10M)
                    </h4>
                    <ul className="space-y-1.5 text-xs theme-text-heading">
                      {summaryResult.highYieldExamQuestions.map((q: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-700 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    University Examination Tip:
                  </div>
                  <p className="text-[11px] opacity-90">{summaryResult.examFocusTip}</p>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* SUB-VIEW 3: ACTIVE RECALL FLASHCARDS (AI GENERATOR) */}
      {activeSubTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold theme-text-heading">Active-Recall Spaced Repetition Decks</h2>
              <p className="text-xs theme-text-muted">Generate AI cards from any syllabus topic or create your own.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Generate Deck</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flashcards.map(card => (
              <div
                key={card.id}
                className="theme-card border theme-border rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/40 shadow-xl transition-all min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold font-mono text-blue-500 dark:text-cyan-300 theme-card-sub px-2 py-0.5 rounded border theme-border">
                      {card.courseCode}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      card.mastery === 'Mastered' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30' :
                      card.mastery === 'Reviewing' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
                    }`}>
                      {card.mastery}
                    </span>
                  </div>

                  {/* Card Content (Click to Flip) */}
                  <div 
                    onClick={() => toggleCardFlip(card.id)}
                    className="cursor-pointer py-4 select-none"
                  >
                    {!card.isFlipped ? (
                      <div>
                        <span className="text-[10px] uppercase font-bold theme-text-muted block mb-1">Question:</span>
                        <h4 className="font-bold text-sm sm:text-base theme-text-heading leading-snug">
                          {card.question}
                        </h4>
                        <span className="inline-block mt-3 text-[10px] text-blue-500 dark:text-cyan-400 font-semibold underline">
                          Click to reveal answer ⤾
                        </span>
                      </div>
                    ) : (
                      <div className="theme-card-sub p-4 rounded-2xl border border-cyan-500/30 text-xs sm:text-sm theme-text-heading whitespace-pre-line leading-relaxed font-serif">
                        <span className="text-[10px] uppercase font-bold theme-text-muted block mb-1 font-sans">Answer & Key Points:</span>
                        {card.answer}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mastery Status Selector */}
                <div className="flex items-center justify-between pt-3 border-t theme-border text-xs">
                  <span className="text-[11px] theme-text-muted">Mastery Level:</span>
                  <div className="flex gap-1.5">
                    {['New', 'Reviewing', 'Mastered'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setCardMastery(card.id, lvl)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          card.mastery === lvl
                            ? 'bg-blue-600 text-white'
                            : 'theme-card-sub theme-text-muted hover:theme-text-heading border theme-border'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI FLASHCARDS GENERATION MODAL */}
          {showAddCardModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
              <div className="theme-card border theme-border rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl space-y-4">
                <button
                  onClick={() => setShowAddCardModal(false)}
                  className="absolute top-5 right-5 theme-text-muted hover:theme-text-heading p-2 rounded-full theme-card-sub border theme-border"
                >
                  ✕
                </button>

                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-lg font-bold theme-text-heading">Generate AI Flashcards</h3>
                </div>
                <p className="text-xs theme-text-muted">Enter course subject and target syllabus topic. Google Gemini will generate 4 exam-ready active recall cards.</p>

                <form onSubmit={handleGenerateAIFlashcards} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold theme-text-heading mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={aiCardSubject}
                      onChange={(e) => setAiCardSubject(e.target.value)}
                      className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      placeholder="e.g. Operating Systems / DBMS / DSA / Networks"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold theme-text-heading mb-1">Syllabus Topic *</label>
                    <input
                      type="text"
                      required
                      value={aiCardTopic}
                      onChange={(e) => setAiCardTopic(e.target.value)}
                      className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      placeholder="e.g. Peterson Algorithm, Virtual Memory, B+ Trees, TCP 3-Way Handshake"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCardModal(false)}
                      className="px-4 py-2 theme-card-sub theme-text-heading rounded-xl text-xs font-semibold hover:opacity-80 border theme-border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGeneratingCards}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/25 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingCards ? 'Generating via Gemini...' : 'Generate 4 Cards'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: 24/7 AI STUDY TUTOR & CHAT */}
      {activeSubTab === 'ai_tutor' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="theme-card border theme-border rounded-3xl p-6 sm:p-8 flex flex-col h-[650px] shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b theme-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-500 border border-cyan-500/40 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm theme-text-heading">StudyVerse AI Academic Tutor</h3>
                  <p className="text-[10px] text-cyan-500 font-mono">Powered by Google Gemini 2.5/3.1 • Indian Universities Specialist</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online & Ready
              </span>
            </div>

            {/* Chat Conversation Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                      : 'theme-card-sub border theme-border theme-text-heading rounded-tl-none font-serif'
                  }`}>
                    {msg.text}
                    {msg.time && (
                      <div className={`text-[9px] mt-1.5 font-sans ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                        {msg.time}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-xl bg-cyan-600 text-white flex items-center justify-center text-xs flex-shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="theme-card-sub border theme-border rounded-2xl p-3.5 text-xs text-cyan-500 font-mono flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Gemini AI is formulating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t theme-border text-[10px]">
              <span className="theme-text-muted font-bold whitespace-nowrap">Suggested:</span>
              {[
                'Derive time complexity of Quicksort',
                'Compare Tanenbaum vs Galvin for OS',
                'Explain 3NF vs BCNF in DBMS',
                'How to recover 75% attendance in 2 weeks?'
              ].map((q, qidx) => (
                <button
                  key={qidx}
                  onClick={() => setChatInput(q)}
                  className="px-2.5 py-1 rounded-lg theme-card-sub border theme-border hover:border-cyan-500 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t theme-border">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask any engineering doubt, formula derivation, or syllabus question..."
                className="flex-1 theme-input theme-text-heading border theme-border rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* SUB-VIEW 5: ASSIGNMENT RADAR */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold theme-text-heading">Academic Deliverables & Deadlines</h2>
              <p className="text-xs theme-text-muted">Track semester submissions and weightages</p>
            </div>

            <button
              onClick={() => setShowAddAsgModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Deliverable</span>
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map(asg => (
              <div 
                key={asg.id}
                className="theme-card border theme-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg hover:border-cyan-500/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono text-cyan-500 theme-card-sub px-2 py-0.5 rounded border theme-border">
                      {asg.courseCode}
                    </span>
                    <span className="text-xs font-bold theme-text-heading">{asg.title}</span>
                  </div>
                  <div className="text-[11px] theme-text-muted flex items-center gap-3">
                    <span>Due: <b>{asg.dueDate}</b></span>
                    <span>•</span>
                    <span>Weightage: <b>{asg.weightage}</b></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAsgStatus(asg.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl uppercase transition-all cursor-pointer ${
                      asg.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30' :
                      asg.status === 'In Progress' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {asg.status} (Click to toggle)
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD ASSIGNMENT MODAL */}
          {showAddAsgModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
              <div className="theme-card border theme-border rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
                <button
                  onClick={() => setShowAddAsgModal(false)}
                  className="absolute top-5 right-5 theme-text-muted hover:theme-text-heading p-2 rounded-full theme-card-sub border theme-border"
                >
                  ✕
                </button>

                <h3 className="text-lg font-bold theme-text-heading mb-4">Add New Academic Task</h3>

                <form onSubmit={handleAddAsgSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold theme-text-heading mb-1">Task Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design BCNF Normalization Schema"
                      value={newAsgTitle}
                      onChange={(e) => setNewAsgTitle(e.target.value)}
                      className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold theme-text-heading mb-1">Course Code</label>
                      <input
                        type="text"
                        value={newAsgCourse}
                        onChange={(e) => setNewAsgCourse(e.target.value)}
                        className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold theme-text-heading mb-1">Priority</label>
                      <select
                        value={newAsgPriority}
                        onChange={(e) => setNewAsgPriority(e.target.value)}
                        className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold theme-text-heading mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newAsgDate}
                      onChange={(e) => setNewAsgDate(e.target.value)}
                      className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAsgModal(false)}
                      className="px-4 py-2 theme-card-sub theme-text-heading rounded-xl text-xs font-semibold hover:opacity-80 border theme-border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/25 cursor-pointer"
                    >
                      Schedule Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 6: RESOURCE VAULT */}
      {activeSubTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map(res => (
            <div key={res.id} className="theme-card border theme-border rounded-3xl p-6 space-y-4 hover:border-cyan-500/40 shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-500 dark:text-cyan-300 theme-card-sub px-2 py-0.5 rounded border theme-border font-bold">
                  {res.courseCode}
                </span>
                <span className="text-xs text-amber-500 font-bold">★ {res.rating} ({res.downloads} downloads)</span>
              </div>

              <h4 className="font-bold text-sm sm:text-base theme-text-heading leading-snug">{res.title}</h4>

              <div className="flex flex-wrap gap-1.5">
                {res.tags.map(t => (
                  <span key={t} className="text-[10px] theme-card-sub theme-text-muted px-2 py-0.5 rounded border theme-border">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t theme-border flex justify-between items-center text-xs">
                <span className="theme-text-muted font-medium">{res.category}</span>
                <button 
                  onClick={() => addToast('success', 'Download Started', `Downloading ${res.title}...`)}
                  className="px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Sheet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
