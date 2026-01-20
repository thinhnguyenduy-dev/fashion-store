"use client";

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <div className="page-header">
         <h1 className="page-title">Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
         <Link href="/admin/products" style={{ textDecoration: 'none' }}>
           <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
             <h3 style={{ margin: '0 0 8px 0', color: '#64748b' }}>Products</h3>
             <p style={{ margin: 0, fontWeight: 500, color: '#3b82f6' }}>Manage Products &rarr;</p>
           </div>
         </Link>

         <Link href="/admin/categories" style={{ textDecoration: 'none' }}>
           <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
             <h3 style={{ margin: '0 0 8px 0', color: '#64748b' }}>Categories</h3>
             <p style={{ margin: 0, fontWeight: 500, color: '#3b82f6' }}>Manage Categories &rarr;</p>
           </div>
         </Link>
      </div>
    </div>
  );
}
