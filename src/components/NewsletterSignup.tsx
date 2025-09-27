'use client';

import { useState, FormEvent, useCallback } from 'react';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
}

interface SubscribeFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export function NewsletterSignup() {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleSubmit = useCallback(async (e: FormEvent<SubscribeFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const emailValue = form.elements.email.value.trim();
    
    if (!emailValue) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);
      
    try {
      // In a real app, you would make an API call here
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: emailValue }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to subscribe');
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setEmail('');
      form.reset();
    } catch (err) {
      console.error('Failed to subscribe:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, error]);

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-medium">Thank you for subscribing!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        noValidate
      >
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-4 py-3 border ${
              error ? 'border-red-500' : 'border-neutral-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
            disabled={isSubmitting}
            aria-label="Email address for newsletter subscription"
            aria-invalid={!!error}
            aria-describedby={error ? 'email-error' : undefined}
            autoComplete="email"
            required
          />
          {error && (
            <p
              id="email-error"
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 ${
            isSubmitting
              ? 'bg-primary/70 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90'
          } text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap`}
          aria-busy={isSubmitting}
          aria-live="polite"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
