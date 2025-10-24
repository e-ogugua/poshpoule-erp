'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { ChevronDown } from 'lucide-react';

interface CurrencyOption {
  code: 'NGN' | 'USD' | 'GBP';
  symbol: string;
  name: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'NGN', symbol: '₦', name: 'Naira' },
  { code: 'USD', symbol: '$', name: 'USD' },
  { code: 'GBP', symbol: '£', name: 'GBP' },
];

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CurrencyOption['code'];
    setCurrency(value);
  };

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={handleCurrencyChange}
        className="appearance-none bg-white border-2 border-primary/20 rounded-full px-4 py-2 pr-10 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-primary/40"
        aria-label="Select currency"
      >
        {CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code} className="flex items-center gap-2">
            {curr.symbol} {curr.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <ChevronDown className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}
