'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

type Currency = 'NGN' | 'USD' | 'GBP';

// Static exchange rates (NGN is the base currency)
const STATIC_RATES = {
  NGN: 1,
  USD: 0.00065,  // 1 NGN = 0.00065 USD
  GBP: 0.00050,  // 1 NGN = 0.00050 GBP
} as const;

const CURRENCY_FORMATS = {
  NGN: { symbol: '₦', locale: 'en-NG' },
  USD: { symbol: '$', locale: 'en-US' },
  GBP: { symbol: '£', locale: 'en-GB' },
} as const;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (priceNaira: number) => number;
  convertPrice: (priceNaira: number) => number;
  formatPrice: (priceNaira: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Check if we're on the client side
const isBrowser = typeof window !== 'undefined';

// Default currency
const DEFAULT_CURRENCY = 'NGN';

interface CurrencyProviderProps {
  children: React.ReactNode;
  session?: any; // Make session optional
}

export function CurrencyProvider({ children, session }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [isMounted, setIsMounted] = useState(false);
  const [version, setVersion] = useState(0);

  // Load saved currency preference from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    
    if (isBrowser) {
      try {
        const savedCurrency = localStorage.getItem('poshpoule-currency') as Currency;
        if (savedCurrency && STATIC_RATES[savedCurrency as keyof typeof STATIC_RATES]) {
          setCurrencyState(savedCurrency);
        }
      } catch (error) {
        console.error('Failed to load currency preference:', error);
      }
    }
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    if (newCurrency !== currency) {
      setCurrencyState(newCurrency);
      setVersion(v => v + 1); // Force update all consumers
      
      if (isBrowser) {
        try {
          localStorage.setItem('poshpoule-currency', newCurrency);
          // Dispatch custom event for instant updates across components
          window.dispatchEvent(new CustomEvent('currencyChanged', {
            detail: { currency: newCurrency }
          }));
        } catch (error) {
          console.error('Failed to save currency preference:', error);
        }
      }
    }
  }, [currency]);

  // Memoize all derived values with proper dependencies
  const convertPrice = useCallback((priceNaira: number): number => {
    const rate = STATIC_RATES[currency] || 1;
    return priceNaira * rate;
  }, [currency]);

  const formatPrice = useCallback((priceNaira: number): string => {
    const converted = convertPrice(priceNaira);
    const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.NGN;
    const { symbol, locale } = format;
    
    if (currency === 'NGN') {
      return `${symbol}${Math.round(converted).toLocaleString(locale)}`;
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }, [currency, convertPrice]);

  const getCurrencySymbol = useCallback((): string => {
    return (CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.NGN).symbol;
  }, [currency]);

  // Create a stable context value
  const contextValue = useMemo(() => ({
    currency,
    setCurrency,
    convert: convertPrice,
    convertPrice,
    formatPrice,
    getCurrencySymbol,
    _version: version, // Include version to force updates
  }), [currency, setCurrency, convertPrice, formatPrice, getCurrencySymbol, version]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
