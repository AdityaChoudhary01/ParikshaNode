import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuiz = async (topic, numQuestions, difficulty, quizType) => {
  // FIX: Using the confirmed working model
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Dynamically generate instructions based on quizType
  let questionInstructions = '';
  let jsonQuestionFields = '';

  if (quizType === 'fill-in-the-blank') {
    questionInstructions = 'Generate fill-in-the-blank questions. The question text MUST contain the string "__BLANK__" to indicate where the missing word/phrase should go. The "correctAnswerIndex" should be the single, exact expected answer string. The "options" field MUST be an empty array [].';
    jsonQuestionFields = `
        {
          "text": "The capital of France is __BLANK__.",
          "type": "fill-in-the-blank",
          "options": [],
          "correctAnswerIndex": "Paris",
          "timer": 30
        }
      `;
  } else if (quizType === 'short-answer') {
    questionInstructions = 'Generate short-answer questions. The "correctAnswerIndex" should be the single, exact expected answer string (case-insensitive when checked). The "options" field MUST be an empty array [].';
    jsonQuestionFields = `
        {
          "text": "The question text?",
          "type": "short-answer",
          "options": [],
          "correctAnswerIndex": "Expected answer string (e.g., 'hydrogen')",
          "timer": 30
        }
      `;
  } else if (quizType === 'true-false') {
    questionInstructions = 'Generate multiple-choice questions in a True/False format. The "options" array MUST be exactly ["True", "False"]. The "correctAnswerIndex" must be 0 for "True" or 1 for "False".';
    jsonQuestionFields = `
        {
          "text": "The question text?",
          "type": "true-false",
          "options": ["True", "False"],
          "correctAnswerIndex": 0,
          "timer": 30
        }
      `;
  } else { // default: multiple-choice
    questionInstructions = 'Generate standard multiple-choice questions. Each question must have 4 distinct options. The "correctAnswerIndex" must be a number between 0 and 3.';
    jsonQuestionFields = `
        {
          "text": "The question text?",
          "type": "multiple-choice",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswerIndex": 0,
          "timer": 30
        }
      `;
  }
  
  const prompt = `
    Generate a quiz about "${topic}" with ${numQuestions} questions at a "${difficulty}" difficulty level.
    ${questionInstructions}
    The response MUST be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.
    The JSON object should have the following structure:
    {
      "title": "Quiz Title",
      "description": "A brief description of the quiz.",
      "category": "${topic}",
      "questions": [
        ${jsonQuestionFields}
      ]
    }
    Ensure there are exactly ${numQuestions} objects in the "questions" array.
    // FIX: Explicitly clarify the required data type for the answer based on question type.
    The "correctAnswerIndex" must be: a number (0-3) for multiple-choice/true-false, or the required string answer for short-answer/fill-in-the-blank.
    The "timer" for each question should be 30 seconds.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    // --- Robust JSON Extraction ---
    let jsonString = text;
    
    // 1. Remove markdown code block wrappers
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 2. Find the start and end of the JSON object (first '{' and last '}')
    const start = jsonString.indexOf('{');
    const end = jsonString.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
        jsonString = jsonString.substring(start, end + 1);
    } else {
        throw new Error('Could not reliably extract JSON from AI response. Raw text was: ' + text);
    }
    // --- End Robust JSON Extraction ---

    // Attempt to parse the JSON
    const quizData = JSON.parse(jsonString);

    // Ensure generated questions have the correct type for consistency with the form
    if (quizData.questions && quizData.questions.length > 0) {
        quizData.questions = quizData.questions.map(q => ({
            ...q,
            type: quizType // Enforce the selected type from the UI
        }));
    }

    return quizData;
  } catch (error) {
    console.error("Error generating quiz with Gemini API. Detailed Error:", error.message, error.stack);
    throw new Error('Failed to generate quiz from AI service.');
  }
};
