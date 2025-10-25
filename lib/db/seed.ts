import { prisma } from './prisma'

// Define product data directly to avoid image import issues
const SIGNATURE_CAKES = [
  {
    image: '/assets/images/5.webp',
    title: "Butterfly",
    desc: "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
  },
  {
    image: '/assets/images/36.webp',
    title: "Flower Adorned",
    desc: "'Flower Adorned' is a 4 layered buttercream covered cake, dressed to fade two colours together seamlessly.",
  },
  {
    image: '/assets/images/4.webp',
    title: "Russian Tip",
    desc: "'Russian Tip' is a 4 layered buttercream covered cake, decorating the top with Russian tip piping nozzle to create simple yet elegant flowers.",
  },
  {
    image: '/assets/images/37.webp',
    title: "Slant",
    desc: "'Slant' is a 4 layered buttercream covered cake, decorating with gold leaf and shredded coconut.",
  },
]

const WEDDING_CAKES = [
  {
    image: '/assets/images/33.webp',
    title: "Harmony",
    desc: "'Harmony' is a beautifully buttercream covered cake highlighted with Pearls."
  },
  {
    image: '/assets/images/7.webp',
    title: "Flowery",
    desc: "'Flowery' is a fondant covered cake adorned with several flowers."
  },
  {
    image: '/assets/images/40.webp',
    title: "Angel",
    desc: "'Angel' a fondant covered two tier wedding cake."
  },
  {
    image: '/assets/images/41.webp',
    title: "Gold Ring",
    desc: "'Gold Ring' two tier wedding cake, can be covered in buttercream or fondant."
  }
]

const VALENTINE_CAKES = [
  {
    image: '/assets/images/34.webp',
    title: "Heart Shape",
    desc: "'Heart Shape' is a 2 layered buttercream covered cake representing the flowers and love during the valentine season. ",
  },
  {
    image: '/assets/images/42.webp',
    title: "Heart Spread",
    desc: "'Heart Spread' is a 3 layered buttercream covered cake inspired by the red, hearts and love of the valentine spirit.",
  },
]

const KIDS_CAKES = [
  {
    image: '/assets/images/13.webp',
    title: "Baby Shark",
    desc: "'Baby Shark' is a 4 layered baby Shark inspired buttercream covered cake."
  },
  {
    image: '/assets/images/38.webp',
    title: "Unicorn",
    desc: "'Unicorn' is a 2 layered buttercream covered cake inspired by the fictional magical creature."
  },
  {
    image: '/assets/images/39.webp',
    title: "Cocomelon",
    desc: "'Cocomelon' is a 4 layered cocomelon inspired buttercream covered cake."
  }
]

const HOLIDAY_CAKES = [
  {
    image: '/assets/images/35.webp',
    title: "Christmas Tree",
    desc: "'Christmas Tree' is a buttercream covered cake inspired by the idea of a Christmas tree decorated with ornaments.  ",
  },
  {
    image: '/assets/images/43.webp',
    title: "Jolly Christmas",
    desc: "'Jolly Christmas' is a 3 layered buttercream covered cake inspired by the colours and celebration of Christmas.",
  },
]

const LOAVES = [
  {
    image: '/assets/images/56.webp',
    title: "Coconut Loaf Cake",
    desc: "Our coconut loaf cake is moist and fluffy, infused with rich coconut flavor, making it the perfect tropical treat."
  },
  {
    image: '/assets/images/57.webp',
    title: "Fruity Loaf Cake",
    desc: "Our fruity loaf cake is soft and moist, filled with bursts of sweet, tangy fruits, making it a perfectly refreshing treat for any time of day."
  },
  {
    image: '/assets/images/58.webp',
    title: "Plain Loaf Cake",
    desc: "Our plain loaf cake is soft and buttery, offering a simple yet delicious sweet treat that's perfect on its own or paired with your favorite spread."
  },
  {
    image: '/assets/images/59.webp',
    title: "Marble Loaf Cake",
    desc: "Our marble loaf cake is a soft, moist treat with a beautiful swirl of rich chocolate and vanilla, offering a perfect blend of flavors in every slice."
  },
  {
    image: '/assets/images/60.webp',
    title: "Family Loaf Bread",
    desc: "Our family loaf bread is soft, hearty, and baked to perfection, offering a wholesome taste that brings everyone together at the table."
  },
  {
    image: '/assets/images/61.webp',
    title: "Mini Loaf Bread",
    desc: "Our mini loaf bread is delightfully soft and perfectly portioned, offering a fresh, homemade taste in every bite-sized loaf."
  },
  {
    image: '/assets/images/62.webp',
    title: "Sardine Bread",
    desc: "Our sardine bread is soft and savory, filled with rich, flavorful sardines, creating the perfect blend of comfort and indulgence in every bite."
  },
  {
    image: '/assets/images/63.webp',
    title: "Coconut Bread",
    desc: "Our coconut bread is soft and fluffy, infused with rich coconut flavor, making it the perfect tropical treat."
  },
  {
    image: '/assets/images/64.webp',
    title: "Plain Bread",
    desc: "Our plain bread is soft and hearty, offering a simple yet delicious taste that's perfect for any meal."
  }
]

