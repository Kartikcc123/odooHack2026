import { getSession } from '@/utils/auth';
import { ROLE_PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

/**
 * Ensures the user is authenticated.
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session || !session.id) {
    const error = new Error(MESSAGES.UNAUTHORIZED);
    error.isUnauthorized = true;
    throw error;
  }
  
  return session;
}

/**
 * Ensures the user has the required permission.
 */
export async function requirePermission(permission) {
  const session = await requireAuth();
  
  const userRole = session.role;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  
  if (!permissions.includes(permission)) {
    const error = new Error(MESSAGES.FORBIDDEN);
    error.isForbidden = true;
    throw error;
  }
  
  return session;
}
