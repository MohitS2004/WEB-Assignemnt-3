import { jwtDecode } from 'jwt-decode';

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

export const readToken = () => {
  try {
    const token = getToken();
    return token ? jwtDecode(token) : null;
  } catch (err) {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = readToken();
  return !!token && Date.now() <= token.exp * 1000;
};

export const authenticateUser = async (user, password) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ userName: user, password }),
    headers: { 'content-type': 'application/json' }
  });

  if (res.status === 200) {
    const data = await res.json();
    setToken(data.token);
    return true;
  }

  const errorMessage = await res.json().catch(() => ({}));
  throw new Error(errorMessage.message || 'Authentication failed');
};

export const registerUser = async (user, password, password2) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ userName: user, password, password2 }),
    headers: { 'content-type': 'application/json' }
  });

  if (res.status === 200) {
    return true;
  }

  const errorMessage = await res.json().catch(() => ({}));
  throw new Error(errorMessage.message || 'Registration failed');
};
