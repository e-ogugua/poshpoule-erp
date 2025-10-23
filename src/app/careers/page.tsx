import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Users, MapPin, Clock, Mail } from 'lucide-react';

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Farm Operations Manager",
      location: "Farm Location, Nigeria",
      type: "Full-time",
      description: "Lead our daily farm operations and ensure optimal productivity while maintaining our sustainable farming practices.",
      requirements: [
        "5+ years of experience in agricultural operations",
        "Knowledge of sustainable farming practices",
        "Strong leadership and team management skills",
        "Understanding of crop rotation and soil health"
      ]
    },
    {
      title: "Organic Farming Specialist",
      location: "Farm Location, Nigeria",
      type: "Full-time",
      description: "Implement and maintain organic farming practices across all our crops and ensure compliance with organic standards.",
      requirements: [
        "Degree in Agriculture or related field",
        "Experience with organic farming certification",
        "Knowledge of pest management and crop rotation",
        "Passion for sustainable agriculture"
      ]
    },
    {
      title: "Quality Control Inspector",
      location: "Farm Location, Nigeria",
      type: "Full-time",
      description: "Ensure all our products meet the highest quality standards before they reach our customers.",
      requirements: [
        "2+ years in quality control or food safety",
        "Knowledge of food safety regulations",
        "Attention to detail and analytical skills",
        "Experience with fresh produce quality assessment"
      ]
    },
    {
      title: "Customer Service Representative",
      location: "Farm Location, Nigeria",
      type: "Full-time",
      description: "Provide excellent customer service and support to our valued customers.",
      requirements: [
        "Excellent communication skills",
        "Customer service experience preferred",
        "Knowledge of our products is a plus",
        "Friendly and professional demeanor"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Be part of a mission to provide fresh, healthy, and sustainable food to our community.
            </p>
          </div>
        </section>

        {/* About Working With Us */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl font-heading-bold mb-6">
                Why Work With Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-heading-semibold mb-3">Great Team</h3>
                  <p className="text-neutral-600">
                    Work with passionate people who share your commitment to sustainable agriculture and healthy living.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-heading-semibold mb-3">Beautiful Location</h3>
                  <p className="text-neutral-600">
                    Enjoy working in the peaceful countryside surrounded by nature and fresh air.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-heading-semibold mb-3">Work-Life Balance</h3>
                  <p className="text-neutral-600">
                    We believe in sustainable work practices that support both productivity and personal well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-3xl font-heading-bold mb-12 text-center">
                Current Openings
              </h2>

              <div className="space-y-8">
                {jobOpenings.map((job, index) => (
                  <div key={index} className="card p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div>
                        <h3 className="font-heading text-2xl font-heading-semibold mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-neutral-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <button className="btn-primary">
                          Apply Now
                        </button>
                      </div>
                    </div>

                    <p className="text-neutral-600 mb-6">
                      {job.description}
                    </p>

                    <div>
                      <h4 className="font-heading text-lg font-heading-semibold mb-3">
                        Requirements:
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-neutral-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* General Application */}
              <div className="mt-16 bg-neutral-50 rounded-lg p-8 text-center">
                <h3 className="font-heading text-2xl font-heading-semibold mb-4">
                  Don&apos;t See a Perfect Match?
                </h3>
                <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                  We&apos;re always looking for passionate individuals to join our team. Send us your resume and tell us why you&apos;d be a great fit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="mailto:careers@poshpoule.com"
                    className="btn-primary inline-flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Your Resume
                  </a>
                  <span className="text-neutral-500">careers@poshpoule.com</span>
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
