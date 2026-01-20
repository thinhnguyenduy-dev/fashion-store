"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className={isActive('/admin/products') ? 'active' : ''}>
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className={isActive('/admin/categories') ? 'active' : ''}>
              Categories
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => logout()} className="logout-btn">
          Logout
        </button>
      </div>
    </aside>
  );
}
