'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  src: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  interval?: number;
}

export function HeroCarousel({ slides, interval = 6000 }: HeroCarouselProps) {
  const safeSlides = useMemo(() => (slides.length ? slides : []), [slides]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) {
      return;
    }

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeSlides.length);
    }, interval);

    return () => clearInterval(id);
  }, [safeSlides.length, interval]);

  if (!safeSlides.length) {
    return null;
  }

  const goToSlide = (index: number) => {
    const normalizedIndex = (index + safeSlides.length) % safeSlides.length;
    setCurrentIndex(normalizedIndex);
  };

  return (
    <section className="relative w-full overflow-hidden bg-neutral-900">
      <div className="relative h-[360px] sm:h-[480px] lg:h-[600px]">
        {safeSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt || 'Hero carousel image'}
              fill
              quality={95}
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          </div>
        ))}

        <div className="absolute inset-0 z-10 flex flex-col">
          <div className="flex-1" />
          <div className="flex flex-col items-center gap-4 pb-12 sm:pb-16">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/preorder" className="btn-secondary">
                Pre-Order Now
              </Link>
              <Link href="/products" className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
                Shop Products
              </Link>
            </div>
            {safeSlides.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goToSlide(currentIndex - 1)}
                  aria-label="Previous slide"
                  className="p-2 rounded-full bg-white/70 text-neutral-800 hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  {safeSlides.map((slide, index) => (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goToSlide(currentIndex + 1)}
                  aria-label="Next slide"
                  className="p-2 rounded-full bg-white/70 text-neutral-800 hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
