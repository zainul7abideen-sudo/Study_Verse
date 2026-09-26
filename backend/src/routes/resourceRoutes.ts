import { Router } from 'express';

export const resourceRoutes = Router();

const universityResources = [
  {
    id: 'res-1',
    title: 'OS Process Synchronization & Semaphores Ultimate Cheat Sheet',
    category: 'Cheat Sheet',
    courseCode: 'CS301 (OS)',
    tags: ['Semaphores', 'Mutex', 'Monitors', 'Dining Philosophers'],
    downloadUrl: '#',
    rating: 4.9,
    downloads: 1840
  },
  {
    id: 'res-2',
    title: 'DBMS Normalization (1NF to BCNF) & Dependency Matrix Solved PYQs',
    category: 'Exam Notes',
    courseCode: 'CS302 (DBMS)',
    tags: ['Normalization', 'Functional Dependencies', 'Canonical Cover'],
    downloadUrl: '#',
    rating: 4.8,
    downloads: 2410
  },
  {
    id: 'res-3',
    title: 'Top 50 LeetCode Java & C++ Patterns with Asymptotic Analysis',
    category: 'Code Guide',
    courseCode: 'CS303 (DSA)',
    tags: ['Dynamic Programming', 'Sliding Window', 'Graphs', 'Trees'],
    downloadUrl: '#',
    rating: 5.0,
    downloads: 5120
  },
  {
    id: 'res-4',
    title: 'Computer Networks Subnetting & IP Header Formula Reference',
    category: 'Formula Card',
    courseCode: 'CS304 (Networks)',
    tags: ['Subnetting', 'CIDR', 'TCP Header', 'OSI Layers'],
    downloadUrl: '#',
    rating: 4.7,
    downloads: 1670
  }
];

// GET /api/resources
resourceRoutes.get('/', (req, res) => {
  const category = req.query.category as string;
  let filtered = universityResources;
  if (category && category !== 'All') {
    filtered = universityResources.filter(r => r.category === category || r.courseCode.includes(category));
  }
  res.json({ count: filtered.length, resources: filtered });
});
