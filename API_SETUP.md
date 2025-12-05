# API Setup Guide

This guide will walk you through setting up the PostgreSQL database and API for the bakery application.

## Prerequisites

1. PostgreSQL installed and running
2. Node.js and npm installed
3. Your Next.js project set up

## Step 1: Install Dependencies

```bash
npm install prisma @prisma/client pg
```

## Step 2: Set up Environment Variables

Create a `.env` file in your project root with the following:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bakery_db"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Replace `username`, `password`, and `bakery_db` with your actual PostgreSQL credentials and database name.

## Step 3: Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Seed the Database

```bash
npx tsx lib/db/seed.ts
```

## Step 5: Test the API

The following API endpoints are now available:

### Get All Products
```
GET /api/products
```

### Get Products by Category
```
GET /api/products?category=signature-cakes
```

### Get Single Product
```
GET /api/products/{id}
```

### Get All Categories
```
GET /api/categories
```

### Get Category with Products
```
GET /api/categories/{slug}?includeProducts=true
```

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": [...],
  "message": "Found 5 products"
}
```

## Using the API in Components

Use the provided hooks in your React components:

```tsx
import { useProducts } from '@/lib/hooks/useProducts'

function SignatureCakesPage() {
  const { products, loading, error } = useProducts({ 
    category: 'signature-cakes' 
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  )
}
```

## Database Schema

### Categories Table
- `id`: Unique identifier
- `name`: Category name
- `description`: Category description
- `slug`: URL-friendly identifier
- `image`: Category image URL
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Products Table
- `id`: Unique identifier
- `title`: Product title
- `description`: Product description
- `image`: Product image URL
- `price`: Product price (optional)
- `categoryId`: Foreign key to categories
- `isActive`: Whether product is active
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Next Steps

1. Update your existing pages to use the API instead of static data
2. Add authentication and authorization
3. Implement product management (CRUD operations)
4. Add image upload functionality
5. Implement caching strategies 