import Link from 'next/link';
import { MenuItem } from '@/types/menu';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  menuItems: MenuItem[];
  onLogout?: () => void;
}

export function Sidebar({ menuItems, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm min-h-screen p-4">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-neutral-800">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2 mt-6">
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
            {item.icon && <item.icon className="h-5 w-5" />}
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
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
