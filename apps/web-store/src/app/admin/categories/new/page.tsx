"use client";

import { useEffect, useState } from 'react';
import CategoryForm from '@/components/admin/CategoryForm';
import { getAdminCategories, createCategory } from '@/lib/admin';

export default function NewCategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCategories()
      .then(res => setCategories(res.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (data: any) => {
    await createCategory(data);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New Category</h1>
      </div>
      <CategoryForm categories={categories} onSubmit={handleSubmit} />
    </div>
  );
}
