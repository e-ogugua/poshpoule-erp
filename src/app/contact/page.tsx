import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Image from 'next/image';
import { readDatabase } from '@/lib/database-server';

export default function ContactPage() {
  const data = readDatabase();
  const settings = data.settings;

  const contactInfo = {
    address: settings.address,
    phone: settings.contactPhone,
    email: settings.contactEmail,
    hours: settings.businessHours || {
      "Monday - Friday": "8:00 AM - 6:00 PM",
      "Saturday": "9:00 AM - 4:00 PM",
      "Sunday": "Closed"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-green-600 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/KidslocallyGrown.jpg"
              alt="PoshPOULE Farm Contact"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto px-4 text-center py-16">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="card p-8">
                <h2 className="font-heading text-2xl font-heading-semibold mb-6">
                  Send us a Message
                </h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="input-field w-full"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="input-field w-full"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="input-field w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <select name="subject" required className="input-field w-full">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="orders">Order Questions</option>
                      <option value="products">Product Information</option>
                      <option value="farm-tour">Farm Tour Request</option>
                      <option value="partnership">Partnership Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      rows={6}
                      required
                      className="input-field w-full"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="card p-8">
                  <h3 className="font-heading text-xl font-heading-semibold mb-6">
                    Contact Information
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Address</h4>
                        <p className="text-neutral-600">{contactInfo.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Phone</h4>
                        <p className="text-neutral-600">{contactInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Email</h4>
                        <p className="text-neutral-600">{contactInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium mb-2">Business Hours</h4>
                        <div className="space-y-1 text-neutral-600">
                          {Object.entries(contactInfo.hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span>{day}:</span>
                              <span>{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Farm Location Image */}
                <div className="card p-8">
                  <h3 className="font-heading text-xl font-heading-semibold mb-4">
                    Find Us
                  </h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src="/images/farm/CornFarmBackyard.JPG"
                      alt="PoshPOULE Farm Location"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <p className="text-center text-sm text-neutral-600 mt-2">
                    Farm Location, Enugu State, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-heading-bold mb-6">
              Visit Our Farm
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Experience the difference fresh, organic produce makes. Schedule a farm tour and see where your food comes from.
            </p>
            <Link href="/products" className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
              Shop Our Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
