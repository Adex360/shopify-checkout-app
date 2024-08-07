export const errorHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  export const globalErrorMiddleware = (error, req, res, next) => {
    console.log('###globalErrorMiddleware###');
    console.log(error?.response?.data ?? error);
    console.log('========================================');
    return res.status(error.status || 500).json({
      error: {
        status: error.status,
        message: error.status === 500 ? 'Internal server error' : error.message,
        success: false,
      },
    });
  };
  