const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { studentId, password } = req.body;
  if (studentId === 'student' && password === 'studyverse2026') {
    return res.status(200).json({
      success: true,
      user: {
        id: 'std-2026',
        name: 'Zainul Abideen',
        department: 'Computer Science & Engineering',
        semester: '6th Semester',
        cgpa: 8.85
      },
      token: 'jwt_studyverse_auth_valid'
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid Student ID or Password (Demo: student / studyverse2026)' });
});

module.exports = router;
