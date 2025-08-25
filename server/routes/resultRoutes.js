import express from 'express';
import {
  getResultById,
  getMyQuizHistory,
  getLeaderboard,
} from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route('/my-history').get(protect, getMyQuizHistory);


router.route('/leaderboard/:quizId').get(getLeaderboard);


router.route('/:id').get(protect, getResultById);

export default router;