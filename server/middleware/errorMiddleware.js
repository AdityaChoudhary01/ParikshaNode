const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // --- START: Detailed Error Log ---
  console.error('--- ERROR CAUGHT BY HANDLER ---');
  console.error('Error Message:', err.message);
  console.error('Error Name:', err.name);
  // Log the full stack trace for detailed debugging
  console.error(err.stack);
  console.error('-------------------------------');
  // --- END: Detailed Error Log ---

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };