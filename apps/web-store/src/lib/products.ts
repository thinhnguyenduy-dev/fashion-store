import { fetchApi } from './api';
import { ProductListResponse } from './types';

export async function getProducts(page = 1, limit = 10, tags?: string[]): Promise<ProductListResponse> {
    let query = `/products?page=${page}&limit=${limit}`;
    if (tags && tags.length > 0) {
        tags.forEach(tag => query += `&tags=${encodeURIComponent(tag)}`);
    }
    return fetchApi<ProductListResponse>(query);
}

export async function getProduct(id: string): Promise<any> {
    return fetchApi(`/products/${id}`);
}
