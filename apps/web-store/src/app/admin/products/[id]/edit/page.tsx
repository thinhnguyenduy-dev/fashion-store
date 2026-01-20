"use client";

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminCategories, getAdminProduct, updateProduct } from '@/lib/admin';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminCategories(),
      getAdminProduct(id as string)
    ])
      .then(([catsRes, prodRes]) => {
        setCategories(catsRes.categories || []);
        setProduct(prodRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updateProduct(id as string, data);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Product</h1>
      </div>
      <ProductForm 
        categories={categories} 
        initialData={product} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}
