import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  percentage: { 
    type: Number, 
    required: true 
  },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    questionText: { type: String },
    userAnswerIndex: { type: Number },
    correctAnswerIndex: { type: Number },
    isCorrect: { type: Boolean }
  }],
}, { 
  timestamps: true 
});

const Result = mongoose.model('Result', resultSchema);
export default Result;