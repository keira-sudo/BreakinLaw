const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase specific errors
  if (err?.code) {
    switch (err?.code) {
      case 'PGRST116':
        return res?.status(404)?.json({
          error: 'Not Found',
          message: 'Resource not found'
        });
      case '23505':
        return res?.status(409)?.json({
          error: 'Conflict',
          message: 'Resource already exists'
        });
      case '23503':
        return res?.status(400)?.json({
          error: 'Bad Request',
          message: 'Invalid reference to related resource'
        });
      case '42501':
        return res?.status(403)?.json({
          error: 'Forbidden',
          message: 'Insufficient permissions'
        });
      default:
        return res?.status(500)?.json({
          error: 'Database Error',
          message: 'Database operation failed'
        });
    }
  }

  // JWT errors
  if (err?.name === 'JsonWebTokenError') {
    return res?.status(401)?.json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  if (err?.name === 'TokenExpiredError') {
    return res?.status(401)?.json({
      error: 'Unauthorized',
      message: 'Token expired'
    });
  }

  // Validation errors
  if (err?.name === 'ValidationError') {
    return res?.status(400)?.json({
      error: 'Validation Error',
      message: err?.message
    });
  }

  // Default error response
  const statusCode = err?.statusCode || 500;
  const message = err?.message || 'Internal Server Error';

  res?.status(statusCode)?.json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Error',
    message: process.env?.NODE_ENV === 'production'&& statusCode === 500 ?'Something went wrong' 
      : message
  });
};

export default errorHandler;