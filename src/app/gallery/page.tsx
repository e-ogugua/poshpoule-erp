'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Download, Filter, X } from 'lucide-react';
import Image from 'next/image';

const ITEMS_PER_PAGE = 9;

interface GalleryImage {
  id: string;
  title: string;
  image: string;
  category: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleImages, setVisibleImages] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const filtered = selectedCategory === 'All'
      ? images
      : images.filter(img => img.category === selectedCategory);
    setFilteredImages(filtered);
    setVisibleImages(ITEMS_PER_PAGE);
  }, [images, selectedCategory]);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/gallery');

      if (!response.ok) {
        throw new Error('Failed to load gallery images');
      }

      const data = await response.json() as { images?: GalleryImage[] };
      setImages(data.images || []);
      setCategories(['All', ...new Set(data.images?.map((img: GalleryImage) => img.category) || [])]);
    } catch (err) {
      console.error('Error loading gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleImages(prev => Math.min(prev + ITEMS_PER_PAGE, filteredImages.length));
  };

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };

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
              priority
            />
          </div>
          <div className="relative container mx-auto container-spacing text-center section-spacing">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-heading-bold mb-4 sm:mb-6">
              Our Farm Gallery
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Take a visual journey through our sustainable farm and see the care and dedication that goes into every product.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="section-spacing bg-neutral-50">
          <div className="container mx-auto container-spacing">
            {/* Category Filter */}
            <div className="mb-6 sm:mb-8">
              {/* Mobile Filter Toggle */}
              <div className="md:hidden mb-4">
                <button
                  onClick={toggleFilter}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-50 transition-colors touch-target"
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter by Category</span>
                </button>
              </div>

              {/* Desktop Filter */}
              <div className="hidden md:flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target-sm ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Mobile Filter Panel */}
              {isFilterOpen && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4">
                  <div className="bg-white rounded-lg w-full max-w-xs shadow-xl max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                      <h3 className="font-semibold text-neutral-800">Filter by Category</h3>
                      <button onClick={toggleFilter} className="text-neutral-500 hover:text-neutral-700 touch-target-sm">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto p-4 content-spacing">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors touch-target ${
                            selectedCategory === category
                              ? 'bg-primary text-white'
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-2 text-neutral-600">Loading gallery...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-red-600">
                <p className="text-sm sm:text-base">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 btn-primary text-sm"
                >
                  Retry
                </button>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-600 text-sm sm:text-base">No images found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {filteredImages.slice(0, visibleImages).map((image) => (
                <div key={image.id} className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={image.image}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={80}
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {image.category}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-medium text-base sm:text-lg mb-1">{image.title}</h3>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <a
                            href={image.image}
                            download
                            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors touch-target-sm"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Download ${image.title}`}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {visibleImages < filteredImages.length && (
              <div className="text-center mt-8 sm:mt-12">
                <button
                  onClick={loadMore}
                  className="btn-primary"
                >
                  Load More Images
                  <span className="text-sm opacity-70 ml-2">({filteredImages.length - visibleImages} remaining)</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-neutral-50 section-spacing">
          <div className="container mx-auto container-spacing text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-heading-bold mb-4 sm:mb-6">
              Experience Our Farm
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Want to see our farm in person? Schedule a visit and experience the freshness and quality that makes our products special.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
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
