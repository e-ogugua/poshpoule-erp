'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { debugLogger } from '@/utils/debug';

type Currency = 'NGN' | 'USD' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<string, number>;
  formatPrice: (priceNaira: number) => string;
  isLoading: boolean;
  error: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('NGN');
  const [rates, setRates] = useState<Record<string, number>>({ 
    NGN: 1, 
    USD: 0.0013, 
    GBP: 0.00105 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debugLogger.info('CurrencyProvider initializing');
    
    try {
      // Load currency from localStorage
      const savedCurrency = localStorage.getItem('poshpoule-currency') as Currency;
      if (savedCurrency && ['NGN', 'USD', 'GBP'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
        debugLogger.info('Loaded saved currency preference', { currency: savedCurrency });
      }

      // Load rates from database (this would need to be fetched from API in real app)
      const defaultRates = { 
        NGN: 1, 
        USD: 0.0013, 
        GBP: 0.00105 
      };
      setRates(defaultRates);
      localStorage.setItem('poshpoule-rates', JSON.stringify(defaultRates));
      
      setIsLoading(false);
      debugLogger.info('CurrencyProvider initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      debugLogger.error('CurrencyProvider initialization failed', err);
      setIsLoading(false);
    }
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    try {
      if (newCurrency !== currency) {
        setCurrencyState(newCurrency);
        debugLogger.info('Currency changed', { from: currency, to: newCurrency });
        
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('poshpoule-currency', newCurrency);
          } catch (err) {
            debugLogger.error('Failed to save currency preference', err);
          }
        }
      }
    } catch (err) {
      debugLogger.error('Failed to set currency', err);
    }
  }, [currency]);

  const formatPrice = useCallback((priceNaira: number): string => {
    try {
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
    } catch (err) {
      debugLogger.error('Failed to format price', { priceNaira, currency, error: err });
      return `₦${priceNaira.toLocaleString()}`;
    }
  }, [currency, rates]);

  const contextValue = useMemo(() => ({
    currency,
    setCurrency,
    rates,
    formatPrice,
    isLoading,
    error,
  }), [currency, setCurrency, rates, formatPrice, isLoading, error]);

  debugLogger.info('CurrencyProvider rendering', { 
    currency, 
    isLoading, 
    error: error ? 'has error' : 'no error' 
  });

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    const error = new Error('useCurrency must be used within a CurrencyProvider');
    debugLogger.error('useCurrency hook used outside provider', { error: error.message });
    throw error;
  }
  return context;
}
