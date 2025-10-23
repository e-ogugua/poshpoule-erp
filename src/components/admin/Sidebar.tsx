import Link from 'next/link';
import { MenuItem } from '@/types/menu';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  menuItems: MenuItem[];
  onLogout?: () => void;
}

export function Sidebar({ menuItems, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm min-h-screen p-4 border-r border-neutral-200">
      <div className="p-4 mb-6">
        <h2 className="text-lg font-semibold text-neutral-800 font-heading">Admin Panel</h2>
        <p className="text-xs text-neutral-500 mt-1">Farm Management</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 touch-target group ${
              item.current
                ? 'bg-primary text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
            }`}
          >
            {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
            <span className="flex-1 font-medium">{item.name}</span>
            {item.badge && item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold min-w-[20px] text-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-4 border-t border-neutral-200">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 rounded-lg transition-all duration-200 touch-target w-full text-left group"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
