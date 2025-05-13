import express from 'express';
import dbManager from '../database/db.js';
import { Parser } from 'json2csv';

const router = express.Router();

// Admin login endpoint - simple password comparison
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === 'admin' && password === 'labug-025') {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add new question
router.post('/questions', async (req, res) => {
  try {
    const { quiz_type, question_type, question_text, options, correct_answer } = req.body;
    const result = await dbManager.pool.execute(
      'INSERT INTO questions (quiz_type, question_type, question_text, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
      [quiz_type, question_type, question_text, JSON.stringify(options), correct_answer]
    );
    res.status(201).json({ success: true, message: 'Question added', id: result[0].insertId });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ success: false, message: 'Failed to add question' });
  }
});

// Get all user answers
router.get('/answers', async (req, res) => {
  try {
    const answers = await dbManager.pool.query(`
      SELECT a.*, q.question_text, q.question_type
      FROM answers a
      JOIN questions q ON a.question_id = q.id
    `);
    res.json(answers[0]);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch answers' });
  }
});

// Export answers to CSV
router.get('/export', async (req, res) => {
  try {
    const answers = await dbManager.pool.query(`
      SELECT a.*, q.question_text, q.question_type
      FROM answers a
      JOIN questions q ON a.question_id = q.id
    `);
    const fields = ['npm', 'question_id', 'answer', 'question_text', 'question_type'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(answers[0]);

    res.header('Content-Type', 'text/csv');
    res.attachment('answers_export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting answers:', error);
    res.status(500).json({ success: false, message: 'Failed to export answers' });
  }
});

export default router;
