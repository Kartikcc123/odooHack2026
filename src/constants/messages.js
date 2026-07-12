export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Successfully logged in.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  
  // Validation
  VALIDATION_ERROR: 'Validation failed.',
  
  // Entity Gen
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  NOT_FOUND: 'Resource not found.',
  
  // Business logic
  ASSET_ALREADY_ALLOCATED: 'This asset is currently allocated and cannot be allocated again without a transfer.',
  BOOKING_OVERLAP: 'The requested time slot overlaps with an existing booking.',
  EXPECTED_RETURN_INVALID: 'Expected return date must be in the future.'
};
