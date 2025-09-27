'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { ChevronDown } from 'lucide-react';

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  
  const currencies: CurrencyOption[] = [
    { code: 'NGN', symbol: '₦', name: 'Naira' },
    { code: 'USD', symbol: '$', name: 'USD' },
    { code: 'GBP', symbol: '£', name: 'GBP' },
  ];
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'NGN' | 'USD' | 'GBP';
    setCurrency(value);
  };

  return (
    <div className="relative inline-block">
      <select
        value={currency}
        onChange={handleCurrencyChange}
        className="appearance-none bg-white border border-neutral-300 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        aria-label="Select currency"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
    </div>
  );
}
