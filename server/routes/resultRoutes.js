import express from 'express';
import {
  getResultById,
  getMyQuizHistory,
  getLeaderboard,
  getQuizReport
} from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/my-history').get(protect, getMyQuizHistory);

router.route('/leaderboard/:quizId').get(getLeaderboard);

router.route('/report/:quizId').get(protect, getQuizReport);

router.route('/:id').get(protect, getResultById);

export default router;
