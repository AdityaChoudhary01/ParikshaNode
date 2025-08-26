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
  getMyQuizzes
} from '../controllers/quizController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';


router.route('/')
  .get(getQuizzes)
  .post(protect, createQuiz);

router.route('/myquizzes').get(protect, getMyQuizzes);


router.route('/:id/submit').post(protect, submitQuiz);

router.route('/:id/details').get(protect, isAdmin, getQuizDetailsForAdmin);

router
  .route('/:id')
  .get(getQuizById)
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

export default router;
