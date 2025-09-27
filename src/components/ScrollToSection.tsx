'use client';

import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export function ScrollToSection({ targetId, children }: { targetId: string; children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = () => {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  if (!isMounted) {
    return (
      <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-gray-100 text-base">
        {children}
      </Button>
    );
  }

  return (
    <Button 
      variant="outline"
      size="lg"
      className="bg-white text-primary hover:bg-gray-100 text-base"
      onClick={scrollToSection}
    >
      {children}
    </Button>
  );
}
