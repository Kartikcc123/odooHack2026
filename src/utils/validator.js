import { z } from 'zod';
import { errorResponse } from '@/utils/response';
import { RESPONSE_CODES } from '@/constants/responseCodes';
import { MESSAGES } from '@/constants/messages';

/**
 * Validates data against a Zod schema.
 * If valid, returns the parsed data.
 * If invalid, throws a standardized validation error.
 */
export async function validateRequest(schema, data) {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      const validationError = new Error(MESSAGES.VALIDATION_ERROR);
      validationError.isValidationError = true;
      validationError.errors = formattedErrors;
      throw validationError;
    }
    throw error;
  }
}

/**
 * Utility to wrap Next.js Route Handlers with global error handling
 */
export function withErrorHandler(handler) {
  return async (request, ...args) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      console.error('API Error:', error);

      if (error.isValidationError) {
        return errorResponse(error.message, error.errors, RESPONSE_CODES.BAD_REQUEST);
      }

      if (error.isUnauthorized) {
        return errorResponse(error.message, [], RESPONSE_CODES.UNAUTHORIZED);
      }

      if (error.isForbidden) {
        return errorResponse(error.message, [], RESPONSE_CODES.FORBIDDEN);
      }
      
      if (error.isNotFound) {
        return errorResponse(error.message, [], RESPONSE_CODES.NOT_FOUND);
      }

      return errorResponse(
        MESSAGES.INTERNAL_ERROR || 'An unexpected error occurred',
        [{ message: error.message }],
        RESPONSE_CODES.INTERNAL_ERROR
      );
    }
  };
}
