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
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: any[];
  totalAmount: number;
  currency: string;
  status: string;
  orderType: string;
  scheduledDate: string;
  createdAt: string;
}

export default function AdminOrders() {
  const data = readDatabase();
  const orders = data.orders;

  const formatPrice = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'ready': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

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
              <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/admin/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary text-white transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span>Orders</span>
              </Link>
              <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link href="/admin/customers" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </Link>
              <Link href="/admin/schedule" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Calendar className="h-5 w-5" />
                <span>Schedule</span>
              </Link>
              <Link href="/admin/blog" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <FileText className="h-5 w-5" />
                <span>Blog</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>

            <div className="mt-8 pt-4 border-t">
              <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-heading-bold text-neutral-800">
                Orders Management
              </h1>
              <p className="text-neutral-600 mt-2">
                Manage customer orders and update their status
              </p>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {orders.map((order: Order) => (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            #{order.id}
                          </div>
                          <div className="text-sm text-neutral-500 capitalize">
                            {order.orderType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {order.customerEmail}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {order.customerPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-900">
                            {order.products.length} item(s)
                          </div>
                          <div className="text-xs text-neutral-500">
                            {order.products.map(p => p.name).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {formatPrice(order.totalAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-neutral-400 hover:text-neutral-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <select className="text-xs border border-neutral-300 rounded px-2 py-1">
                              <option value="new">New</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="ready">Ready</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-500">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
