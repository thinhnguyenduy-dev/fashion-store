"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm({ initialData = {}, categories = [], onSubmit }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    slug: initialData.slug || '',
    description: initialData.description || '',
    basePrice: initialData.base_price || 0,
    categoryId: initialData.category_id || '',
    isActive: initialData.is_active ?? true,
    variants: initialData.variants || [],
    imageUrls: initialData.image_urls || [], // Array of strings
  });

  const [newVariant, setNewVariant] = useState({
    sku: '',
    size: '',
    color: '',
    stockQuantity: 0,
    priceModifier: 0,
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVariantAdd = () => {
    if (!newVariant.sku || !newVariant.size) return;
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant }]
    }));
    setNewVariant({ sku: '', size: '', color: '', stockQuantity: 0, priceModifier: 0 });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = e.currentTarget.value;
      if (val) {
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, val]
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Map form data to API expected format
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        // variants need mapping if keys differ, DTO expects camelCase which matches
        variants: formData.variants.map((v: any) => ({
          ...v,
          stockQuantity: Number(v.stockQuantity),
          priceModifier: Number(v.priceModifier)
        })),
        images: formData.imageUrls.map((url: string, idx: number) => ({
           url,
           sortOrder: idx,
           isPrimary: idx === 0
        }))
      };
      
      await onSubmit(payload);
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label">Product Name</label>
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
        <label className="form-label">Base Price</label>
        <input type="number" name="basePrice" className="form-input" value={formData.basePrice} onChange={handleChange} required min="0" step="0.01" />
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select name="categoryId" className="form-select" value={formData.categoryId} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Images (Press Enter to add URL)</label>
        <input className="form-input" placeholder="https://example.com/image.jpg" onKeyDown={handleImageAdd} />
        <div style={{ marginTop: '10px' }}>
          {formData.imageUrls.map((url: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
              <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
              <span style={{ fontSize: '0.9em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{url}</span>
              <button type="button" onClick={() => setFormData(prev => ({...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i)}))} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
          Active
        </label>
      </div>

      {/* Variants Section */}
      <div className="variants-section">
        <h3>Variants</h3>
        <div className="variant-grid" style={{ marginBottom: '16px', alignItems: 'end' }}>
           <div>
             <label className="form-label" style={{fontSize: '0.8rem'}}>SKU</label>
             <input className="form-input" placeholder="SKU" value={newVariant.sku} onChange={e => setNewVariant({...newVariant, sku: e.target.value})} />
           </div>
           <div>
             <label className="form-label" style={{fontSize: '0.8rem'}}>Size</label>
             <input className="form-input" placeholder="Size" value={newVariant.size} onChange={e => setNewVariant({...newVariant, size: e.target.value})} />
           </div>
           <div>
             <label className="form-label" style={{fontSize: '0.8rem'}}>Color</label>
             <input className="form-input" placeholder="Color" value={newVariant.color} onChange={e => setNewVariant({...newVariant, color: e.target.value})} />
           </div>
           <div>
             <label className="form-label" style={{fontSize: '0.8rem'}}>Stock</label>
             <input type="number" className="form-input" placeholder="Stock" value={newVariant.stockQuantity} onChange={e => setNewVariant({...newVariant, stockQuantity: parseInt(e.target.value) || 0})} />
           </div>
           <button type="button" onClick={handleVariantAdd} className="btn-secondary" style={{ height: '42px' }}>Add</button>
        </div>

        {formData.variants.map((v: any, i: number) => (
          <div key={i} className="variant-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span>{v.sku} - {v.size} / {v.color} (Stock: {v.stockQuantity})</span>
             <button type="button" onClick={() => handleRemoveVariant(i)} className="delete-btn action-btn">Remove</button>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
