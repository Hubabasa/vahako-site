
import { getCollection } from 'astro:content';

export function categorySlug(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/-in-sri-lanka$/, '');

  return `${base}-in-sri-lanka`;
}

export async function getAllCategories() {
  const products = await getCollection('products');
  const categoryOverrides = await getCollection('categories');

  const categoryMap = new Map<
    string,
    {
      slug: string;
      name: string;
      products: typeof products;
      seoTitle?: string;
      seoDescription?: string;
      image?: string;
      indexable?: boolean;
      contentId?: string;
    }
  >();

  for (const product of products) {
    for (const rawName of product.data.categories ?? []) {
      const name = rawName.trim();
      const slug = categorySlug(name);

      if (!name || slug === '-in-sri-lanka') continue;

      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, {
          slug,
          name,
          products: [],
        });
      }

      const category = categoryMap.get(slug)!;

      if (!category.products.some((item) => item.id === product.id)) {
        category.products.push(product);
      }
    }
  }

  // Apply optional SEO customization from category Markdown files.
  for (const override of categoryOverrides) {
    const slug = categorySlug(override.data.slug ?? override.data.name);
    const category = categoryMap.get(slug);

    if (!category) continue;

    category.name = override.data.name;
    category.seoTitle = override.data.seoTitle;
    category.seoDescription = override.data.seoDescription;
    category.image = override.data.image;
    category.indexable = override.data.indexable;
    category.contentId = override.id;
  }

  return [...categoryMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}
