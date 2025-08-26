import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';

export const getQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({})
        .populate('createdBy', 'username')
        .select('-questions.correctAnswerIndex');
    res.status(200).json(quizzes);
});

export const getQuizById = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswerIndex');
    if (quiz) {
        res.status(200).json(quiz);
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});

export const getQuizDetailsForAdmin = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
        res.status(200).json(quiz);
    } else {
        res.status(404);
        throw new Error('Quiz not found');
    }
});


export const getMyQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.status(200).json(quizzes);
});


export const createQuiz = asyncHandler(async (req, res) => {
    const { title, description, category, timerType, timer, questions } = req.body;
    const quiz = new Quiz({
        title, description, category, timerType, timer, questions,
        createdBy: req.user._id,
    });
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
});


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


export const submitQuiz = asyncHandler(async (req, res) => {
    const { userAnswers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
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
    });
    const savedResult = await result.save();
    res.status(201).json({ resultId: savedResult._id });
});
