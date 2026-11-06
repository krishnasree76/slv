const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const productService = {
  async getProducts(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`${API_URL}/api/products/${query}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProductById(id) {
    const response = await fetch(`${API_URL}/api/products/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/api/products/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getHeroImages() {
    const response = await fetch(`${API_URL}/api/products/hero/`);
    if (!response.ok) throw new Error('Failed to fetch hero images');
    return response.json();
  },

  async getProductsByTag(tagName) {
    const response = await fetch(`${API_URL}/api/products/tag/${encodeURIComponent(tagName)}/`);
    if (!response.ok) throw new Error(`Failed to fetch products for tag: ${tagName}`);
    return response.json();
  },

  async getProductsByCategory(categoryId) {
    const products = await this.getProducts();
    return products.filter(p => p.category === parseInt(categoryId));
  }
};
