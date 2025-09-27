import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/app/actions/blog';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { Components } from 'react-markdown';
import type { CodeComponent } from 'react-markdown/lib/ast-to-react';

// Type definitions for ReactMarkdown components
const markdownComponents: Components = {
  code({ node, className, children, ...props }: CodeComponent) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !className?.includes('language-');
    return !isInline && match ? (
      <SyntaxHighlighter
        style={tomorrow}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        wrapLines
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img: ({ src, alt }) => (
    <div className="my-8">
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={450}
        className="rounded-xl shadow-lg mx-auto"
      />
      {alt && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {alt}
        </p>
      )}
    </div>
  ),
  a: ({ href, children }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-green-600 hover:text-green-700 font-medium transition-colors"
    >
      {children}
    </a>
  ),
  h2: ({ children }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^\w]+/g, '-') 
      : 'heading';
    
    return (
      <h2 
        id={id}
        className="group flex items-center text-3xl font-heading-semibold mt-12 mb-6 text-gray-900"
      >
        <span>{children}</span>
        <a 
          href={`#${id}`}
          className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Direct link to heading"
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </a>
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^\w]+/g, '-') 
      : 'subheading';
    
    return (
      <h3 
        id={id}
        className="group flex items-center text-2xl font-heading-semibold mt-10 mb-4 text-gray-900"
      >
        <span>{children}</span>
        <a 
          href={`#${id}`}
          className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Direct link to heading"
        >
          <svg className="w-4 h-4 text-gray-400 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </a>
      </h3>
    );
  },
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getBlogPostBySlug(slug);
  const allPosts = await getBlogPosts();

  if (!post) {
    notFound();
  }

  // Calculate reading time (approximately 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Related posts (excluding current post)
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-primary hover:text-green-700 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium">Back to Blog</span>
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          <header className="mb-12 text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors duration-200">
                {post.category}
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-heading-bold mb-6 leading-tight text-gray-900">
              {post.title}
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8 rounded-full"></div>
            </div>
            
            <div className="relative w-full h-96 md:h-[32rem] rounded-2xl overflow-hidden mb-12 shadow-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:font-heading-semibold prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:marker:text-green-500 prose-blockquote:border-l-4 prose-blockquote:border-green-400 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:bg-green-50 prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-normal prose-blockquote:rounded-r prose-a:text-green-600 prose-a:font-medium hover:prose-a:text-green-700 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:mt-2">
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Found this article helpful?</h3>
                <p className="text-gray-500 text-sm">Share it with your network</p>
              </div>
              <div className="flex space-x-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `https://poshpoule.com/blog/${post.slug}`
                  )}&text=${encodeURIComponent(`${post.title} - PoshPOULE Farms`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors duration-200"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `https://poshpoule.com/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    `https://poshpoule.com/blog/${post.slug}`
                  )}&title=${encodeURIComponent(post.title)}&source=PoshPOULE+Farms`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors duration-200"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://poshpoule.com/blog/${post.slug}`);
                    // You might want to add a toast notification here
                  }}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                <h2 className="mx-6 text-2xl font-heading-semibold text-gray-900 whitespace-nowrap">Continue Reading</h2>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <div className="relative h-56">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-white/90 text-green-800 rounded-full mb-2">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-heading-semibold mb-3 leading-snug">
                        <Link 
                          href={`/blog/${relatedPost.slug}`} 
                          className="text-gray-900 hover:text-primary transition-colors duration-200"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4 text-sm">{relatedPost.excerpt}</p>
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-green-700 group-hover:translate-x-1 transition-all duration-200"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-green-700 transition-colors duration-200 shadow-sm"
                >
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}

