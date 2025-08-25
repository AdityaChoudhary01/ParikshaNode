import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `ProQuiz Contact Form <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_FROM, 
    subject: options.subject,
    text: options.message,
    replyTo: options.replyTo,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;