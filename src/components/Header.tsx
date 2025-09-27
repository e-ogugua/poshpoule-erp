'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { CurrencySwitcher } from './CurrencySwitcher';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Pre-Order', href: '/preorder' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const desktopNavClasses = (href: string) => {
    const active = isActive(href);
    return [
      'group relative px-3 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200',
      'after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5 after:w-8 after:rounded-full after:bg-primary after:transition-all after:duration-200',
      active
        ? 'text-primary bg-primary/10 shadow-sm after:opacity-100 after:w-full'
        : 'text-neutral-600 hover:text-primary hover:bg-primary/5 after:opacity-0 group-hover:after:opacity-100 group-hover:after:w-full',
    ].join(' ');
  };

  const mobileNavClasses = (href: string) => {
    const active = isActive(href);
    return [
      'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-neutral-700 hover:bg-primary/10 hover:text-primary',
    ].join(' ');
  };

  return (
    <CurrencyProvider>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 md:py-5">
            {/* Logo */}
            <Link href="/">
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-[32px] overflow-hidden bg-white shadow-xl shadow-primary/20 ring-2 ring-primary/10 transition-transform duration-200 hover:-translate-y-1">
                <div className="relative w-full h-full">
                  <Image
                    src="/optimized-images/logo.webp"
                    alt="PoshPOULE Farms Logo"
                    fill
                    className="object-contain p-2"
                    style={{
                      filter: 'contrast(1.15) drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                      imageRendering: '-webkit-optimize-contrast',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'subpixel-antialiased',
                    }}
                    priority
                    sizes="(max-width: 768px) 128px, 144px"
                    quality={100}
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3 xl:gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={desktopNavClasses(item.href)}
                >
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden md:flex items-center gap-3 pl-5 border-l border-neutral-200/70">
                <CurrencySwitcher />
              </div>

              <Link
                href="/preorder"
                className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white px-5 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Order Now</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden inline-flex items-center justify-center rounded-full border border-primary/20 p-2 text-primary hover:bg-primary/5 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                type="button"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-primary/10">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                    
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={mobileNavClasses(item.href)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </CurrencyProvider>
  );
}
