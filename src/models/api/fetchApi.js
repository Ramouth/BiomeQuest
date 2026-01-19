/**
 * Base API configuration and fetch helper
 * Model Layer - handles HTTP communication
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Error codes from the server
 */
export const ErrorCodes = {
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_EXISTS: 'AUTH_USER_EXISTS',
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_INPUT: 'VALIDATION_INVALID_INPUT',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  PLANT_NOT_FOUND: 'PLANT_NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

/**
 * Custom API Error class for client-side error handling
 */
export class ApiError extends Error {
  constructor(message, code, statusCode, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code || ErrorCodes.INTERNAL_ERROR;
    this.statusCode = statusCode;
    this.details = details;
    this.isApiError = true;
  }

  /**
   * Check if error requires re-authentication
   */
  get requiresAuth() {
    return this.code === ErrorCodes.AUTH_TOKEN_INVALID ||
           this.code === ErrorCodes.AUTH_TOKEN_MISSING ||
           this.code === ErrorCodes.AUTH_USER_NOT_FOUND ||
           this.statusCode === 401 ||
           this.statusCode === 403;
  }

  /**
   * Check if error is a validation error
   */
  get isValidationError() {
    return this.code === ErrorCodes.VALIDATION_REQUIRED_FIELD ||
           this.code === ErrorCodes.VALIDATION_INVALID_INPUT ||
           this.statusCode === 400;
  }

  /**
   * Check if error is a not found error
   */
  get isNotFound() {
    return this.statusCode === 404;
  }

  /**
   * Get user-friendly error message
   */
  get userMessage() {
    // Map error codes to user-friendly messages
    const messages = {
      [ErrorCodes.AUTH_TOKEN_MISSING]: 'Please log in to continue',
      [ErrorCodes.AUTH_TOKEN_INVALID]: 'Your session has expired. Please log in again',
      [ErrorCodes.AUTH_USER_NOT_FOUND]: 'Account not found. Please register or check your login details',
      [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
      [ErrorCodes.AUTH_USER_EXISTS]: 'An account with this email or username already exists',
      [ErrorCodes.VALIDATION_REQUIRED_FIELD]: 'Please fill in all required fields',
      [ErrorCodes.VALIDATION_INVALID_INPUT]: 'Please check your input and try again',
      [ErrorCodes.PLANT_NOT_FOUND]: 'This plant is no longer available',
      [ErrorCodes.RESOURCE_NOT_FOUND]: 'The requested item could not be found',
      [ErrorCodes.DATABASE_ERROR]: 'Unable to save your data. Please try again',
      [ErrorCodes.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection',
      [ErrorCodes.INTERNAL_ERROR]: 'Something went wrong. Please try again later'
    };

    return messages[this.code] || this.message || 'Something went wrong. Please try again';
  }
}

/**
 * Helper function for API calls with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    // Network error (no connection, DNS failure, etc.)
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection',
      ErrorCodes.NETWORK_ERROR,
      0
    );
  }

  // Try to parse JSON response
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    // Response wasn't valid JSON
    if (!response.ok) {
      throw new ApiError(
        'Server returned an invalid response',
        ErrorCodes.INTERNAL_ERROR,
        response.status
      );
    }
    // If response was OK but not JSON, return empty object
    data = {};
  }

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Something went wrong',
      data.code || ErrorCodes.INTERNAL_ERROR,
      response.status,
      data.details
    );
  }

  return data;
}

export { API_URL };
