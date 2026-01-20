"use client";

import { useEffect, useState } from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { getAdminCategories, getAdminCategory, updateCategory } from '@/lib/admin';
import { useParams } from 'next/navigation';

export default function EditCategoryPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminCategories(),
      getAdminCategory(id as string)
    ])
      .then(([catsRes, catRes]) => {
        setCategories(catsRes.categories || []);
        setCategory(catRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    await updateCategory(id as string, data);
  };

  if (loading) return <div>Loading...</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Category</h1>
      </div>
      <CategoryForm 
        categories={categories} 
        initialData={category} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}
