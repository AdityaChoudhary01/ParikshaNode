import express from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizDetailsForAdmin,
} from '../controllers/quizController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/').get(getQuizzes);


router.route('/').post(protect, isAdmin, createQuiz);


router.route('/:id/submit').post(protect, submitQuiz);


router.route('/:id/details').get(protect, isAdmin, getQuizDetailsForAdmin);

router
  .route('/:id')
  .get(protect, getQuizById)         
  .put(protect, isAdmin, updateQuiz) 
  .delete(protect, isAdmin, deleteQuiz);

export default router;