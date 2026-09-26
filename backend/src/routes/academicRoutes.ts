import { Router } from 'express';
import { db } from '../db/index.js';
import { UNIVERSITIES, calculateSGPA, predictRequiredMarks } from '../services/academicCalculationService.js';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware.js';
import { AcademicRecord } from '../types/index.js';

export const academicRoutes = Router();

// Get list of supported Indian Universities
academicRoutes.get('/universities', (req, res) => {
  res.json({ universities: Object.values(UNIVERSITIES) });
});

// Calculate SGPA and Percentage
academicRoutes.post('/calculate-sgpa', (req, res) => {
  const { universityCode, subjects } = req.body;
  const univ = UNIVERSITIES[universityCode || 'AKTU'] || UNIVERSITIES.AKTU;

  const sgpa = calculateSGPA(subjects || []);
  const percentage = univ.calculatePercentage(sgpa);

  res.json({
    university: univ.name,
    formula: univ.formulaDescription,
    sgpa,
    percentage
  });
});

// Target Marks Predictor
academicRoutes.post('/predict-marks', (req, res) => {
  const { internalMarks, maxInternal, targetGradePoint, maxExternal } = req.body;
  const prediction = predictRequiredMarks(
    internalMarks || 0,
    maxInternal || 30,
    targetGradePoint || 9,
    maxExternal || 70
  );

  res.json(prediction);
});

// Save Marksheet Transcript
academicRoutes.post('/records', authenticateToken, (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const { universityCode, universityName, semester, branch, sgpa, cgpa, percentage, subjects } = req.body;

  const newRecord: AcademicRecord = {
    id: `acad-${Date.now()}`,
    userId: user.id,
    universityCode: universityCode || 'AKTU',
    universityName: universityName || 'Dr. APJ Abdul Kalam Technical University',
    semester: semester || 5,
    branch: branch || 'Computer Science & Engineering',
    sgpa: sgpa || 0,
    cgpa: cgpa || sgpa || 0,
    percentage: percentage || 0,
    subjects: subjects || [],
    calculatedAt: new Date().toISOString()
  };

  const records = db.getAcademicRecords();
  records.unshift(newRecord);
  db.setAcademicRecords(records);

  res.status(201).json({ message: 'Transcript record saved in Academic Vault', record: newRecord });
});

// Get User's Saved Marksheets
academicRoutes.get('/records', authenticateToken, (req: AuthRequest, res) => {
  const user = req.user || db.getUsers()[0];
  const records = db.getAcademicRecords().filter(r => r.userId === user.id);
  res.json({ count: records.length, records });
});

// Delete Marksheet
academicRoutes.delete('/records/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const records = db.getAcademicRecords().filter(r => r.id !== id);
  db.setAcademicRecords(records);
  res.json({ message: 'Transcript record deleted' });
});
