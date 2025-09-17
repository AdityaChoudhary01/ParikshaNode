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
  // Added for monitoring features
  monitoringData: [{
    timestamp: { type: Date, required: true },
    eventType: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
  }],
}, { 
  timestamps: true 
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
