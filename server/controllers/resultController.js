import asyncHandler from 'express-async-handler';
import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';

export const getResultById = asyncHandler(async (req, res) => {
    const result = await Result.findById(req.params.id).populate('quiz', 'title category');

    if (result) {
        if (result.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to view this result');
        }
        res.status(200).json(result);
    } else {
        res.status(404);
        throw new Error('Result not found');
    }
});

export const getMyQuizHistory = asyncHandler(async (req, res) => {
    const results = await Result.find({ user: req.user._id })
        .populate('quiz', 'title category')
        .sort({ createdAt: -1 });
    res.status(200).json(results);
});

export const getLeaderboard = asyncHandler(async (req, res) => {
    const leaderboard = await Result.find({ quiz: req.params.quizId })
        .populate('user', 'username avatar')
        .sort({ score: -1, createdAt: 1 })
        .limit(10);
        
    res.status(200).json(leaderboard);
});

// @desc    Get a detailed report for a specific quiz
// @route   GET /api/results/report/:quizId
// @access  Private (Admin or Quiz Creator)
export const getQuizReport = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    // Check if the user is the creator of the quiz or an admin
    if (req.user.role !== 'admin' && quiz.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this report');
    }

    const report = await Result.find({ quiz: req.params.quizId })
        .populate('user', 'username avatar')
        .sort({ score: -1, createdAt: 1 });

    res.status(200).json({
        quiz,
        report,
    });
});
