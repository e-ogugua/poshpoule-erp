'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';
import { orderFormSchema, OrderFormData, formatPhoneNumber, getFieldError } from '@/lib/validation';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validateOnChange?: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validateOnChange = true,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const validateField = useCallback((field: string, value: any) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = (orderFormSchema as any).shape?.[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [field]: '' }));
        return true;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues[0]?.message || 'Invalid value';
        setErrors(prev => ({ ...prev, [field]: message }));
      }
      return false;
    }
  }, []);

  const validateForm = useCallback(() => {
    try {
      orderFormSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values]);

  const setValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));

    if (validateOnChange && touched[field]) {
      validateField(field, value);
    }
  }, [validateOnChange, touched, validateField]);

  const markFieldAsTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (validateOnChange) {
      validateField(field, values[field]);
    }
  }, [validateOnChange, values, validateField]);

  const formatField = useCallback((field: string, value: string) => {
    if (field === 'customerPhone') {
      return formatPhoneNumber(value);
    }
    return value;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      setSubmitError('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      await onSubmit(values);
      setSubmitSuccess('Order submitted successfully!');
      // Reset form after successful submission
      setValues(initialValues);
      setTouched({});
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, initialValues]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    setValue,
    setTouched,
    markFieldAsTouched,
    formatField,
    handleSubmit,
    validateField,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
