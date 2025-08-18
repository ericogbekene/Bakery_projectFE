import { create } from 'zustand';
export type ProductType = 'cake' | 'cupcake' | 'loaves';

export interface Product {
  id: string;
  product: ProductType;
  title: string;
  description: string;
  image: string;
  price:number;
}

interface ProductStore {
  products: Product[];
  getProductsByType: (type: ProductType) => Product[];
  getProductById: (id: string) => Product | undefined;
}

const mockProducts: Product[] = [
   {
    id: "cupcake-1",
    product: "cupcake",
    title: "Coconut Cupcakes",
    description: "Our coconut cupcakes are made with coconut milk and topped with fluffy coconut buttercream frosting. A real treat for the true coconut aficionado.",
    image: "/images/coconut-cake.png",
    price: 1200
  },
  {
    id: "cupcake-2",
    product: "cupcake",
    title: "Chocolate Cupcakes",
    description: "Our classic chocolate cupcakes are rich and moist, topped with smooth chocolate buttercream frosting for the ultimate treat.",
    image: "/images/coconut-cake.png",
    price: 1200
  },
  {
    id: "cupcake-3",
    product: "cupcake",
    title: "Marble Cupcakes",
    description: "Our marble cupcakes are a perfect blend of vanilla and chocolate swirled together and topped with a dual frosting for a delicious mix.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cupcake-4",
    product: "cupcake",
    title: "Plain Cupcakes",
    description: "Our plain cupcakes are light and fluffy with a subtle vanilla flavor. Perfect for those who prefer a simpler treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cupcake-5",
    product: "cupcake",
    title: "Red Velvet Cupcakes",
    description: "Our red velvet cupcakes are rich and velvety with a hint of cocoa, topped with cream cheese frosting for a classic combination.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cupcake-6",
    product: "cupcake",
    title: "Vanilla Cupcakes",
    description: "A classic cupcake with light and airy vanilla cake topped with smooth vanilla buttercream frosting for a timeless treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-1",
    product: "cake",
    title: "Swirl",
    description: "Our signature cake with beautiful blue swirl decoration. Perfect for birthdays and special celebrations.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-62",
    product: "cake",
    title: "Flowers",
    description: "A delicate cake adorned with handcrafted buttercream flowers. Ideal for weddings and elegant occasions.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-35",
    product: "cake",
    title: "Mixer",
    description: "Our specialty cake with a mix of flavors and decorative elements for those who want a bit of everything.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-56",
    product: "cake",
    title: "Coconut Cupcakes",
    description:
      "Our coconut cupcakes are made with coconut milk and topped with fluffy coconut buttercream frosting. A real treat for the true coconut aficionado.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-2",
    product: "cake",
    title: "Chocolate Cupcakes",
    description:
      "Our classic chocolate cupcakes are rich and moist, topped with smooth chocolate buttercream frosting for the ultimate treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-3",
    product: "cake",
    title: "Marble Cupcakes",
    description:
      "Our marble cupcakes are a perfect blend of vanilla and chocolate swirled together and topped with a dual frosting for a delicious mix.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-4",
    product: "cake",
    title: "Plain Cupcakes",
    description:
      "Our plain cupcakes are light and fluffy with a subtle vanilla flavor. Perfect for those who prefer a simpler treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-5",
    product: "cake",
    title: "Red Velvet Cupcakes",
    description:
      "Our red velvet cupcakes are rich and velvety with a hint of cocoa, topped with cream cheese frosting for a classic combination.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-6",
    product: "cake",
    title: "Vanilla Cupcakes",
    description:
      "A classic cupcake with light and airy vanilla cake topped with smooth vanilla buttercream frosting for a timeless treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-7",
    title: "Swirl",
    product: "cake",
    description:
      "Our signature cake with beautiful blue swirl decoration. Perfect for birthdays and special celebrations.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },
  {
    id: "cake-8",
    title: "Flowers",
    description:
      "A delicate cake adorned with handcrafted buttercream flowers. Ideal for weddings and elegant occasions.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "cake",
  },
  {
    id: "cake-9",
    product: "cake",
    title: "Mixer",
    description:
      "Our specialty cake with a mix of flavors and decorative elements for those who want a bit of everything.",
    image: "/images/coconut-cake.png",
    price: 1200,
  },

  // Loaves
  {
    id: "loaf-1",
    title: "Coconut Cupcakes",
    description:
      "Our coconut cupcakes are made with coconut milk and topped with fluffy coconut buttercream frosting. A real treat for the true coconut aficionado.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-2",
    title: "Chocolate Cupcakes",
    description:
      "Our classic chocolate cupcakes are rich and moist, topped with smooth chocolate buttercream frosting for the ultimate treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-3",
    title: "Marble Cupcakes",
    description:
      "Our marble cupcakes are a perfect blend of vanilla and chocolate swirled together and topped with a dual frosting for a delicious mix.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-4",
    title: "Plain Cupcakes",
    description:
      "Our plain cupcakes are light and fluffy with a subtle vanilla flavor. Perfect for those who prefer a simpler treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-5",
    title: "Red Velvet Cupcakes",
    description:
      "Our red velvet cupcakes are rich and velvety with a hint of cocoa, topped with cream cheese frosting for a classic combination.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-6",
    title: "Vanilla Cupcakes",
    description:
      "A classic cupcake with light and airy vanilla cake topped with smooth vanilla buttercream frosting for a timeless treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-7",
    title: "Swirl",
    description:
      "Our signature cake with beautiful blue swirl decoration. Perfect for birthdays and special celebrations.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-8",
    title: "Flowers",
    description:
      "A delicate cake adorned with handcrafted buttercream flowers. Ideal for weddings and elegant occasions.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-9",
    title: "Mixer",
    description:
      "Our specialty cake with a mix of flavors and decorative elements for those who want a bit of everything.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-10",
    title: "Coconut Cupcakes",
    description:
      "Our coconut cupcakes are made with coconut milk and topped with fluffy coconut buttercream frosting. A real treat for the true coconut aficionado.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-11",
    title: "Chocolate Cupcakes",
    description:
      "Our classic chocolate cupcakes are rich and moist, topped with smooth chocolate buttercream frosting for the ultimate treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-12",
    title: "Marble Cupcakes",
    description:
      "Our marble cupcakes are a perfect blend of vanilla and chocolate swirled together and topped with a dual frosting for a delicious mix.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-13",
    title: "Plain Cupcakes",
    description:
      "Our plain cupcakes are light and fluffy with a subtle vanilla flavor. Perfect for those who prefer a simpler treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-14",
    title: "Red Velvet Cupcakes",
    description:
      "Our red velvet cupcakes are rich and velvety with a hint of cocoa, topped with cream cheese frosting for a classic combination.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-15",
    title: "Vanilla Cupcakes",
    description:
      "A classic cupcake with light and airy vanilla cake topped with smooth vanilla buttercream frosting for a timeless treat.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-16",
    title: "Swirl",
    description:
      "Our signature cake with beautiful blue swirl decoration. Perfect for birthdays and special celebrations.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  },
  {
    id: "loaf-17",
    title: "Flowers",
    description:
      "A delicate cake adorned with handcrafted buttercream flowers. Ideal for weddings and elegant occasions.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",

  },
  {
    id: "loaf-18",
    title: "Mixer",
    description:
      "Our specialty cake with a mix of flavors and decorative elements for those who want a bit of everything.",
    image: "/images/coconut-cake.png",
    price: 1200,
    product: "loaves",
  }
];


export const useProductStore = create<ProductStore>((set, get) => ({
  products: mockProducts,

  getProductsByType: (type) => {
    return get().products.filter((product) => product.product === type);
  },

  getProductById: (id) => {
    return get().products.find((product) => product.id === id);
  }
}));