/**
 * Server-side error handling utilities
 * Provides consistent, user-friendly error messages
 */

// Error codes for client-side handling
export const ErrorCodes = {
  // Authentication errors
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_EXISTS: 'AUTH_USER_EXISTS',

  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_INPUT: 'VALIDATION_INVALID_INPUT',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  PLANT_NOT_FOUND: 'PLANT_NOT_FOUND',
  BADGE_NOT_FOUND: 'BADGE_NOT_FOUND',

  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  DATABASE_INSERT_FAILED: 'DATABASE_INSERT_FAILED',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

// User-friendly error messages
const errorMessages = {
  [ErrorCodes.AUTH_TOKEN_MISSING]: 'Please log in to continue',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Your session has expired. Please log in again',
  [ErrorCodes.AUTH_USER_NOT_FOUND]: 'Account not found. Please register or check your login details',
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.AUTH_USER_EXISTS]: 'An account with this email or username already exists',

  [ErrorCodes.VALIDATION_REQUIRED_FIELD]: 'Please fill in all required fields',
  [ErrorCodes.VALIDATION_INVALID_INPUT]: 'Please check your input and try again',

  [ErrorCodes.RESOURCE_NOT_FOUND]: 'The requested item could not be found',
  [ErrorCodes.PLANT_NOT_FOUND]: 'This plant is no longer available',
  [ErrorCodes.BADGE_NOT_FOUND]: 'Badge not found',

  [ErrorCodes.DATABASE_ERROR]: 'Unable to save your data. Please try again',
  [ErrorCodes.DATABASE_INSERT_FAILED]: 'Unable to save your data. Please try again',

  [ErrorCodes.INTERNAL_ERROR]: 'Something went wrong. Please try again later'
};

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message || errorMessages[code] || 'An error occurred');
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isApiError = true;
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      ...(this.details && { details: this.details })
    };
  }
}

/**
 * Create standard error responses
 */
export const createError = {
  // 400 Bad Request
  badRequest: (message, details = null) =>
    new ApiError(ErrorCodes.VALIDATION_INVALID_INPUT, message, 400, details),

  missingFields: (fields) =>
    new ApiError(
      ErrorCodes.VALIDATION_REQUIRED_FIELD,
      `Missing required fields: ${fields.join(', ')}`,
      400,
      { fields }
    ),

  // 401 Unauthorized
  unauthorized: (message = 'Please log in to continue') =>
    new ApiError(ErrorCodes.AUTH_TOKEN_MISSING, message, 401),

  invalidToken: () =>
    new ApiError(ErrorCodes.AUTH_TOKEN_INVALID, 'Your session has expired. Please log in again', 401),

  invalidCredentials: () =>
    new ApiError(ErrorCodes.AUTH_INVALID_CREDENTIALS, 'Invalid email or password', 401),

  // 404 Not Found
  notFound: (resource = 'Resource') =>
    new ApiError(ErrorCodes.RESOURCE_NOT_FOUND, `${resource} not found`, 404),

  userNotFound: () =>
    new ApiError(ErrorCodes.AUTH_USER_NOT_FOUND, 'Account not found. Please register or check your login details', 404),

  plantNotFound: () =>
    new ApiError(ErrorCodes.PLANT_NOT_FOUND, 'This plant is no longer available', 404),

  // 409 Conflict
  userExists: () =>
    new ApiError(ErrorCodes.AUTH_USER_EXISTS, 'An account with this email or username already exists', 409),

  // 500 Internal Server Error
  internal: (message = 'Something went wrong. Please try again later') =>
    new ApiError(ErrorCodes.INTERNAL_ERROR, message, 500),

  database: (operation = 'save') =>
    new ApiError(ErrorCodes.DATABASE_ERROR, `Unable to ${operation} your data. Please try again`, 500)
};

/**
 * Async handler wrapper to catch errors in route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    userId: req.user?.userId
  });

  if (err.isApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Handle unexpected errors
  res.status(500).json({
    error: 'Something went wrong. Please try again later',
    code: ErrorCodes.INTERNAL_ERROR
  });
};

/**
 * Validate that user exists, throw error if not
 */
export const validateUser = (user, userId) => {
  if (!user) {
    console.error(`User not found for userId: ${userId}`);
    throw createError.userNotFound();
  }
  return user;
};

/**
 * Validate required fields in request body
 */
export const validateRequiredFields = (body, fields) => {
  const missing = fields.filter(field => !body[field]);
  if (missing.length > 0) {
    throw createError.missingFields(missing);
  }
};

export default {
  ErrorCodes,
  ApiError,
  createError,
  asyncHandler,
  errorHandler,
  validateUser,
  validateRequiredFields
};
