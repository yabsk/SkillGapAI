const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log error internally for debugging
  console.error(`[Security Log] ${req.method} ${req.url} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
