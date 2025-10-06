import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  // --- Feature 4: Expanded Question Types ---
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-the-blank', 'short-answer'],
    default: 'multiple-choice'
  },
  options: [{ 
    type: String, 
    required: function() {
        return this.type === 'multiple-choice' || this.type === 'true-false';
    }
  }],
  correctAnswerIndex: { // Mixed data for index or string/array of strings
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  // ------------------------------------------
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
  // --- Feature 5: Enhanced Quiz Discovery (Tags) ---
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  // ------------------------------------------
  timerType: {
    type: String,
    enum: ['overall', 'per_question'],
    default: 'overall',
  },
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
