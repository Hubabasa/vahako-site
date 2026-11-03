import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Simple product configuration options
const productOption = z.object({
  name: z.string(),
  label: z.string(),

  choices: z.array(
    z.object({
      label: z.string(),
      value: z.string(),

      // Amount added to the regular price
      priceAdjustment: z.number().default(0),

      // Optional discounted adjustment
      saleAdjustment: z.number().optional(),
    })
  ).min(1),
});

// Product videos
const productVideo = z.object({
  title: z.string(),
  youtubeId: z.string(),
  description: z.string().default(''),
});

// Product specifications
const productSpecification = z.object({
  label: z.string(),
  value: z.string(),
});

const products = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/products',
  }),

  schema: z.object({
    // Basic product information
    title: z.string(),
    description: z.string(),
    // Main category, used for breadcrumbs and related products
primaryCategory: z.string().min(1),

// All categories this product belongs to
categories: z.array(z.string().min(1)).min(1),
    sku: z.string(),

    // Pricing
    price: z.number().nonnegative(),
    salePrice: z.number().nonnegative().optional(),
    currency: z.string().default('LKR'),

    // Images
    image: z.string(),
    images: z.array(z.string()).default([]),

    // Product highlights
    taglines: z.array(z.string()).default([]),

    // Stock and ordering
    availability: z.enum([
      'in-stock',
      'out-of-stock',
      'made-to-order',
    ]).default('in-stock'),

    // Products without a fixed price
    priceOnRequest: z.boolean().default(false),

    // Product configurator
    configurator: z.string().optional(),

    // Simple Markdown-defined options
    options: z.array(productOption).default([]),

    // Specifications
    specifications: z.array(productSpecification).default([]),

    // YouTube videos
    videos: z.array(productVideo).default([]),

    // Related products (product IDs)
    relatedProducts: z.array(z.string()).default([]),

    // Shop display
    featured: z.boolean().default(false),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }).refine(
    (product) =>
      product.salePrice === undefined ||
      product.salePrice < product.price,
    {
      message: 'Sale price must be lower than regular price.',
      path: ['salePrice'],
    }
  ),
});

// Optional category SEO content.
// Categories without Markdown files will still be generated automatically.
const categories = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/categories',
  }),

  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    image: z.string().optional(),
    indexable: z.boolean().optional(),
  }),
});

export const collections = {
  products,
  categories,
};