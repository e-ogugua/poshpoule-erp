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
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-5 mb-6">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white shadow-xl shadow-primary/20 ring-4 ring-white/80 flex items-center justify-center p-2">
                <div className="relative w-full h-full">
                  <Image
                    src="/optimized-images/logo.webp"
                    alt="PoshPOULE Farms Logo"
                    fill
                    className="object-contain drop-shadow-md"
                    style={{
                      filter: 'contrast(1.1) drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
                    }}
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
              </div>
              <span className="font-heading font-bold text-3xl md:text-4xl tracking-wide text-center md:text-left">{settings.siteName}</span>
            </div>
            <p className="text-neutral-300 mb-6 text-lg">
              {settings.slogan}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-neutral-300">
                <Mail className="h-4 w-4" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <Phone className="h-4 w-4" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <MapPin className="h-4 w-4" />
                <span>{settings.address}</span>
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
