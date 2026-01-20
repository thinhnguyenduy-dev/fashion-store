"use client";

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminCategories, createProduct } from '@/lib/admin';

export default function NewProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCategories()
      .then(res => setCategories(res.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (data: any) => {
    await createProduct(data);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New Product</h1>
      </div>
      <ProductForm categories={categories} onSubmit={handleSubmit} />
    </div>
  );
}
