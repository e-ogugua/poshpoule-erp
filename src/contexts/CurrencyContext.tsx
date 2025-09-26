'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'NGN' | 'USD' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<string, number>;
  formatPrice: (priceNaira: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('NGN');
  const [rates, setRates] = useState<Record<string, number>>({ NGN: 1, USD: 0.0012, GBP: 0.00095 });

  useEffect(() => {
    // Load currency from localStorage
    const savedCurrency = localStorage.getItem('poshpoule-currency') as Currency;
    if (savedCurrency && ['NGN', 'USD', 'GBP'].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }

    // Load rates from localStorage (client-side fallback)
    const savedRates = localStorage.getItem('poshpoule-rates');
    if (savedRates) {
      try {
        setRates(JSON.parse(savedRates));
      } catch (error) {
        console.error('Failed to load currency rates from localStorage:', error);
      }
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('poshpoule-currency', newCurrency);
  };

  const formatPrice = (priceNaira: number): string => {
    const rate = rates[currency] || 1;
    const convertedPrice = priceNaira * rate;

    switch (currency) {
      case 'NGN':
        return `₦${convertedPrice.toLocaleString()}`;
      case 'USD':
        return `$${convertedPrice.toFixed(2)}`;
      case 'GBP':
        return `£${convertedPrice.toFixed(2)}`;
      default:
        return `₦${priceNaira.toLocaleString()}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
