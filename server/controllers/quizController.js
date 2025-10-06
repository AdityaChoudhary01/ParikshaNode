import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';
import User from '../models/User.js';
import { generateQuiz } from '../utils/geminiService.js';
import { checkAndGrantAchievements } from '../utils/achievementService.js';

// --- Helper function for grading various question types (Feature 4) ---
const checkAnswer = (question, userAnswer) => {
    // Sanitize user answer and correct answers to handle text input comparison
    const sanitize = (val) => String(val).toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    switch (question.type) {
        case 'true-false':
        case 'multiple-choice': {
            const correctAnswer = question.correctAnswerIndex;
            // userAnswer is expected to be a string number (index)
            return parseInt(userAnswer, 10) === correctAnswer;
        }
        case 'fill-in-the-blank':
        case 'short-answer': {
            // Correct answer is stored as a string or array of acceptable strings/keywords
            const correctAnswers = Array.isArray(question.correctAnswerIndex) 
                ? question.correctAnswerIndex.map(sanitize) 
                : [sanitize(question.correctAnswerIndex)];
            
            const sanitizedUserAnswer = sanitize(userAnswer);

            // Check if the sanitized user answer matches any of the sanitized correct answers
            return correctAnswers.includes(sanitizedUserAnswer);
        }
        default:
            return false;
    }
};
// ------------------------------------------------------------------------

// @desc    Fetch all quizzes (Feature 5: Enhanced Quiz Discovery)
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = asyncHandler(async (req, res) => {
    const { keyword, category } = req.query;
    const query = {};

    if (keyword) {
        const regex = new RegExp(keyword, 'i');
        query.$or = [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { category: { $regex: regex } },
            { tags: { $regex: regex } }, // Search tags (Feature 5)
        ];
    }

    if (category && category !== 'All') {
        query.category = category;
    }

    const quizzes = await Quiz.find(query)
        .populate('createdBy', 'username')
        .select('-questions.correctAnswerIndex');
    
    res.status(200).json(quizzes);
});

// @desc    Create a new quiz (Feature 2, 5)
// @route   POST /api/quizzes
// @access  Private
export const createQuiz = asyncHandler(async (req, res) => {
    // Include tags in destructuring (Feature 5)
    const { title, description, category, tags, timerType, timer, questions } = req.body; 
    const quiz = new Quiz({
        title, description, category, tags, timerType, timer, questions, 
        createdBy: req.user._id,
    });
    const createdQuiz = await quiz.save();

    // Feature 2: Gamification (Quizzes Created & Achievement Check - CONSOLIDATED LOGIC)
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $inc: { quizzesCreatedCount: 1 } }, { new: true });
    
    await checkAndGrantAchievements(
        req.user._id, 
        { quizzesCreatedCount: updatedUser.quizzesCreatedCount }
    );
    // --------------------------------------------------------------------------------------

    res.status(201).json(createdQuiz);
});

