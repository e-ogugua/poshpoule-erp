import { z } from 'zod';

// Phone number validation for Nigerian numbers - more flexible
const phoneRegex = /^(\+?234|0)[789]\d{9}$/;

// Order form validation schema
export const orderFormSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  customerEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters'),

  customerPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^(\+?234|0)[789]\d{9}$/, 'Please enter a valid Nigerian phone number starting with 0 or +234')
    .transform((val) => val.replace(/\s+/g, '')),

  orderType: z.enum(['pickup', 'delivery'], {
    error: 'Please select an order type',
  }),

  deliveryAddress: z
    .string()
    .optional(),

  scheduledDate: z
    .string()
    .min(1, 'Please select a preferred date')
    .refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Date must be today or in the future'),

  scheduledTime: z
    .string()
    .min(1, 'Please select a preferred time'),

  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),

  products: z
    .array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      name: z.string().min(1, 'Product name is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
      priceNaira: z.union([
        z.number().positive('Price must be greater than 0'),
        z.string().transform((val) => {
          const num = parseFloat(val.replace(/[^0-9.-]+/g, ''));
          return isNaN(num) ? 0 : num;
        }).refine((val) => val > 0, 'Price must be greater than 0')
      ]).optional().default(0),
    }))
    .min(1, 'Please select at least one product')
    .max(10, 'Cannot order more than 10 different products'),

  totalAmount: z
    .number()
    .positive('Total amount must be greater than 0')
    .max(10000000, 'Order amount cannot exceed ₦10,000,000'),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

// Utility function to format phone numbers
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Handle Nigerian phone numbers
  if (digits.startsWith('234')) {
    // +234 format
    if (digits.length >= 3) {
      let formatted = '+234';
      if (digits.length >= 6) {
        formatted += ` ${digits.slice(3, 6)}`;
      } else {
        formatted += ` ${digits.slice(3)}`;
      }
      if (digits.length >= 9) {
        formatted += ` ${digits.slice(6, 9)}`;
      } else if (digits.length > 6) {
        formatted += ` ${digits.slice(6)}`;
      }
      if (digits.length >= 13) {
        formatted += ` ${digits.slice(9, 13)}`;
      } else if (digits.length > 9) {
        formatted += ` ${digits.slice(9)}`;
      }
      return formatted.trim();
    }
  } else if (digits.startsWith('0')) {
    // 0 format
    if (digits.length >= 2) {
      let formatted = `0${digits.slice(1, 2)}`;
      if (digits.length >= 5) {
        formatted += ` ${digits.slice(2, 5)}`;
      } else if (digits.length > 2) {
        formatted += ` ${digits.slice(2)}`;
      }
      if (digits.length >= 8) {
        formatted += ` ${digits.slice(5, 8)}`;
      } else if (digits.length > 5) {
        formatted += ` ${digits.slice(5)}`;
      }
      if (digits.length >= 12) {
        formatted += ` ${digits.slice(8, 12)}`;
      } else if (digits.length > 8) {
        formatted += ` ${digits.slice(8)}`;
      }
      return formatted.trim();
    }
  }

  return value;
};

// Utility function to validate business hours
export const isValidBusinessHour = (time: string): boolean => {
  const validTimes = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00'
  ];
  return validTimes.includes(time);
};

// Utility function to get minimum date (tomorrow for orders)
export const getMinDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

// Error message formatter
export const getFieldError = (errors: z.ZodError, field: string): string | undefined => {
  const fieldError = errors.issues.find(error =>
    error.path.includes(field)
  );
  return fieldError?.message;
};
