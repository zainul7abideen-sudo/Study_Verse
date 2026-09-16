const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'store.json');

const INITIAL_DATA = {
  courses: [
    {
      id: 'cs-301',
      code: 'CS301',
      name: 'Operating Systems & Concurrency',
      instructor: 'Dr. A. Sharma',
      credits: 4,
      attendance: { attended: 32, total: 36, percentage: 88.9 },
      color: '#3B82F6',
      syllabusProgress: 75
    },
    {
      id: 'cs-302',
      code: 'CS302',
      name: 'Database Management Systems (DBMS)',
      instructor: 'Prof. R. Verma',
      credits: 4,
      attendance: { attended: 28, total: 30, percentage: 93.3 },
      color: '#10B981',
      syllabusProgress: 85
    },
    {
      id: 'cs-303',
      code: 'CS303',
      name: 'Data Structures & Algorithms in Java',
      instructor: 'Dr. K. Patel',
      credits: 4,
      attendance: { attended: 38, total: 40, percentage: 95.0 },
      color: '#F59E0B',
      syllabusProgress: 90
    },
    {
      id: 'cs-304',
      code: 'CS304',
      name: 'Computer Networks & Distributed Systems',
      instructor: 'Prof. M. Sen',
      credits: 3,
      attendance: { attended: 24, total: 28, percentage: 85.7 },
      color: '#8B5CF6',
      syllabusProgress: 70
    }
  ],
  assignments: [
    {
      id: 'asg-1',
      title: 'Implement Multi-threaded CPU Scheduler in C/Java',
      courseCode: 'CS301',
      dueDate: '2026-09-22',
      priority: 'Urgent',
      status: 'In Progress',
      weightage: '15%'
    },
    {
      id: 'asg-2',
      title: 'Design B+ Tree Indexing Engine & SQL Queries',
      courseCode: 'CS302',
      dueDate: '2026-09-28',
      priority: 'High',
      status: 'Pending',
      weightage: '10%'
    },
    {
      id: 'asg-3',
      title: 'Sliding Window & Dynamic Programming Problem Set',
      courseCode: 'CS303',
      dueDate: '2026-09-19',
      priority: 'Urgent',
      status: 'Completed',
      weightage: '10%'
    }
  ],
  flashcards: [
    {
      id: 'fc-1',
      courseCode: 'CS301',
      question: 'What are the 4 Coffman conditions required for a Deadlock?',
      answer: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
      mastery: 'Mastered'
    },
    {
      id: 'fc-2',
      courseCode: 'CS302',
      question: 'What is the difference between B-Tree and B+ Tree?',
      answer: 'In a B+ Tree, data pointers are only stored at the leaf nodes, which are linked as a doubly linked list for fast range queries.',
      mastery: 'Reviewing'
    },
    {
      id: 'fc-3',
      courseCode: 'CS304',
      question: 'Explain the TCP 3-Way Handshake steps.',
      answer: '1. Client sends SYN\n2. Server responds with SYN-ACK\n3. Client sends ACK. Connection is established.',
      mastery: 'Mastered'
    }
  ],
  resources: [
    {
      id: 'res-1',
      title: 'OS Process Synchronization Cheat Sheet & Semaphores',
      category: 'Cheat Sheet',
      courseCode: 'CS301',
      link: 'https://github.com/Zainul9142',
      tags: ['Semaphores', 'Mutex', 'Monitors']
    },
    {
      id: 'res-2',
      title: 'DBMS Normalization (1NF to BCNF) Solved PYQs',
      category: 'Exam Notes',
      courseCode: 'CS302',
      link: 'https://github.com/Zainul9142',
      tags: ['Normalization', 'Functional Dependencies']
    },
    {
      id: 'res-3',
      title: 'Top 50 LeetCode Java Patterns with Asymptotic Analysis',
      category: 'Code Guide',
      courseCode: 'CS303',
      link: 'https://github.com/Zainul9142/Data-Structures-and-Algorithms-Java',
      tags: ['Java', 'Algorithms', 'Big-O']
    }
  ],
  notes: []
};

class StudyVerseDB {
  constructor() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_DATA;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  getCourses() {
    return this.read().courses || [];
  }

  getAssignments() {
    return this.read().assignments || [];
  }

  addAssignment(assignment) {
    const data = this.read();
    const item = {
      id: `asg-${Date.now()}`,
      status: 'Pending',
      ...assignment
    };
    data.assignments.unshift(item);
    this.write(data);
    return item;
  }

  getFlashcards(courseCode) {
    const data = this.read();
    let cards = data.flashcards || [];
    if (courseCode && courseCode !== 'All') {
      cards = cards.filter(c => c.courseCode === courseCode);
    }
    return cards;
  }

  addFlashcard(card) {
    const data = this.read();
    const newCard = {
      id: `fc-${Date.now()}`,
      mastery: 'New',
      ...card
    };
    data.flashcards.unshift(newCard);
    this.write(data);
    return newCard;
  }

  getResources(category) {
    const data = this.read();
    let res = data.resources || [];
    if (category && category !== 'All') {
      res = res.filter(r => r.category === category || r.courseCode === category);
    }
    return res;
  }
}

module.exports = new StudyVerseDB();
