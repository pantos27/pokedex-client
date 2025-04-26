import { getCookie } from '../utils/cookieUtils';

/**
 * Creates headers for API requests, including the user ID if available
 */
export const createApiHeaders = (): HeadersInit => {
  const userId = getCookie('user_id');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (userId) {
    headers['X-User-ID'] = userId;
  }

  return headers;
};
