const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
});

export const userService = {
  async getOrders(token) {
    const response = await fetch(`${API_URL}/api/auth/orders/`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async getAddresses(token) {
    const response = await fetch(`${API_URL}/api/auth/addresses/`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
  },

  async addAddress(token, addressData) {
    const response = await fetch(`${API_URL}/api/auth/addresses/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to add address');
    return response.json();
  },

  async updateAddress(token, id, addressData) {
    const response = await fetch(`${API_URL}/api/auth/addresses/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to update address');
    return response.json();
  },

  async deleteAddress(token, id) {
    const response = await fetch(`${API_URL}/api/auth/addresses/${id}/`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete address');
    return true;
  }
};
