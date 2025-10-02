'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

type Currency = 'NGN' | 'USD' | 'GBP';

// Currency configuration
const CURRENCY_CONFIG = {
  NGN: { 
    symbol: '₦', 
    locale: 'en-NG',
    formatOptions: {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }
  },
  USD: { 
    symbol: '$', 
    locale: 'en-US',
    formatOptions: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  },
  GBP: { 
    symbol: '£', 
    locale: 'en-GB',
    formatOptions: {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  },
} as const;

// Static exchange rates (NGN is the base currency)
const STATIC_RATES = {
  NGN: 1,
  USD: 0.00065,  // 1 NGN = 0.00065 USD
  GBP: 0.00050,  // 1 NGN = 0.00050 GBP
} as const;

/**
 * Hook to format and convert prices with the current currency
 * @returns Object with formatting functions and currency info
 */
export function usePriceFormatter() {
  const context = useCurrency();
  
  // For backward compatibility with components expecting the old format
  return {
    ...context,
    format: context.formatPrice,  // Alias for backward compatibility
    convert: context.convertPrice, // Alias for backward compatibility
  };
}

/**
 * Format a price with a specific currency
 * @param amount - Amount to format (in base currency - Naira)
 * @param currency - Target currency code (NGN, USD, GBP)
 * @returns Formatted price string
 */
export function formatWithCurrency(
  amount: number, 
  currency: Currency = 'NGN'
): string {
  const config = CURRENCY_CONFIG[currency];
  
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return currency === 'NGN' 
      ? `₦${Math.round(amount).toLocaleString('en-NG')}`
      : `${config.symbol}${(amount * STATIC_RATES[currency]).toFixed(2)}`;
  }
  
  // Client-side rendering with proper formatting
  if (currency === 'NGN') {
    return `₦${Math.round(amount).toLocaleString('en-NG')}`;
  }
  
  const formatter = new Intl.NumberFormat(
    config.locale,
    config.formatOptions
  );
  
  return formatter.format(amount * STATIC_RATES[currency]);
}

/**
 * Format a price range in the specified currency
 * @param min - Minimum price (in base currency - Naira)
 * @param max - Maximum price (in base currency - Naira)
 * @param currency - Target currency code (NGN, USD, GBP)
 * @returns Formatted price range string
 */
export function formatPriceRange(
  min: number, 
  max: number, 
  currency: Currency = 'NGN'
): string {
  return `${formatWithCurrency(min, currency)} - ${formatWithCurrency(max, currency)}`;
}

/**
 * Get the currency symbol for a given currency code
 * @param currency - Currency code (NGN, USD, GBP)
 * @returns The currency symbol
 */
export function getCurrencySymbol(currency: Currency = 'NGN'): string {
  return CURRENCY_CONFIG[currency].symbol;
}
