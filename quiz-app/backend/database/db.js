import mysql from 'mysql2/promise';
import { dbConfig } from '../config.js';

class DatabaseManager {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  // Validate PC credentials
  async validatePC(pcNumber, password) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM pcs WHERE pc_number = ? AND password = ?',
        [pcNumber, password]
      );
      return rows[0];
    } catch (error) {
      console.error('Error validating PC:', error);
      throw error;
    }
  }

  // Get Admin by Username
  async getAdminByUsername(username) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting admin by username:', error);
      throw error;
    }
  }

  // Save Student (including quiz_type)
  async saveStudent(npm, nama, kelas, pcNumber, quiz_type) {
    try {
      const [result] = await this.pool.execute(
        'INSERT INTO students (npm, nama, kelas, pc_number, quiz_type) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nama = ?, kelas = ?, pc_number = ?, quiz_type = ?',
        [npm, nama, kelas, pcNumber, quiz_type, nama, kelas, pcNumber, quiz_type]
      );
      return result;
    } catch (error) {
      console.error('Error saving student:', error);
      throw error;
    }
  }

  // Get Student by NPM
  async getStudentByNPM(npm) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM students WHERE npm = ?',
        [npm]
      );
      return rows[0];
    } catch (error) {
      console.error('Error getting student:', error);
      throw error;
    }
  }

  // Get Quiz Questions based on quiz type
  async getQuizQuestions(quizType) {
    try {
      const [rows] = await this.pool.execute(
        'SELECT * FROM questions WHERE quiz_type = ?',
        [quizType]
      );

      return rows.map(row => {
        let options = null;
        try {
          if (row.options) {
            if (typeof row.options === 'string') {
              options = JSON.parse(row.options);
            } else if (Array.isArray(row.options)) {
              options = row.options;
            }
          }
        } catch (error) {
          console.error(`Error parsing options for question ${row.id}:`, error);
        }

        return {
          ...row,
          options
        };
      });
    } catch (error) {
      console.error('Error getting quiz questions:', error);
      throw error;
    }
  }

  // Save Answer (including quiz_type)
  async saveAnswer(npm, questionId, answer, quizType) {
    try {
      const [result] = await this.pool.execute(
        'INSERT INTO answers (npm, question_id, answer, quiz_type) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE answer = ?, quiz_type = ?',
        [npm, questionId, answer, quizType, answer, quizType]
      );
      return result;
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  }

  // Get Student Answers
  async getStudentAnswers(npm) {
    try {
      const [rows] = await this.pool.execute(
        `SELECT 
          a.npm,
          a.question_id,
          a.answer,
          q.question_type,
          q.question_text,
          q.options,
          q.quiz_type
        FROM answers a
        JOIN questions q ON a.question_id = q.id
        WHERE a.npm = ?`,
        [npm]
      );

return rows.map(row => {
        let options = null;
        if (row.options) {
          if (typeof row.options === 'string') {
            try {
              options = JSON.parse(row.options);
            } catch (e) {
              options = row.options.split(',').map(opt => opt.trim());
            }
          } else if (Array.isArray(row.options)) {
            options = row.options;
          }
        }
        return {
          ...row,
          options
        };
      });
    } catch (error) {
      console.error('Error getting student answers:', error);
      throw error;
    }
  }

  // Get Student Progress
  async getStudentProgress(npm) {
    try {
      const [rows] = await this.pool.execute(
        `SELECT question_id, answer 
        FROM answers 
        WHERE npm = ?`,
        [npm]
      );
      return rows;
    } catch (error) {
      console.error('Error getting student progress:', error);
      throw error;
    }
  }

  // Get All Results for Admin
  async getAllResults() {
    try {
      const [rows] = await this.pool.execute(
        `SELECT 
          s.npm,
          s.nama,
          s.kelas,
          s.pc_number,
          q.quiz_type,
          COUNT(DISTINCT a.question_id) as questions_answered
        FROM students s
        LEFT JOIN answers a ON s.npm = a.npm
        LEFT JOIN questions q ON a.question_id = q.id
        GROUP BY s.npm, q.quiz_type`
      );
      return rows;
    } catch (error) {
      console.error('Error getting all results:', error);
      throw error;
    }
  }
}

const dbManager = new DatabaseManager();
export default dbManager;
