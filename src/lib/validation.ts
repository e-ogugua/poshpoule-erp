import { z } from 'zod';

// Phone number validation for Nigerian numbers
const phoneRegex = /^(\+234|0)[789]\d{9}$/;

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
    .regex(phoneRegex, 'Please enter a valid Nigerian phone number')
    .min(11, 'Phone number must be at least 11 digits'),

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
      productId: z.string(),
      name: z.string(),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
      priceNaira: z.number().positive(),
    }))
    .min(1, 'Please select at least one product'),

  totalAmount: z
    .number()
    .positive('Total amount must be greater than 0'),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

// Utility function to format phone numbers
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Format Nigerian phone numbers
  if (digits.startsWith('234')) {
    if (digits.length === 13) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    }
  } else if (digits.startsWith('0')) {
    if (digits.length === 11) {
      return `0${digits.slice(1, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
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
