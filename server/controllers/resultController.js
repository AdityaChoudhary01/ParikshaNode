import asyncHandler from 'express-async-handler';
import Result from '../models/Result.js';

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