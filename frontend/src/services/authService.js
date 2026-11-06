const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const authService = {
  async register(data) {
    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to register');
    }
    return response.json();
  },

  async login(data) {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to login');
    }
    return response.json();
  },

  async googleLogin(access_token) {
    const response = await fetch(`${API_URL}/api/auth/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to login with Google');
    }
    return response.json();
  },

  async getMe(token) {
    const response = await fetch(`${API_URL}/api/auth/me/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
};
