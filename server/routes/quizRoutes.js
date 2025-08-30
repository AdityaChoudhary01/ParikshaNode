import express from 'express';
const router = express.Router();
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizDetailsForAdmin,
  getMyQuizzes,
  generateQuizWithAI
} from '../controllers/quizController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getQuizzes)
  .post(protect, createQuiz);

// Get quizzes created by the logged-in user (private)
router.route('/myquizzes').get(protect, getMyQuizzes);

// Generate a quiz using AI (admin-only)
router.route('/generate-ai').post(protect, isAdmin, generateQuizWithAI);

// Submit answers to a quiz (private)
router.route('/:id/submit').post(protect, submitQuiz);

// Get full quiz details with answers (admin-only)
router.route('/:id/details').get(protect, isAdmin, getQuizDetailsForAdmin);

// Get a single quiz (public), update (private), delete (private)
router
  .route('/:id')
  .get(getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

export default router;
