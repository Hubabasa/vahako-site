
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const products = await getCollection('products');

  const catalogue = products.map((product) => {
    const data = product.data;

    return {
      id: product.id,
      sku: data.sku,
      title: data.title,
      price: data.price,
      salePrice: data.salePrice ?? null,
      currency: data.currency,
      availability: data.availability,
      priceOnRequest: data.priceOnRequest ?? false,
      options: (data.options ?? []).map((option) => ({
        name: option.name,
        label: option.label,
        choices: option.choices.map((choice) => ({
          label: choice.label,
          value: choice.value,
          priceAdjustment: choice.priceAdjustment,
          saleAdjustment:
            choice.saleAdjustment ?? choice.priceAdjustment
        }))
      })),
      url: `https://vahako.com/shop/${product.id}/`
    };
  });

  return new Response(JSON.stringify(catalogue), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
};
