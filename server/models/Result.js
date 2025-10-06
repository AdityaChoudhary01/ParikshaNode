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
  // --- Feature 1: Quiz Analytics (Time Taken) ---
  timeTakenInSeconds: { 
    type: Number, 
    default: 0 
  },
  // ---------------------------------------------
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    questionText: { type: String },
    // Feature 4: Mixed data for user/correct answer (index or string)
    userAnswer: { type: mongoose.Schema.Types.Mixed }, 
    correctAnswer: { type: mongoose.Schema.Types.Mixed },
    isCorrect: { type: Boolean }
  }],
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
