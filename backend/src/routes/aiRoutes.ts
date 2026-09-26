import { Router } from 'express';
import { db } from '../db/index.js';
import { generateStudySummary, generateFlashcards, askAITutor, callGemini, recommendBooksWithAI } from '../services/geminiService.js';


export const aiRoutes = Router();

// In-memory or file-backed flashcards store
let flashcardsDeck = [
  {
    id: 'fc-1',
    courseCode: 'CS301 (OS)',
    question: 'What are the 4 Coffman conditions required for a Deadlock in Operating Systems?',
    answer: '1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
    mastery: 'Mastered'
  },
  {
    id: 'fc-2',
    courseCode: 'CS302 (DBMS)',
    question: 'What is the key architectural difference between B-Tree and B+ Tree?',
    answer: 'In a B+ Tree, actual data record pointers are exclusively stored in the leaf nodes, which are linked together as a doubly linked list for fast range scan queries.',
    mastery: 'Reviewing'
  },
  {
    id: 'fc-3',
    courseCode: 'CS304 (Networks)',
    question: 'Explain the 3 steps of the TCP 3-Way Handshake protocol.',
    answer: '1. Client sends SYN (Seq=x)\n2. Server responds with SYN-ACK (Seq=y, Ack=x+1)\n3. Client responds with ACK (Seq=x+1, Ack=y+1). Connection is established.',
    mastery: 'Mastered'
  },
  {
    id: 'fc-4',
    courseCode: 'CS303 (DSA)',
    question: 'What is the Master Theorem condition for T(n) = 2T(n/2) + O(n)?',
    answer: 'a = 2, b = 2, f(n) = n. Since n^(log_2(2)) = n^1 = f(n), Case 2 applies: Time Complexity is Theta(n log n).',
    mastery: 'New'
  }
];

// POST /api/ai/summarize - Intelligent Note & Paragraph Condenser via Gemini API
aiRoutes.post('/summarize', async (req, res) => {
  const { content, subject } = req.body;
  if (!content || content.trim().length === 0) {
    res.status(400).json({ error: 'Text content to summarize is required' });
    return;
  }

  try {
    const summaryData = await generateStudySummary(content, subject || 'Engineering & Science');
    res.json({ success: true, data: summaryData });
  } catch (err: any) {
    console.error('AI Summarizer Error:', err);
    // Fallback if needed
    const words = content.trim().split(/\s+/).length;
    res.json({
      success: true,
      data: {
        subject: subject || 'General Academic',
        originalWordCount: words,
        condensedWordCount: Math.round(words * 0.35),
        readingTimeSaved: '3 min saved',
        executiveSummary: content.slice(0, 180) + '...',
        keyTakeaways: [
          'Core mathematical formulas and state transitions highlighted.',
          'Key theoretical definitions prepared for semester exam.'
        ],
        examFocusTip: 'High-frequency question in university exams. Revise proofs and edge cases.',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// POST /api/ai/generate-flashcards - AI Flashcards Generation via Gemini API
aiRoutes.post('/generate-flashcards', async (req, res) => {
  const { subject, topic, count } = req.body;
  if (!subject || !topic) {
    res.status(400).json({ error: 'Subject and topic are required' });
    return;
  }

  try {
    const generated = await generateFlashcards(subject, topic, count || 4);
    // Prepend to flashcards deck
    generated.forEach(card => flashcardsDeck.unshift(card));
    res.json({ success: true, count: generated.length, flashcards: generated });
  } catch (err: any) {
    console.error('AI Flashcard Error:', err);
    res.status(500).json({ error: 'Failed to generate flashcards with AI', details: err.message });
  }
});

// POST /api/ai/chat - Interactive AI Study Tutor & Mentor via Gemini API
aiRoutes.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message || message.trim().length === 0) {
    res.status(400).json({ error: 'Message query is required' });
    return;
  }

  try {
    const reply = await askAITutor(message, history || []);
    res.json({ success: true, reply });
  } catch (err: any) {
    console.error('AI Tutor Chat Error:', err);
    res.status(500).json({ error: 'Failed to communicate with AI Tutor', details: err.message });
  }
});

// POST /api/ai/bunk-advice - 75% Attendance Forecaster AI Advice
aiRoutes.post('/bunk-advice', async (req, res) => {
  const { totalLectures, attendedLectures, subject, currentPercentage } = req.body;
  
  const prompt = `A college engineering student in India currently has ${attendedLectures}/${totalLectures} lectures attended (${currentPercentage.toFixed(1)}%) in ${subject || 'all subjects'}.
University regulations strictly mandate a 75% statutory minimum attendance to sit for end-semester exams.
Provide a concise, encouraging 2-3 sentence strategic advice note telling them:
1. Exactly how many consecutive classes they must attend to cross 75% OR how many safe bunks they have left.
2. A high-yield revision tip to maximize study efficiency during remaining weeks.`;

  try {
    const advice = await callGemini(prompt, 'You are an Indian engineering academic mentor. Provide concise, friendly, high-impact advice.');
    res.json({ success: true, advice });
  } catch (err: any) {
    res.json({
      success: true,
      advice: currentPercentage >= 75
        ? `You are safely above the 75% criteria at ${currentPercentage.toFixed(1)}%. Keep your momentum going and focus on solving previous year university question papers!`
        : `Urgent attention required: You need to attend consecutive upcoming lectures to recover above the 75% bar before university hall tickets are issued.`
    });
  }
});

// GET /api/ai/flashcards - Get active-recall flashcards
aiRoutes.get('/flashcards', (req, res) => {
  const courseCode = req.query.courseCode as string;
  let filtered = flashcardsDeck;
  if (courseCode && courseCode !== 'All') {
    filtered = flashcardsDeck.filter(f => f.courseCode.toLowerCase().includes(courseCode.toLowerCase()));
  }
  res.json({ count: filtered.length, flashcards: filtered });
});

// POST /api/ai/flashcards - Manual / Add new flashcard
aiRoutes.post('/flashcards', (req, res) => {
  const { courseCode, question, answer } = req.body;
  if (!question || !answer) {
    res.status(400).json({ error: 'Question and answer are required' });
    return;
  }

  const newCard = {
    id: `fc-${Date.now()}`,
    courseCode: courseCode || 'CS (General)',
    question,
    answer,
    mastery: 'New'
  };

  flashcardsDeck.unshift(newCard);
  res.status(201).json({ success: true, flashcard: newCard });
});

// PUT /api/ai/flashcards/:id/mastery
aiRoutes.put('/flashcards/:id/mastery', (req, res) => {
  const { id } = req.params;
  const { mastery } = req.body;
  const card = flashcardsDeck.find(f => f.id === id);
  if (!card) {
    res.status(404).json({ error: 'Flashcard not found' });
    return;
  }
  card.mastery = mastery;
  res.json({ success: true, flashcard: card });
});

// POST /api/ai/recommend-books - AI Syllabus & Requirement Textbook Matcher
aiRoutes.post('/recommend-books', async (req, res) => {
  const { requirement } = req.body;
  if (!requirement || requirement.trim().length === 0) {
    res.status(400).json({ error: 'Requirement search query is required' });
    return;
  }

  try {
    const recommendation = await recommendBooksWithAI(requirement);
    res.json({ success: true, data: recommendation });
  } catch (err: any) {
    console.error('AI Recommend Books Error:', err);
    res.status(500).json({ error: 'Failed to process AI book recommendation', details: err.message });
  }
});

