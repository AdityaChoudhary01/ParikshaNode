import express from 'express';
const router = express.Router();

import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizDetails,
  getMyQuizzes,
  generateQuizWithAI,
  getQuizAttemptStatus
} from '../controllers/quizController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Get all quizzes (public) & create a quiz (private)
router.route('/')
  .get(getQuizzes)
  .post(protect, createQuiz);

// Get quizzes created by the logged-in user (private)
router.route('/myquizzes').get(protect, getMyQuizzes);

// FIX: Removed 'isAdmin' so any protected user can access the AI generation.
router.route('/generate-ai').post(protect, generateQuizWithAI);

// Submit answers to a quiz (private)
router.route('/:id/submit').post(protect, submitQuiz);

// Check if a user has already attempted a quiz (private) - Re-added for functionality
router.route('/:id/attempt-status').get(protect, getQuizAttemptStatus);

// Get full quiz details with answers (private, for admin or creator)
router.route('/:id/details').get(protect, getQuizDetails);

// Get a single quiz (public), update (private), delete (private)
router
  .route('/:id')
  .get(getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

export default router;
