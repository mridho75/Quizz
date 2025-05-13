import express from 'express';
import dbManager from '../database/db.js'; // Import dbManager from db.js

const router = express.Router();

// NPM - Get student by NPM
router.get('/students/:npm', async (req, res) => {
  const { npm } = req.params;  
  try {
    const student = await dbManager.getStudentByNPM(npm);  
    if (student) {
      res.json(student);  
    } else {
      res.status(404).json({ message: 'Student not found' });  
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Validating PC credentials - POST method
router.post('/validatePC', async (req, res) => {
  const { pc_number, password } = req.body;
  try {
    const pcValid = await dbManager.validatePC(pc_number, password);
    if (pcValid) {
      res.json({ valid: true });
    } else {
      res.status(400).json({ valid: false, message: 'Invalid PC number or password' });
    }
  } catch (error) {
    console.error('Error validating PC:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Getting quiz questions based on quiz type
router.get('/questions/:quizType', async (req, res) => {
  try {
    const quizType = req.params.quizType;
    const questions = await dbManager.getQuizQuestions(quizType);
    res.json(questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Saving student answers (based on npm)
router.post('/answers', async (req, res) => {
  const { npm, questionId, answer, quizType } = req.body;
  try {
    const result = await dbManager.saveAnswer(npm, questionId, answer, quizType);
    res.json(result);
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Getting student answers (based on npm)
router.get('/answers/:npm', async (req, res) => {
  try {
    const { npm } = req.params;
    const answers = await dbManager.getStudentAnswers(npm);  
    res.json(answers);
  } catch (error) {
    console.error('Error getting student answers:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Getting student progress
router.get('/progress/:npm', async (req, res) => {
  try {
    const { npm } = req.params;
    const progress = await dbManager.getStudentProgress(npm);
    if (progress && progress.length > 0) {
      res.json(progress);
    } else {
      res.status(404).json({ message: 'No progress found' });
    }
  } catch (error) {
    console.error('Error getting student progress:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Getting all results for admin
router.get('/results', async (req, res) => {
  try {
    const results = await dbManager.getAllResults();
    res.json(results);
  } catch (error) {
    console.error('Error getting all results:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Save new student
router.post('/students', async (req, res) => {
  const { npm, nama, kelas, pcNumber, quiz_type } = req.body;  
  try {
    const result = await dbManager.saveStudent(npm, nama, kelas, pcNumber, quiz_type);  
    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update existing student
router.put('/students/:npm', async (req, res) => {
  const { npm } = req.params;
  const { nama, kelas, pcNumber, quiz_type } = req.body; 
  try {
    const result = await dbManager.saveStudent(npm, nama, kelas, pcNumber, quiz_type);  
    res.json(result);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint untuk resume quiz dengan validasi pc_number
router.get('/resume-quiz/:npm', async (req, res) => {
  const { npm } = req.params;
  const { pc_number } = req.query;

  try {
    const student = await dbManager.getStudentByNPM(npm);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found. Please check your NPM.' });
    }

    if (student.pc_number !== parseInt(pc_number)) {
      return res.status(400).json({ message: 'Invalid PC number' });
    }

    const progress = await dbManager.getStudentProgress(npm);
    res.json({ progress });  
  } catch (error) {
    console.error('Error resuming quiz:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
