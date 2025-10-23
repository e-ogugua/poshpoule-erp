'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';
import { readDatabase } from '@/lib/database-server';

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const ContactCard = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="text-gray-600">{children}</div>
  </div>
);

export default function ContactPage() {
  const data = readDatabase();
  const settings = data.settings;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = {
    address: settings.address || '123 Farm Road, Agricultural Zone, Enugu, Nigeria',
    phone: settings.contactPhone || '+234 812 345 6789',
    email: settings.contactEmail || 'info@poshpoulefarms.com',
    social: {
      facebook: 'https://facebook.com/poshpoulefarms',
      twitter: 'https://twitter.com/poshpoulefarms',
      instagram: 'https://instagram.com/poshpoulefarms'
    },
    hours: settings.businessHours || {
      "Monday - Friday": "8:00 AM - 6:00 PM",
      "Saturday": "9:00 AM - 4:00 PM",
      "Sunday": "Closed"
    }
  };

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
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/farm/KidslocallyGrown.jpg"
              alt="PoshPOULE Farm Contact"
              fill
              className="object-cover opacity-30"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/80 mix-blend-multiply" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Connect With Us
              </h1>
              <p className="mt-6 text-xl text-gray-100 max-w-3xl mx-auto">
                We&#39;re here to help and answer any questions you might have. 
                Reach out to us and we&#39;ll respond as soon as we can.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="relative py-16 bg-gray-50">
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                How Can We Help You?
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about our products or services? Fill out the form below or reach out to us directly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <ContactCard 
                  icon={MapPin} 
                  title="Our Location"
                >
                  <p className="text-gray-600">{contactInfo.address}</p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-primary hover:underline text-sm font-medium"
                  >
                    Get Directions →
                  </a>
                </ContactCard>

                <ContactCard 
                  icon={Phone} 
                  title="Phone"
                >
                  <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-primary">
                    {contactInfo.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri, 8am-6pm</p>
                </ContactCard>

                <ContactCard 
                  icon={Mail} 
                  title="Email Us"
                >
                  <a 
                    href={`mailto:${contactInfo.email}`} 
                    className="text-primary hover:underline break-all"
                  >
                    {contactInfo.email}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">We&#39;ll respond within 24 hours</p>
                </ContactCard>

                <ContactCard 
                  icon={Clock} 
                  title="Business Hours"
                >
                  <ul className="space-y-2">
                    {Object.entries(contactInfo.hours).map(([day, time]) => (
                      <li key={day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day}</span>
                        <span className="font-medium">{time}</span>
                      </li>
                    ))}
                  </ul>
                </ContactCard>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a 
                      href={contactInfo.social.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a 
                      href={contactInfo.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a 
                      href={contactInfo.social.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-pink-600 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          aria-required="true"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="John Doe"
                          aria-describedby="name-help"
                        />
                        <div id="name-help" className="sr-only">Enter your full name as it appears on official documents</div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          aria-required="true"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="your@email.com"
                          aria-describedby="email-help"
                        />
                        <div id="email-help" className="sr-only">We will use this email to respond to your inquiry</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="+234 800 000 0000"
                          aria-describedby="phone-help"
                        />
                        <div id="phone-help" className="sr-only">Optional: Include country code for international numbers</div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          aria-required="true"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
                          aria-describedby="subject-help"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="orders">Order Questions</option>
                          <option value="products">Product Information</option>
                          <option value="farm-tour">Farm Tour Request</option>
                          <option value="partnership">Partnership Opportunities</option>
                        </select>
                        <div id="subject-help" className="sr-only">Choose the topic that best describes your inquiry</div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                        placeholder="How can we help you?"
                        aria-describedby="message-help"
                      />
                      <div id="message-help" className="sr-only">Provide details about your inquiry or request</div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
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
          </div>
        </section>

        {/* Map Section */}
        <div className="relative h-96 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.3752954142664835!3d6.524631324022329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1620000000000!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
            aria-hidden="false"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <a
              href="https://www.google.com/maps?q=PoshPOULE+Farms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
