import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { readDatabase } from '@/lib/database-server';
import Link from 'next/link';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import Image from 'next/image';

export default function GalleryPage() {
  const data = readDatabase();
  const galleryImages = data.galleryImages;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-green-600 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/VegetableHavest.jpg"
              alt="PoshPOULE Farm Gallery"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto px-4 text-center py-16">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Our Farm Gallery
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Take a visual journey through our sustainable farm and see the care and dedication that goes into every product.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image) => (
                <div key={image.id} className="group">
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <div className="relative w-full h-64">
                      <Image
                        src={image.image}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                        <button className="bg-white text-neutral-800 p-3 rounded-full hover:bg-neutral-100 transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="bg-white text-neutral-800 p-3 rounded-full hover:bg-neutral-100 transition-colors">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-heading text-lg font-heading-semibold mb-2">
                      {image.title}
                    </h3>
                    <p className="text-neutral-600 capitalize">
                      {image.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="btn-outline px-8 py-3">
                Load More Images
              </button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-neutral-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-heading-bold mb-6">
              Experience Our Farm
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Want to see our farm in person? Schedule a visit and experience the freshness and quality that makes our products special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Schedule a Visit
              </Link>
              <Link href="/products" className="btn-outline">
                Shop Our Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
