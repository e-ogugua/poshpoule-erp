import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Heart, Leaf, Users, Award } from 'lucide-react';
import Image from 'next/image';
import { readDatabase } from '@/lib/database-server';

export default function AboutPage() {
  const data = readDatabase();
  const teamMembers = data.teamMembers || []; // Show all team members, not just featured

  const values = [
    {
      icon: Leaf,
      title: 'Sustainability First',
      description: 'We prioritize environmentally friendly farming practices that protect our planet for future generations.'
    },
    {
      icon: Heart,
      title: 'Animal Welfare',
      description: 'Our animals are raised with care, respect, and access to natural environments they deserve.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We support local communities and provide fresh, healthy food to families in our area.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'Every product meets our strict quality standards for nutrition, taste, and safety.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/CornFarmBackyard.JPG"
              alt="PoshPOULE Farm About"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto px-4 text-center py-16">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-4">
              About PoshPOULE Farms
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We're passionate about sustainable farming and providing our community with the freshest, healthiest organic products.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl font-heading-bold mb-6 text-neutral-800">
                  Our Mission
                </h2>
                <p className="text-body text-lg mb-6">
                  {data.settings?.mission || 'At PoshPOULE Farms, our mission is to revolutionize agriculture by combining traditional farming wisdom with modern sustainable practices. We believe that healthy food should be accessible to everyone, and we are committed to growing the purest, most nutritious products while caring for our environment.'}
                </p>
                <p className="text-body text-lg mb-6">
                  Every egg, every vegetable, every piece of fruit that leaves our farm carries our promise of quality, sustainability, and care for both the consumer and the planet.
                </p>
                <Link href="/products" className="btn-primary">
                  Explore Our Products
                </Link>
              </div>
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src="/images/farm/GrowingBroilers.JPG"
                  alt="PoshPOULE Farm Mission"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-heading-bold mb-4 text-neutral-800">
                Our Core Values
              </h2>
              <p className="text-body text-lg max-w-2xl mx-auto">
                These principles guide everything we do, from how we care for our animals to how we serve our customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="card p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-heading-semibold mb-3">{value.title}</h3>
                  <p className="text-body text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl font-heading-bold mb-6 text-neutral-800">
                Our Story
              </h2>
              <div className="prose prose-lg mx-auto text-body">
                <p className="mb-6">
                  {data.settings?.story || 'Founded in 2015, PoshPOULE® Farms Ltd was founded out of a deep passion for healthy living and food security. What began as a small family homestead with a few chickens and a vegetable patch has grown into a diversified organic agribusiness. Rooted in our tradition of growing what we eat the purest way possible, we now produce premium poultry, fresh eggs, vegetables, fruits, and crops through sustainable and transparent farming practices.'}
                </p>
                <p className="mb-6">
                  From humble beginnings to serving hundreds of families, our journey has always been guided by trust, innovation, and care for both people and the planet. Today, PoshPOULE is proud to be a leading organic farm brand—nourishing communities with pure goodness while building a resilient agribusiness for the future.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-heading-bold mb-4 text-neutral-800">
                Meet Our Team
              </h2>
              <p className="text-body text-lg">
                The passionate people behind PoshPOULE Farms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member: any, index: number) => (
                <div key={member.id || index} className="card p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <h3 className="font-heading text-xl font-heading-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-body text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-heading-bold mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-body text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made PoshPOULE Farms their trusted source for organic, sustainable food.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary">
                Shop Our Products
              </Link>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
