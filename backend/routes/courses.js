const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/courses
router.get('/', (req, res) => {
  const courses = db.getCourses();
  return res.status(200).json({ success: true, count: courses.length, data: courses });
});

module.exports = router;
