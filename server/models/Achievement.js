// ParikshaNode-main/server/models/Achievement.js

import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: { // Used for Lucide-React icon name on the client
        type: String,
        required: true,
    },
    triggerType: {
        type: String,
        // FIX APPLIED: These must match the User model's counter fields
        enum: ['quizzesCompletedCount', 'quizzesCreatedCount', 'totalCorrectAnswers'],
        required: true,
    },
    threshold: {
        type: Number,
        required: true,
        min: 1,
    },
}, {
    timestamps: true,
    collection: 'parikshanode-achievements'
});

const Achievement = mongoose.model('Achievement', achievementSchema);

// Default achievements to be seeded on app start
export const defaultAchievements = [
    // FIX APPLIED: These must match the User model's counter fields
    { name: 'First Timer', description: 'Complete your first quiz.', icon: 'Star', triggerType: 'quizzesCompletedCount', threshold: 1 },
    { name: 'Quiz Enthusiast', description: 'Complete 10 quizzes.', icon: 'Award', triggerType: 'quizzesCompletedCount', threshold: 10 },
    { name: 'The Creator', description: 'Create your first quiz.', icon: 'PlusCircle', triggerType: 'quizzesCreatedCount', threshold: 1 },
    { name: 'Prolific Author', description: 'Create 5 quizzes.', icon: 'BookOpen', triggerType: 'quizzesCreatedCount', threshold: 5 },
    { name: 'Knowledge Master', description: 'Answer 100 questions correctly.', icon: 'Brain', triggerType: 'totalCorrectAnswers', threshold: 100 },
];

export default Achievement;
