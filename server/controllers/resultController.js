import asyncHandler from 'express-async-handler';
import Result from '../models/Result.js';
import Quiz from '../models/Quiz.js';

export const getResultById = asyncHandler(async (req, res) => {
    // Populate quiz details for display
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

// @desc    Get a detailed report for a specific quiz (Feature 1: Analytics)
// @route   GET /api/results/report/:quizId
// @access  Private (Admin or Quiz Creator)
export const getQuizReport = asyncHandler(async (req, res) => {
    // We fetch the entire quiz here to access questions (for max score and question text)
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

    // Fetch all results for this quiz, sorted for the main report table
    const report = await Result.find({ quiz: req.params.quizId })
        .populate('user', 'username avatar')
        .sort({ score: -1, createdAt: 1 });
    
    // --- START: Feature 1: Quiz Analytics (Calculations) ---
    const totalAttempts = report.length;
    let totalScore = 0;
    let totalTimeTaken = 0;
    const incorrectAnswersByQuestion = {};

    if (totalAttempts > 0) {
        report.forEach(result => {
            totalScore += result.score;
            totalTimeTaken += result.timeTakenInSeconds;

            // Aggregate missed questions
            result.answers.forEach(answer => {
                if (!answer.isCorrect) {
                    const qId = answer.questionId.toString();
                    incorrectAnswersByQuestion[qId] = (incorrectAnswersByQuestion[qId] || 0) + 1;
                }
            });
        });
    }

    const maxScore = quiz.questions.length;
    const avgScore = totalAttempts > 0 ? (totalScore / totalAttempts) : 0;
    const avgPercentage = totalAttempts > 0 ? (avgScore / maxScore) * 100 : 0;
    const avgTimeInSeconds = totalAttempts > 0 ? totalTimeTaken / totalAttempts : 0;
    
    // Find the top 5 most missed questions
    const mostMissedQuestions = Object.entries(incorrectAnswersByQuestion)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([questionId, missedCount]) => {
            const question = quiz.questions.find(q => q._id.toString() === questionId);
            return {
                questionId,
                text: question ? question.text : 'Unknown Question',
                missedCount,
            };
        });

    const analytics = {
        totalAttempts,
        avgScore: avgScore.toFixed(2),
        avgPercentage: avgPercentage.toFixed(1),
        avgTimeInSeconds: avgTimeInSeconds.toFixed(0),
        mostMissedQuestions,
    };
    // --- END: Feature 1: Quiz Analytics (Calculations) ---

    res.status(200).json({
        quiz,
        report,
        analytics, // Send analytics data
    });
});