// Custom content for the Fulani Herders blog post
function FulaniHerdersContent() {
  return (
    <>
      <p className="lead">
        The relationship between Fulani herders and local farmers in Eastern Nigeria has often been portrayed as one of conflict, but the reality is far more nuanced. This article explores the complex dynamics and potential for sustainable coexistence.
      </p>

      <h2>The Historical Context</h2>
      <p>
        For centuries, Fulani herders have practiced transhumance—the seasonal movement of livestock between grazing grounds. In Eastern Nigeria, this practice has historically followed natural patterns of rainfall and vegetation growth. However, climate change, population growth, and changing land use patterns have disrupted these traditional routes, leading to increased tensions.
      </p>

      <div className="my-12 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-l-8 border-green-500 shadow-sm">
        <div className="relative">
          <svg className="absolute -top-4 -left-4 h-12 w-12 text-green-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="relative text-lg text-gray-800 italic pl-8">
            "The key to sustainable grazing lies in recognizing that herders and farmers are not natural enemies, but partners in land management."
          </p>
          <div className="mt-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-sm mr-3">
              AM
            </div>
            <div>
              <p className="font-medium text-gray-900">Dr. Amina Mohammed</p>
              <p className="text-sm text-gray-500">Agricultural Economist</p>
            </div>
          </div>
        </div>
      </div>

      <h2>The Eastern Nigeria Context</h2>
      <p>
        In states like Enugu, Ebonyi, and Anambra, the challenges are particularly acute. The region's high population density means competition for land is intense. Farmers report crop damage from cattle, while herders face dwindling grazing reserves and water sources.
      </p>

      <figure className="my-12">
        <div className="relative w-full h-64 md:h-[32rem] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/farm/CowStand.jpg"
            alt="Cattle grazing in Eastern Nigeria"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <figcaption className="mt-3 text-sm text-center text-gray-500 italic">
          Traditional grazing practices in Eastern Nigeria can be sustainable when managed with care and community involvement
        </figcaption>
      </figure>

      <h2>Ecological Benefits of Traditional Herding</h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        When properly managed, the movement of cattle can actually benefit the land in ways that modern agricultural practices often overlook. These traditional methods, refined over generations, offer sustainable solutions to contemporary land management challenges.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 className="font-heading font-medium text-lg text-gray-900 mb-2">Natural Fertilization</h3>
          <p className="text-gray-600 text-sm">
            Cattle manure enriches the soil with essential nutrients, reducing the need for chemical fertilizers. This natural process improves soil structure and water retention.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <h3 className="font-heading font-medium text-lg text-gray-900 mb-2">Weed Control</h3>
          <p className="text-gray-600 text-sm">
            Selective grazing helps control invasive plant species that might otherwise dominate local ecosystems, maintaining biodiversity and preventing soil degradation.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.478 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 className="font-heading font-medium text-lg text-gray-900 mb-2">Seed Dispersal</h3>
          <p className="text-gray-600 text-sm">
            Animals spread seeds through their droppings, promoting biodiversity and natural reforestation across the landscape, which benefits the entire ecosystem.
          </p>
        </div>
      </div>

      <h2>Innovative Solutions from the Field</h2>
      <p>
        Several communities in Eastern Nigeria are pioneering innovative approaches to herder-farmer relations:
      </p>

      <h3>1. Community Grazing Reserves</h3>
      <p>
        Some communities have established designated grazing areas with input from both farmers and herders. These reserves include:
      </p>
      <ul>
        <li>Planned grazing schedules to prevent overgrazing</li>
        <li>Shared water points to prevent cattle from wandering into farmlands</li>
        <li>Conflict resolution committees with representatives from both groups</li>
      </ul>

      <h3>2. Silvopasture Systems</h3>
      <p>
        Integrating trees with pasture and livestock can provide multiple benefits:
      </p>
      <ul>
        <li>Shade for cattle reduces heat stress</li>
        <li>Tree roots help prevent soil erosion</li>
        <li>Fruit and nut trees provide additional income sources</li>
      </ul>

      <figure className="my-12">
        <div className="relative w-full h-64 md:h-[32rem] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/farm/GreenTreesPath.jpg"
            alt="Silvopasture system in practice"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full mb-2 border border-white/20">
              Silvopasture System
            </span>
            <p className="text-lg font-medium">Integrating trees with pasture creates a sustainable ecosystem for both livestock and the environment</p>
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-center text-gray-500">
          A well-designed silvopasture system in Eastern Nigeria, demonstrating how trees, forage, and livestock can coexist productively
        </figcaption>
      </figure>

      <h3>3. Alternative Feed Sources</h3>
      <p>
        To reduce pressure on grazing lands, some herders are adopting:
      </p>
      <ul>
        <li>Cut-and-carry systems where fodder is brought to cattle</li>
        <li>Use of agricultural byproducts as supplementary feed</li>
        <li>Rotational grazing to allow vegetation to recover</li>
      </ul>

      <h2>The Role of Technology</h2>
      <p>
        Mobile technology is playing an increasing role in preventing conflicts:
      </p>
      <ul>
        <li>Early warning systems alert farmers when herders are approaching</li>
        <li>Digital platforms connect herders with available grazing lands</li>
        <li>GPS tracking helps monitor cattle movements and prevent encroachment</li>
      </ul>

      <h2>Policy Recommendations</h2>
      <p>
        For sustainable herder-farmer relations, we recommend:
      </p>
      <ol>
        <li><strong>Land Use Planning</strong>: Designate specific areas for grazing and farming with buffer zones</li>
        <li><strong>Education and Training</strong>: Teach sustainable land management practices to both groups</li>
        <li><strong>Conflict Resolution Mechanisms</strong>: Establish local committees to address disputes quickly</li>
        <li><strong>Economic Incentives</strong>: Provide support for alternative livelihoods and value-added products</li>
      </ol>

      <h2>Success Stories</h2>
      <p>
        In Enugu State, the "Peaceful Coexistence Initiative" has brought together farmers and herders to:
      </p>
      <ul>
        <li>Develop shared water points</li>
        <li>Create community grazing reserves</li>
        <li>Establish joint patrols to prevent crop damage</li>
      </ul>
      <p>
        The results have been promising, with a 60% reduction in conflicts reported in participating communities.
      </p>

      <h2>Conclusion</h2>
      <p>
        The challenges facing herders and farmers in Eastern Nigeria are significant but not insurmountable. By focusing on shared interests—healthy land, food security, and economic stability—we can develop solutions that benefit all parties. The path forward requires dialogue, innovation, and a commitment to sustainable land management practices that honor both agricultural and pastoral traditions.
      </p>

      <div className="mt-16 p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 text-amber-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-amber-900">What You Can Do</h3>
              <p className="mt-1 text-sm text-amber-800">
                Everyone has a role to play in promoting sustainable herder-farmer relationships. Here are some practical steps you can take:
              </p>
              
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-amber-800">
                    <strong>Support local initiatives</strong> that promote herder-farmer dialogue and conflict resolution
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-amber-800">
                    <strong>Educate yourself and others</strong> about sustainable land management practices and their benefits
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-amber-800">
                    <strong>Advocate for policies</strong> that support both farming and pastoral communities at local and national levels
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-amber-800">
                    <strong>Visit PoshPOULE Farms</strong> to see sustainable agricultural practices in action and learn how we're building bridges between communities
                  </span>
                </li>
              </ul>
              
              <div className="mt-6">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                >
                  Contact Us to Learn More
                  <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
