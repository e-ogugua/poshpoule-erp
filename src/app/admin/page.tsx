'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Dynamic imports for admin components - loads only when admin routes are accessed
// This ensures admin-specific code doesn't bloat the main bundle
const Sidebar = dynamic(() => import('@/components/admin/Sidebar').then(mod => ({ default: mod.Sidebar })), {
  ssr: false,
  loading: () => <div className="w-64 bg-gray-800 animate-pulse h-screen" />
});

const AdminLoading = dynamic(() => import('@/components/admin/AdminLoading').then(mod => ({ default: mod.AdminLoading })), {
  ssr: false
});

// Icons
import {
  Package as PackageIcon,
  ShoppingCart as ShoppingCartIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
  Settings as SettingsIcon,
  BarChart3 as BarChart3Icon,
  AlertCircle,
} from 'lucide-react';

import { MenuItem } from '@/types/menu';

interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3Icon,
      current: true,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCartIcon,
      badge: 0,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: PackageIcon,
    },
    {
      name: 'Schedule',
      href: '/admin/schedule',
      icon: CalendarIcon,
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileTextIcon,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: SettingsIcon,
    }
  ];

  if (isLoading) {
    return <AdminLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-500 text-2xl mb-4 flex justify-center">
            <AlertCircle className="h-8 w-8 mr-2" />
            Error
          </div>
          <p className="text-gray-700 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex flex-col lg:flex-row">
        <Suspense fallback={<div className="w-full lg:w-64 bg-white shadow-sm min-h-screen lg:h-screen"></div>}>
          <Sidebar menuItems={menuItems} onLogout={handleLogout} />
        </Suspense>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 lg:mb-8">
              <h1 className="font-heading text-2xl sm:text-3xl font-heading-bold text-neutral-800">
                Dashboard
              </h1>
              <p className="text-neutral-600 mt-2 text-sm sm:text-base">
                Welcome to your farm management dashboard
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-xs sm:text-sm font-medium">Total Orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-neutral-800">{stats.totalOrders}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-xs sm:text-sm font-medium">Pending Orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <PackageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-xs sm:text-sm font-medium">Total Products</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalProducts}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <PackageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-xs sm:text-sm font-medium">Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">₦{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart3Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <div className="card p-4 sm:p-6">
                <h2 className="font-heading text-lg sm:text-xl font-heading-semibold mb-4">
                  Recent Orders
                </h2>
                <div className="space-y-4">
                  <div className="text-center py-8 text-neutral-500">
                    <ShoppingCartIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">No recent orders to display</p>
                    <Link href="/admin/orders" className="btn-primary mt-4 text-sm">
                      View All Orders
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card p-4 sm:p-6">
                <h2 className="font-heading text-lg sm:text-xl font-heading-semibold mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/admin/orders"
                    className="block p-3 sm:p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors touch-target group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Manage Orders</span>
                      <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                  <Link
                    href="/admin/products"
                    className="block p-3 sm:p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors touch-target group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Update Products</span>
                      <PackageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="block p-3 sm:p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors touch-target group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Site Settings</span>
                      <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
