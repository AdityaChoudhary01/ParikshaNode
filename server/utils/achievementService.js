import Achievement, { defaultAchievements } from '../models/Achievement.js';
import User from '../models/User.js';

export const seedAchievements = async () => {
    try {
        for (const achievement of defaultAchievements) {
            await Achievement.findOneAndUpdate(
                { name: achievement.name },
                { $set: achievement },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        console.log('Default achievements seeded successfully.');
    } catch (error) {
        console.error('Error seeding achievements:', error);
    }
};

/**
 * Checks and grants achievements to a user based on updated stats.
 * Includes diagnostic logs to verify counter values.
 */
export const checkAndGrantAchievements = async (userId, userStats) => {
    const user = await User.findById(userId).select('achievements quizzesCompletedCount'); // Select necessary fields
    if (!user) return [];

    const allAchievements = await Achievement.find({});
    const earnedAchievements = [];
    const newAchievementIds = [];

    // --- DIAGNOSTIC: Log the user's current DB count vs. the incoming count ---
    console.log(`\n--- Achievement Triggered for User ${userId} ---`);
    console.log(`DB Count (before check): ${user.quizzesCompletedCount}`);
    console.log(`Incoming Stat Object:`, userStats);
    // -----------------------------------------------------------------------

    for (const achievement of allAchievements) {
        // Skip if already earned
        if (user.achievements.some(id => id.equals(achievement._id))) {
            continue; 
        }

        const triggerValue = userStats[achievement.triggerType];
        
        // --- DIAGNOSTIC: Log comparison data ---
        console.log(`[Check: ${achievement.name}] Type: ${achievement.triggerType}`);
        console.log(`[Check: ${achievement.name}] Current Value: ${triggerValue} | Threshold: ${achievement.threshold}`);
        // ------------------------------------

        // Comparison logic
        if (triggerValue && triggerValue >= achievement.threshold) {
            newAchievementIds.push(achievement._id);
            earnedAchievements.push(achievement);
        }
    }

    if (newAchievementIds.length > 0) {
        await User.findByIdAndUpdate(userId, { $push: { achievements: { $each: newAchievementIds } } });
        console.log(`ACHIEVEMENT GRANTED: ${earnedAchievements.map(a => a.name).join(', ')}`);
    } else {
        console.log(`No new achievements unlocked.`);
    }
    
    return earnedAchievements;
};
