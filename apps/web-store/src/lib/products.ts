import { fetchApi } from './api';
import { ProductListResponse } from './types';

export async function getProducts(page = 1, limit = 10): Promise<ProductListResponse> {
    return fetchApi<ProductListResponse>(`/products?page=${page}&limit=${limit}`);
}

export async function getProduct(id: string): Promise<any> {
    return fetchApi(`/products/${id}`);
}
