import { Router } from 'express';

export const assignmentRoutes = Router();

let assignments = [
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
];

// GET /api/assignments
assignmentRoutes.get('/', (req, res) => {
  res.json({ count: assignments.length, assignments });
});

// POST /api/assignments
assignmentRoutes.post('/', (req, res) => {
  const { title, courseCode, dueDate, priority, weightage } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Assignment title is required' });
    return;
  }

  const newAsg = {
    id: `asg-${Date.now()}`,
    title,
    courseCode: courseCode || 'CS (General)',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: priority || 'Normal',
    status: 'Pending',
    weightage: weightage || '10%'
  };

  assignments.unshift(newAsg);
  res.status(201).json({ assignment: newAsg });
});

// PUT /api/assignments/:id/status
assignmentRoutes.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const asg = assignments.find(a => a.id === id);
  if (!asg) {
    res.status(404).json({ error: 'Assignment not found' });
    return;
  }
  asg.status = status;
  res.json({ assignment: asg });
});

// DELETE /api/assignments/:id
assignmentRoutes.delete('/:id', (req, res) => {
  const { id } = req.params;
  assignments = assignments.filter(a => a.id !== id);
  res.json({ message: 'Assignment deleted' });
});
