const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/resources
router.get('/', (req, res) => {
  const { category } = req.query;
  const resources = db.getResources(category);
  return res.status(200).json({ success: true, count: resources.length, data: resources });
});

module.exports = router;
