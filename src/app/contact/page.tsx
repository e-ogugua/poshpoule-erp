'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const ContactCard = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-gray-600">{children}</div>
  </div>
);

const contactInfo = {
  address: 'PoshPOULE Farms Prototype, No 3 Jesus Power Arena Crescent, Airport Road, New Haven Extension Enugu, Nigeria',
  phone: '+234 8122394397',
  email: 'poshpoulefarms@gmail.com',
  social: {
    facebook: 'https://facebook.com/poshpoulefarms',
    twitter: 'https://twitter.com/poshpoulefarms',
    instagram: 'https://instagram.com/poshpoulefarms'
  },
  hours: {
    weekdays: '8:00 AM - 6:00 PM',
    saturday: '9:00 AM - 4:00 PM',
    sunday: 'Closed'
  }
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Replace with your form submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Side by Side */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Column */}
              <div className="relative h-80 md:h-[32rem] lg:h-auto">
                <Image
                  src="/images/farm/KidslocallyGrown.jpg"
                  alt="PoshPOULE Farm"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  quality={90}
                />
              </div>
              
              {/* Content Column */}
              <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-heading">
                    Contact PoshPOULE Farms
                  </h1>
                  <div className="h-1 w-20 bg-primary mb-6"></div>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    Connect with us today to learn more about our farm-fresh products, 
                    schedule a visit, or explore partnership opportunities.
                  </p>
                  <div className="space-y-4">
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all duration-300"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call Us Now
                    </a>
                    <a 
                      href="#contact-form"
                      className="flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-all duration-300"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-16 relative z-10">
              <ContactCard icon={MapPin} title="Our Location">
                <p className="text-gray-600">{contactInfo.address}</p>
                <a 
                  href="https://www.google.com/maps?q=6.463083,7.547944" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-primary hover:underline text-sm font-medium"
                >
                  <MapPin className="h-4 w-4 mr-1" /> View on Map
                </a>
              </ContactCard>

              <ContactCard icon={Phone} title="Phone">
                <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-primary">
                  {contactInfo.phone}
                </a>
                <p className="text-sm text-gray-500 mt-1">Available {contactInfo.hours.weekdays}</p>
              </ContactCard>

              <ContactCard icon={Mail} title="Email">
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="text-primary hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
                <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
              </ContactCard>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 font-heading">
                    Send Us a Message
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Fill out the form below and we&#39;ll get back to you as soon as possible.
                  </p>
                </div>

                <div className="sr-only" aria-live="polite" aria-atomic="true" id="form-status">
                  {submitStatus === 'success' && 'Message sent successfully. We will get back to you as soon as possible.'}
                  {submitStatus === 'error' && 'Something went wrong. Please try again or contact us directly.'}
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start" role="alert" aria-labelledby="success-message">
                    <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium" id="success-message">Message sent successfully!</p>
                      <p className="text-sm">We&#39;ll get back to you as soon as possible.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start" role="alert" aria-labelledby="error-message">
                    <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium" id="error-message">Something went wrong</p>
                      <p className="text-sm">Please try again or contact us directly.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Product Questions">Product Questions</option>
                        <option value="Farm Visit">Farm Visit</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Visit Us Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src="/images/farm/GardenBeds.jpg"
                    alt="PoshPOULE Farm - Visit Us"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-8 sm:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Visit Our Farm</h2>
                  <p className="text-gray-600 mb-8">
                    Experience the PoshPOULE difference with a personal tour of our farm. See firsthand how we raise our 
                    poultry and grow our produce using sustainable, ethical practices.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Farm Hours</h3>
                      <div className="space-y-2">
                        {Object.entries(contactInfo.hours).map(([day, time]) => (
                          <div key={day} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{day}</span>
                            <span className="text-gray-900 font-medium">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Connect With Us</h3>
                      <div className="flex space-x-4">
                        <a 
                          href={contactInfo.social.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-6 w-6" />
                        </a>
                        <a 
                          href={contactInfo.social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-400 transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="h-6 w-6" />
                        </a>
                        <a 
                          href={contactInfo.social.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-pink-600 transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="h-80 lg:h-auto bg-gray-200 relative">
                  <Image
                    src="/images/blog/sustainability-practices.jpg"
                    alt="PoshPOULE Farm Location"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <a 
                    href="https://www.google.com/maps?q=6.463083,7.547944"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
                    aria-label="View on Google Maps"
                  >
                    <MapPin className="h-6 w-6 text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
