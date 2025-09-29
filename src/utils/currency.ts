'use client';

// Simple currency formatting without complex context dependency
type Currency = 'NGN' | 'USD' | 'GBP';

const CURRENCY_CONFIG = {
  NGN: { symbol: '₦', locale: 'en-NG' },
  USD: { symbol: '$', locale: 'en-US' },
  GBP: { symbol: '£', locale: 'en-GB' },
} as const;

const EXCHANGE_RATES = {
  NGN: 1,
  USD: 0.0013,
  GBP: 0.00105,
} as const;

export function usePriceFormatter() {
  // Simple client-side currency preference
  const getCurrency = (): Currency => {
    if (typeof window === 'undefined') return 'NGN';
    return (localStorage.getItem('poshpoule-currency') as Currency) || 'NGN';
  };

  const setCurrency = (currency: Currency) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('poshpoule-currency', currency);
      window.location.reload(); // Simple refresh to update all prices
    }
  };

  const formatPrice = (priceNaira: number): string => {
    const currency = getCurrency();
    const rate = EXCHANGE_RATES[currency] || 1;
    const convertedPrice = priceNaira * rate;
    
    switch (currency) {
      case 'NGN':
        return `₦${Math.round(convertedPrice).toLocaleString()}`;
      case 'USD':
        return `$${convertedPrice.toFixed(2)}`;
      case 'GBP':
        return `£${convertedPrice.toFixed(2)}`;
      default:
        return `₦${Math.round(priceNaira).toLocaleString()}`;
    }
  };

  return {
    formatPrice,
    currency: getCurrency(),
    setCurrency,
    rates: EXCHANGE_RATES,
  };
}

export function formatPrice(priceNaira: number, currency: Currency = 'NGN'): string {
  const rate = EXCHANGE_RATES[currency] || 1;
  const convertedPrice = priceNaira * rate;
  
  switch (currency) {
    case 'NGN':
      return `₦${Math.round(convertedPrice).toLocaleString()}`;
    case 'USD':
      return `$${convertedPrice.toFixed(2)}`;
    case 'GBP':
      return `£${convertedPrice.toFixed(2)}`;
    default:
      return `₦${Math.round(priceNaira).toLocaleString()}`;
  }
}
