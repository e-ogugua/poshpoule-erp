'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { CurrencySwitcher } from './CurrencySwitcher';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Pre-Order', href: '/preorder' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <CurrencyProvider>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="PoshPOULE Farms Logo"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-600 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <CurrencySwitcher />

              <Link
                href="/preorder"
                className="bg-primary hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Order Now</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-primary"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <div key={item.name} onClick={() => setIsMenuOpen(false)}>
                    <Link
                      href={item.href}
                      className="text-neutral-600 hover:text-primary transition-colors font-medium py-2 block"
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </CurrencyProvider>
  );
}
