import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuiz = async (topic, numQuestions, difficulty) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    Generate a quiz about "${topic}" with ${numQuestions} questions at a "${difficulty}" difficulty level.
    The response MUST be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.
    The JSON object should have the following structure:
    {
      "title": "Quiz Title",
      "description": "A brief description of the quiz.",
      "category": "${topic}",
      "questions": [
        {
          "text": "The question text?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswerIndex": 0,
          "timer": 30
        }
      ]
    }
    Ensure there are exactly ${numQuestions} objects in the "questions" array.
    Each question must have exactly 4 options.
    The "correctAnswerIndex" must be a number between 0 and 3.
    The "timer" for each question should be 30 seconds.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    // Clean the response to ensure it's a valid JSON string
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating quiz with Gemini API:", error);
    throw new Error('Failed to generate quiz from AI service.');
  }
};
