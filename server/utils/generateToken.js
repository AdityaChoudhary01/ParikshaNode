import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // CRITICAL FIX: Ensure the secret is loaded and not empty
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 10) {
      // NOTE: Replace 'Error' with a proper logging mechanism in production
      console.error('FATAL: JWT_SECRET is missing or too short. Check your .env configuration.');
      throw new Error('JWT_SECRET is not configured or is invalid!');
  }
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return token;
};

export default generateToken;
