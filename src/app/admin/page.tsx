import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { readDatabase } from '@/lib/database-server';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  BarChart3
} from 'lucide-react';

interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const data = readDatabase();
  const totalOrders = data.orders.length;
  const pendingOrders = data.orders.filter(order => order.status === 'new' || order.status === 'confirmed').length;
  const totalProducts = data.products.length;
  const totalRevenue = data.orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const stats: AdminStats = {
    totalOrders,
    pendingOrders,
    totalProducts,
    totalRevenue,
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      current: true,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      badge: stats.pendingOrders,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      name: 'Schedule',
      href: '/admin/schedule',
      icon: Calendar,
    },
    {
      name: 'Blog',
      href: '/admin/blog',
      icon: FileText,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">PP</span>
              </div>
              <span className="font-heading font-semibold text-lg">Admin Panel</span>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    item.current
                      ? 'bg-primary text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-heading-bold text-neutral-800">
                Dashboard
              </h1>
              <p className="text-neutral-600 mt-2">
                Welcome to your farm management dashboard
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-neutral-800">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm">Pending Orders</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-primary">₦{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card p-6">
                <h2 className="font-heading text-xl font-heading-semibold mb-4">
                  Recent Orders
                </h2>
                <div className="space-y-4">
                  <div className="text-center py-8 text-neutral-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent orders to display</p>
                    <Link href="/admin/orders" className="btn-primary mt-4">
                      View All Orders
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-heading text-xl font-heading-semibold mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/admin/orders"
                    className="block p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>Manage Orders</span>
                      <ShoppingCart className="h-5 w-5 text-neutral-400" />
                    </div>
                  </Link>
                  <Link
                    href="/admin/products"
                    className="block p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>Update Products</span>
                      <Package className="h-5 w-5 text-neutral-400" />
                    </div>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="block p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>Site Settings</span>
                      <Settings className="h-5 w-5 text-neutral-400" />
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
