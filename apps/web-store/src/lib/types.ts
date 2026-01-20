export interface Product {
    id: string;
    name: string;
    description: string;
    base_price: number;
    basePrice?: number;
    image_urls: string[];
    category_id: string;
}

export interface ProductListResponse {
    products: Product[];
    meta: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    }
}
