"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryForm({ initialData = {}, categories = [], onSubmit }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    slug: initialData.slug || '',
    description: initialData.description || '',
    imageUrl: initialData.image_url || '',
    parentId: initialData.parent_id || '',
    isActive: initialData.is_active ?? true,
    sortOrder: initialData.sort_order || 0,
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder),
        // Handle empty parentId
        parentId: formData.parentId || undefined
      };
      
      await onSubmit(payload);
      router.push('/admin/categories');
    } catch (error) {
      console.error(error);
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  // Filter out self from parent options (if editing)
  const parentOptions = categories.filter((c: any) => c.id !== initialData.id);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label">Category Name</label>
        <input name="name" className="form-input" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Slug</label>
        <input name="slug" className="form-input" value={formData.slug} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" className="form-textarea" value={formData.description} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input name="imageUrl" className="form-input" value={formData.imageUrl} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="form-label">Parent Category</label>
        <select name="parentId" className="form-select" value={formData.parentId} onChange={handleChange}>
          <option value="">None (Top Level)</option>
          {parentOptions.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Sort Order</label>
        <input type="number" name="sortOrder" className="form-input" value={formData.sortOrder} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
          Active
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  );
}
