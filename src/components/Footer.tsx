import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Static footer data for client-side rendering
  const settings = {
    siteName: "PoshPOULE Farms Ltd",
    slogan: "Pure Goodness — eat fresh, eat healthy",
    contactEmail: "poshpoulefarms@gmail.com",
    contactPhone: "+234 812 239 4397 | 08064508595",
    address: "Farm Location, Enugu State, Nigeria"
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/about' },
      { name: 'Sustainability', href: '/about' },
      { name: 'Careers', href: '/careers' },
    ],
    products: [
      { name: 'Fresh Eggs', href: '/products/fresh-organic-eggs' },
      { name: 'Broiler Chicken', href: '/products/broiler-chicken' },
      { name: 'Vegetables', href: '/products?category=vegetables' },
      { name: 'Fruits', href: '/products?category=fruits' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  };

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start space-x-6">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-white shadow-xl shadow-primary/20 ring-2 ring-white/80 flex-shrink-0">
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
                    sizes="(max-width: 768px) 112px, 144px"
                    quality={100}
                  />
                </div>
              </div>
              <div className="pt-1">
                <h2 className="font-heading font-bold text-xl md:text-2xl mb-2">{settings.siteName}</h2>
                <p className="text-neutral-300 text-sm mb-4">{settings.slogan}</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{settings.contactEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{settings.contactPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{settings.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
          <p className="text-neutral-400">
            © {currentYear} PoshPOULE Farms Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
