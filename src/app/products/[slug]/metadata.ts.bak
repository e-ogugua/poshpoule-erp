import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  
  // Fetch product data
  const product = await fetch(`http://localhost:3000/api/products/${slug}`, {
    next: { revalidate: 60 },
  }).then(res => res.ok ? res.json() : null);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | Posh POULE Farms`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
        ...previousImages,
      ],
    },
  };
}
