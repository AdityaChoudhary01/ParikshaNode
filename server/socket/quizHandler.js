// ParikshaNode-main/server/socket/quizHandler.js

import Quiz from '../models/Quiz.js'; // Import Quiz model

const liveQuizRooms = {}; 

const quizSocketHandler = (io, socket) => {
    // Helper function to broadcast the entire room state
    const broadcastRoomState = (quizId, message = null) => {
        const room = liveQuizRooms[quizId];
        if (!room) return;

        io.to(quizId).emit('updateRoomState', {
            message,
            status: room.status,
            participants: room.participants,
            leaderboard: room.leaderboard,
            currentQuestion: room.currentQuestion,
            currentQuestionIndex: room.currentQuestionIndex,
            mode: room.mode, 
            autoTime: room.autoTime, 
        });
    };

    // Helper to start the timer for auto mode
    const startAutoTimer = (quizId) => {
        const room = liveQuizRooms[quizId];
        if (!room || room.mode !== 'auto' || !room.autoTime) return;

        if (room.autoTimer) {
            clearTimeout(room.autoTimer);
        }
        
        // Use room.autoTime which was set by the host (in seconds)
        room.autoTimer = setTimeout(() => {
            handleNextQuestion(quizId, 'Time\'s up! Advancing to next question.');
        }, room.autoTime * 1000);
    };
    
    // Helper to advance the question
    const handleNextQuestion = async (quizId, message) => {
        const room = liveQuizRooms[quizId];
        if (!room || room.status !== 'in-progress') return;

        if (room.autoTimer) {
            clearTimeout(room.autoTimer);
            room.autoTimer = null;
        }

        const quiz = await Quiz.findById(quizId).lean(); 
        if (!quiz) return;

        const nextIndex = room.currentQuestionIndex + 1;

        if (nextIndex >= quiz.questions.length) {
            room.status = 'finished';
            broadcastRoomState(quizId, 'The quiz is finished! Final results are in.');
            return; 
        }

        // Set Next Question
        room.currentQuestionIndex = nextIndex;
        const nextQuestion = quiz.questions[nextIndex];

        // Load actual question text and options
        room.currentQuestion = { 
            text: nextQuestion.text,
            options: nextQuestion.options,
            questionIndex: room.currentQuestionIndex
        };

        room.participants.forEach(p => p.lastAnsweredIndex = -1); 

        broadcastRoomState(quizId, message || `Question ${room.currentQuestionIndex + 1} is live!`);

        if (room.mode === 'auto') {
            startAutoTimer(quizId);
        }
    }


    socket.on('joinQuizRoom', async ({ quizId, userId, username }) => {
        socket.join(quizId);
        
        if (!liveQuizRooms[quizId]) {
            liveQuizRooms[quizId] = { 
                participants: [], 
                leaderboard: [],
                status: 'waiting',
                currentQuestionIndex: -1,
                currentQuestion: null,
                mode: 'manual', 
                autoTime: 30, 
                autoTimer: null, 
            };
        }

        const room = liveQuizRooms[quizId];
        const existingParticipant = room.participants.find(p => p.userId === userId);
        
        let message = '';

        if (!existingParticipant) {
            room.participants.push({ userId, username, score: 0, lastAnsweredIndex: -1, socketId: socket.id });
            room.leaderboard = [...room.participants].sort((a, b) => b.score - a.score);
            message = `${username} joined the room!`;
        } else {
            existingParticipant.socketId = socket.id;
            message = `${username} reconnected.`;
        }
        
        broadcastRoomState(quizId, message);
    });

    socket.on('submitLiveAnswer', async ({ quizId, userId, questionIndex, answer }) => {
        const room = liveQuizRooms[quizId];
        if (!room || room.status !== 'in-progress' || questionIndex !== room.currentQuestionIndex) return;

        const participant = room.participants.find(p => p.userId === userId);
        
        if (participant && participant.lastAnsweredIndex !== questionIndex) {
            
            const isCorrect = Math.random() > 0.5;
            const scoreIncrement = isCorrect ? 10 : 0;

            // --- CRITICAL FIX: Ensure Immutability by creating a new array/object ---
            room.participants = room.participants.map(p => {
                if (p.userId === userId) {
                    return {
                        ...p,
                        score: p.score + scoreIncrement, // New score value
                        lastAnsweredIndex: questionIndex,
                    };
                }
                return p;
            });
            // -----------------------------------------------------------------------

            // Re-sort the leaderboard based on the new, immutable participants array
            room.leaderboard = [...room.participants].sort((a, b) => b.score - a.score);
            
            io.to(socket.id).emit('answerFeedback', { isCorrect, message: isCorrect ? `Correct! +${scoreIncrement} Points` : 'Incorrect.' });
            
            // Broadcast the entire new state, which includes the updated score/leaderboard
            broadcastRoomState(quizId); 

            // Check for immediate advance if in auto mode and all players answered
            if (room.mode === 'auto') {
                 const totalParticipants = room.participants.length;
                 const answeredCount = room.participants.filter(p => p.lastAnsweredIndex === room.currentQuestionIndex).length;
                 
                 if (answeredCount >= totalParticipants) {
                     await handleNextQuestion(quizId, 'All players submitted! Advancing...');
                 }
            }
        }
    });

    socket.on('startQuiz', async ({ quizId, mode, autoTime }) => {
        const room = liveQuizRooms[quizId];
        if (!room || room.status !== 'waiting') return;
        
        room.status = 'in-progress';
        room.mode = mode; 
        room.autoTime = Number(autoTime) || 30;
        room.currentQuestionIndex = -1;

        await handleNextQuestion(quizId, 'The quiz has started! Question 1 is live.');
    });

    socket.on('nextQuestionHost', async ({ quizId }) => {
        const room = liveQuizRooms[quizId];
        if (room && room.mode === 'manual' && room.status === 'in-progress') {
            await handleNextQuestion(quizId);
        }
    });

    socket.on('disconnect', () => {
        Object.keys(liveQuizRooms).forEach(quizId => {
            const room = liveQuizRooms[quizId];
            
            if (room.autoTimer) {
                clearTimeout(room.autoTimer);
            }
            
            const initialCount = room.participants.length;
            
            room.participants = room.participants.filter(p => p.socketId !== socket.id);
            
            if (room.participants.length < initialCount) {
                if (room.participants.length === 0) {
                    delete liveQuizRooms[quizId];
                } else {
                    room.leaderboard = [...room.participants].sort((a, b) => b.score - a.score);
                    broadcastRoomState(quizId, `A player disconnected.`);
                }
            }
        });
    });
};

export default quizSocketHandler;
