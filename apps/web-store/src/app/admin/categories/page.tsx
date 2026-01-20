"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminCategories, deleteCategory } from '@/lib/admin';
import DataTable from '@/components/admin/DataTable';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { categories } = await getAdminCategories();
      setCategories(categories || []);
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'parent_id', label: 'Parent ID' }, // Ideally map to name
    { key: 'is_active', label: 'Status', render: (row: any) => row.is_active ? 'Active' : 'Inactive' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div>
          <Link href={`/admin/categories/${row.id}/edit`} className="action-btn edit-btn">
            Edit
          </Link>
          <button onClick={() => handleDelete(row.id)} className="action-btn delete-btn">
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <Link href="/admin/categories/new" className="btn-primary">
          Add New Category
        </Link>
      </div>

      <DataTable columns={columns} data={categories} />
    </div>
  );
}
