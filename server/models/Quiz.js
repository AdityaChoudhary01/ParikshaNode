import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  options: [{ 
    type: String, 
    required: true 
  }],
  correctAnswerIndex: { 
    type: Number, 
    required: true 
  },
  // Per-question timer in seconds
  timer: {
    type: Number,
    default: 30,
    min: 5
  }
});

const quizSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  // Field to determine timer mode
  timerType: {
    type: String,
    enum: ['overall', 'per_question'],
    default: 'overall',
  },
  // Overall timer in minutes
  timer: { 
    type: Number, 
    default: 10,
    min: 1
  },
  questions: [questionSchema],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { 
  timestamps: true 
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;