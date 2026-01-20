"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminProducts, deleteProduct } from '@/lib/admin';
import DataTable from '@/components/admin/DataTable';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { products } = await getAdminProducts(1, 100); // Fetch mostly all for now
      setProducts(products || []);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadProducts(); // Reload
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category_id', label: 'Category' }, // Could map to name if we fetch categories too
    { key: 'base_price', label: 'Price', render: (row: any) => `$${row.base_price}` },
    { key: 'is_active', label: 'Status', render: (row: any) => row.is_active ? 'Active' : 'Inactive' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div>
          <Link href={`/admin/products/${row.id}/edit`} className="action-btn edit-btn">
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
        <h1 className="page-title">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add New Product
        </Link>
      </div>

      <DataTable columns={columns} data={products} />
    </div>
  );
}
