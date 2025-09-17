import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';
import { generateQuiz } from '../utils/geminiService.js';

// @desc    Fetch all quizzes
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({})
        .populate('createdBy', 'username')
        .select('-questions.correctAnswerIndex');
    res.status(200).json(quizzes);
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

// @desc    Fetch a single quiz with answers (for admins)
// @route   GET /api/quizzes/:id/details
// @access  Private/Admin
export const getQuizDetailsForAdmin = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        res.status(200).json(quiz);
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

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
export const createQuiz = asyncHandler(async (req, res) => {
    const { title, description, category, timerType, timer, questions } = req.body;
    const quiz = new Quiz({
        title, description, category, timerType, timer, questions,
        createdBy: req.user._id,
    });
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
});

// @desc    Generate a quiz using AI
// @route   POST /api/quizzes/generate-ai
// @access  Private/Admin
export const generateQuizWithAI = asyncHandler(async (req, res) => {
  const { topic, numQuestions, difficulty } = req.body;
  
  if (!topic || !numQuestions || !difficulty) {
    res.status(400);
    throw new Error('Please provide a topic, number of questions, and difficulty.');
  }

  const quizData = await generateQuiz(topic, numQuestions, difficulty);
  res.status(200).json(quizData);
});

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private
export const updateQuiz = asyncHandler(async (req, res) => {
    const { title, description, category, timerType, timer, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (quiz) {
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('User not authorized to update this quiz');
        }
        quiz.title = title;
        quiz.description = description;
        quiz.category = category;
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

// @desc    Submit answers for a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = asyncHandler(async (req, res) => {
    const { userAnswers, monitoringData } = req.body;
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
        const userAnswerIndex = userAnswers[question._id.toString()];
        const isCorrect = userAnswerIndex === question.correctAnswerIndex;
        if (isCorrect) {
            score++;
        }
        detailedAnswers.push({
            questionId: question._id,
            questionText: question.text,
            userAnswerIndex: userAnswerIndex,
            correctAnswerIndex: question.correctAnswerIndex,
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
    });
    
    const savedResult = await result.save();
    res.status(201).json({ resultId: savedResult._id });
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
