/**
 * Sets a cookie with the given name and value
 * @param name The name of the cookie
 * @param value The value to store in the cookie
 * @param days The number of days until the cookie expires (default: 365)
 */
export const setCookie = (name: string, value: string, days: number = 365): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;Secure`;
};

/**
 * Gets the value of a cookie by name
 * @param name The name of the cookie
 * @returns The value of the cookie, or null if not found
 */
export const getCookie = (name: string): string | null => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

/**
 * Removes a cookie by name
 * @param name The name of the cookie to remove
 */
export const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict;Secure`;
};
