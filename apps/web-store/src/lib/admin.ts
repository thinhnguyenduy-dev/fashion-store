import { fetchApi } from './api';
import { Product } from './types';

// Products
export async function getAdminProducts(page = 1, limit = 10, search?: string) {
  const query = new URLSearchParams({ 
    page: page.toString(), 
    limit: limit.toString() 
  });
  if (search) query.append('search', search);

  return fetchApi<{ products: any[]; meta: any }>(`/admin/products?${query.toString()}`);
}

export async function getAdminProduct(id: string) {
  return fetchApi<any>(`/admin/products/${id}`);
}

export async function createProduct(data: any) {
  return fetchApi<any>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: any) {
  return fetchApi<any>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string) {
  return fetchApi<any>(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// Categories
export async function getAdminCategories() {
  return fetchApi<{ categories: any[] }>('/admin/categories');
}

export async function getAdminCategory(id: string) {
  return fetchApi<any>(`/admin/categories/${id}`);
}

export async function createCategory(data: any) {
  return fetchApi<any>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: any) {
  return fetchApi<any>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string) {
  return fetchApi<any>(`/admin/categories/${id}`, {
    method: 'DELETE',
  });
}
