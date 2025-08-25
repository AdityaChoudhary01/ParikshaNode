import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please fill out all fields.');
  }

  const subject = `New Contact Message from ${name}`;
  const emailMessage = `You have received a new message from your ProQuiz contact form.\n\n` +
                       `Name: ${name}\n` +
                       `Email: ${email}\n\n` +
                       `Message:\n${message}`;

  try {
    await sendEmail({
      subject,
      message: emailMessage,
      replyTo: email,
    });
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Email could not be sent.');
  }
});