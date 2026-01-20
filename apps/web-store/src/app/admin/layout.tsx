"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login?redirect=/admin');
        return;
      }
      // TODO: Add actual role check here when RBAC is implemented
      setIsAuthorized(true);
    };

    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return null; // Or loading spinner
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
