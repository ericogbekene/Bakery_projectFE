// This file is kept for any pastries-specific constants or utilities.
// Product data is now fetched dynamically from Django API.
// See: app/menu/pastries/page.tsx

export type PastriesProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  thumbnail_url: string | null;
  image_url: string | null;
  available: boolean;
  category_name: string | null;
};