const OTHERS_ITEMS = [
  {
    image: '/assets/images/20.webp',
    title: "Coconut Cupcakes",
    desc: "Our coconut cupcakes are moist, and bursting with coconut flavor, topped with a creamy frosting for the perfect sweet indulgence.",
  },
  {
    image: '/assets/images/21.webp',
    title: "Chocolate Cupcakes",
    desc: "Our chocolate cupcakes are rich, moist, and decadently chocolaty, topped with a smooth, velvety frosting for the ultimate treat.",
  },
  {
    image: '/assets/images/22.webp',
    title: "Marble Cupcakes",
    desc: "Our marble cupcakes are perfect swirls of rich chocolate and sweet vanilla, creating a flavorful treat with a beautiful swirl in its classic.",
  },
  {
    image: '/assets/images/23.webp',
    title: "Plain Cupcakes",
    desc: "Our plain cupcakes are soft, light, and delicately sweet, offering a simple yet delightful treat perfect for any occasion.",
  },
  {
    image: '/assets/images/24.webp',
    title: "Red Velvet Cupcakes",
    desc: "Our red velvet cupcakes are soft and velvety, with a rich, subtle cocoa flavor and topped with a smooth, creamy cream cheese frosting.",
  },
  {
    image: '/assets/images/25.webp',
    title: "Vanilla Cupcakes",
    desc: "Our vanilla cupcakes are light, fluffy with pure vanilla flavor, topped with rich, vanilla frosting for a classic and comforting treat.",
  },
  {
    image: '/assets/images/26.webp',
    title: "Swirl",
    desc: "'Christmas Treat' is a buttercream covered cake inspired by the blue & Christmas theme and decorated with ornaments.",
  },
  {
    image: '/assets/images/27.webp',
    title: "Flowers",
    desc: "'Flowers' is a buttercream covered cake decorated with beautiful flowers.",
  },
  {
    image: '/assets/images/29.webp',
    title: "Bento Cake",
    desc: "Our bento cakes are small, cute, and perfect for individual servings.",
  },
  {
    image: '/assets/images/30.webp',
    title: "Mini Cake",
    desc: "Our mini cakes are perfect for small celebrations and individual treats.",
  },
  {
    image: '/assets/images/31.webp',
    title: "Special Cake",
    desc: "Our special cakes are custom-made for your unique occasions.",
  }
]

const categories = [
  {
    name: 'Signature Cakes',
    slug: 'signature-cakes',
    description: 'Unique, Handcrafted, Signature Cakes.',
    image: '/images/signature-cakes.jpg'
  },
  {
    name: 'Wedding Cakes',
    slug: 'wedding-cakes',
    description: 'Elegant, Romantic, Wedding Cakes.',
    image: '/images/wedding-cakes.jpg'
  },
  {
    name: 'Valentine Cakes',
    slug: 'valentine-cakes',
    description: 'Romantic, Love-themed Cakes.',
    image: '/images/valentine-cakes.jpg'
  },
  {
    name: 'Kids Cakes',
    slug: 'kids-cakes',
    description: 'Fun, Colorful, Kids\' Cakes',
    image: '/images/kids-cakes.jpg'
  },
  {
    name: 'Holiday Cakes',
    slug: 'holiday-cakes',
    description: 'Festive, Flavorful, Holiday Cakes.',
    image: '/images/holiday-cakes.jpg'
  },
  {
    name: 'Loaves',
    slug: 'loaves',
    description: 'Fresh, Homemade Loaf Cakes and Breads.',
    image: '/images/loaves.jpg'
  },
  {
    name: 'Others',
    slug: 'others',
    description: 'Cupcakes, Bento Cakes, and more.',
    image: '/images/others.jpg'
  }
]

const productData = {
  'signature-cakes': SIGNATURE_CAKES,
  'wedding-cakes': WEDDING_CAKES,
  'valentine-cakes': VALENTINE_CAKES,
  'kids-cakes': KIDS_CAKES,
  'holiday-cakes': HOLIDAY_CAKES,
  'loaves': LOAVES,
  'others': OTHERS_ITEMS
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create categories
    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      })
      console.log(`✅ Category created/updated: ${category.name}`)
    }

    // Create products for each category
    for (const [categorySlug, products] of Object.entries(productData)) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      })

      if (!category) {
        console.warn(`⚠️ Category not found: ${categorySlug}`)
        continue
      }

      for (const product of products) {
        await prisma.product.upsert({
          where: {
            title_categoryId: {
              title: product.title,
              categoryId: category.id
            }
          },
          update: {
            description: product.desc,
            image: product.image,
            isActive: true
          },
          create: {
            title: product.title,
            description: product.desc,
            image: product.image,
            categoryId: category.id,
            isActive: true
          }
        })
      }
      console.log(`✅ Products created/updated for: ${category.name}`)
    }

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
} 