// @desc    Update a quiz (Feature 5)
// @route   PUT /api/quizzes/:id
// @access  Private
export const updateQuiz = asyncHandler(async (req, res) => {
    const { title, description, category, tags, timerType, timer, questions } = req.body; 
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('User not authorized to update this quiz');
        }
        quiz.title = title;
        quiz.description = description;
        quiz.category = category;
        quiz.tags = tags; // Save tags (Feature 5)
        quiz.timerType = timerType;
        quiz.timer = timer;
        quiz.questions = questions;
        const updatedQuiz = await quiz.save();
        res.status(200).json(updatedQuiz);
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

// @desc    Submit answers for a quiz (Feature 1, 2, 4)
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = asyncHandler(async (req, res) => {
    // Feature 1: Time Taken in Request Body
    const { userAnswers, monitoringData, timeTakenInSeconds } = req.body; 

    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    // Prevent user from attempting the quiz again
    const existingResult = await Result.findOne({ user: req.user._id, quiz: quiz._id });
    if (existingResult) {
        res.status(400);
        throw new Error('You have already attempted this quiz');
    }

    let score = 0;
    const detailedAnswers = [];
    
    quiz.questions.forEach((question) => {
        // Feature 4: Expanded Grading Logic
        const userAnswer = userAnswers[question._id.toString()];
        const isCorrect = checkAnswer(question, userAnswer);

        // Feature 4: Determine correct answer display for result
        let correctAnswerDisplay;
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
            correctAnswerDisplay = question.options[question.correctAnswerIndex];
        } else {
            correctAnswerDisplay = Array.isArray(question.correctAnswerIndex) ? question.correctAnswerIndex.join(', ') : question.correctAnswerIndex;
        }

        if (isCorrect) {
            score++;
        }

        detailedAnswers.push({
            questionId: question._id,
            questionText: question.text,
            userAnswer: userAnswer, // Save mixed type
            correctAnswer: correctAnswerDisplay,
            isCorrect: isCorrect,
        });
    });
    
    const totalQuestions = quiz.questions.length;
    const percentage = (score / totalQuestions) * 100;

    const result = new Result({
        user: req.user._id,
        quiz: quiz._id,
        score,
        totalQuestions,
        percentage,
        answers: detailedAnswers,
        monitoringData,
        timeTakenInSeconds, // Feature 1: Save time
    });
    
    const savedResult = await result.save();

    // Feature 2: Gamification (Update User Stats & Achievement Check)
    const update = { 
        $inc: { 
            quizzesCompletedCount: 1, 
            totalCorrectAnswers: score 
        } 
    };
    
    const updatedUser = await User.findByIdAndUpdate(req.user._id, update, { new: true });

    await checkAndGrantAchievements(
        req.user._id, 
        { 
            quizzesCompletedCount: updatedUser.quizzesCompletedCount,
            totalCorrectAnswers: updatedUser.totalCorrectAnswers,
        }
    );

    res.status(201).json({ resultId: savedResult._id });
});

// @desc    Fetch a single quiz by ID (for taking the quiz)
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuizById = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswerIndex');
    if (quiz) {
        res.status(200).json(quiz);
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

// @desc    Fetch a single quiz with answers (for admins/creators)
// @route   GET /api/quizzes/:id/details
// @access  Private
export const getQuizDetails = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        // Allow if user is admin or the creator of the quiz
        if (req.user.role === 'admin' || quiz.createdBy.toString() === req.user._id.toString()) {
            res.status(200).json(quiz);
        } else {
            res.status(403);
            throw new Error('Not authorized to view quiz details');
        }
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

// @desc    Get quizzes created by the logged-in user
// @route   GET /api/quizzes/myquizzes
// @access  Private
export const getMyQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.status(200).json(quizzes);
});

// @desc    Generate a quiz using AI
// @route   POST /api/quizzes/generate-ai
// @access  Private
export const generateQuizWithAI = asyncHandler(async (req, res) => {
  // FIX: Added quizType to destructuring
  const { topic, numQuestions, difficulty, quizType } = req.body;
  
  // FIX: Added quizType to validation
  if (!topic || !numQuestions || !difficulty || !quizType) {
    res.status(400);
    throw new Error('Please provide a topic, number of questions, difficulty, and quiz type.');
  }

  // FIX: Passed quizType to generateQuiz
  const quizData = await generateQuiz(topic, numQuestions, difficulty, quizType);
  res.status(200).json(quizData);
});


// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('User not authorized to delete this quiz');
        }
        await quiz.deleteOne();
        await Result.deleteMany({ quiz: req.params.id });
        res.status(200).json({ message: 'Quiz removed' });
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

// @desc    Check if a user has already attempted a quiz
// @route   GET /api/quizzes/:id/attempt-status
// @access  Private
export const getQuizAttemptStatus = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    const existingResult = await Result.findOne({ user: req.user._id, quiz: quiz._id });

    if (existingResult) {
        res.status(200).json({
            attempted: true,
            resultId: existingResult._id,
        });
    } else {
        res.status(200).json({
            attempted: false,
        });
    }
});
