const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/assignments
router.get('/', (req, res) => {
  const assignments = db.getAssignments();
  return res.status(200).json({ success: true, count: assignments.length, data: assignments });
});

// POST /api/assignments
router.post('/', (req, res) => {
  const { title, courseCode, dueDate, priority, weightage } = req.body;
  if (!title || !courseCode || !dueDate) {
    return res.status(400).json({ success: false, message: 'Title, courseCode, and dueDate are required.' });
  }
  const item = db.addAssignment({
    title,
    courseCode,
    dueDate,
    priority: priority || 'Normal',
    weightage: weightage || '5%'
  });
  return res.status(201).json({ success: true, data: item });
});

module.exports = router;
