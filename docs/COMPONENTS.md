# 🧩 Components Documentation

This document provides detailed information about all components in the Bakery application.

## 📁 Component Structure

```
components/
├── ui/                    # Base UI components (Shadcn/UI)
├── shared/               # Shared layout components
├── home/                 # Home page specific components
├── admin/                # Admin dashboard components
└── layout/               # Layout components (header, footer)
```

## 🎨 UI Components

### Button (`components/ui/button.tsx`)
A customizable button component built with Radix UI primitives.

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- `asChild`: boolean - Renders as child component
- All standard button HTML attributes

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  Click me
</Button>
```

### Input (`components/ui/input.tsx`)
A styled input component for forms.

**Props:**
- All standard input HTML attributes

**Usage:**
```tsx
import { Input } from '@/components/ui/input'

<Input type="text" placeholder="Enter your name" />
```

### Label (`components/ui/label.tsx`)
An accessible label component.

**Props:**
- `htmlFor`: string - ID of the associated form control
- All standard label HTML attributes

**Usage:**
```tsx
import { Label } from '@/components/ui/label'

<Label htmlFor="name">Name</Label>
<Input id="name" />
```

### Textarea (`components/ui/textarea.tsx`)
A styled textarea component for multi-line text input.

**Props:**
- All standard textarea HTML attributes

**Usage:**
```tsx
import { Textarea } from '@/components/ui/textarea'

<Textarea placeholder="Enter your message" rows={4} />
```

## 🏗️ Shared Components

### Container (`components/shared/container.tsx`)
A responsive container component that provides consistent spacing and max-width.

**Props:**
- `children`: ReactNode - Content to render inside container
- `className`: string - Additional CSS classes

**Usage:**
```tsx
import Container from '@/components/shared/container'

<Container className="py-8">
  <h1>Page Content</h1>
</Container>
```

### MenuHero (`components/shared/menu-hero.tsx`)
A hero section component for menu pages with background image and title.

**Props:**
- `title`: string - Hero title
- `subtitle`: string - Hero subtitle (optional)

**Usage:**
```tsx
import MenuHero from '@/components/shared/menu-hero'

<MenuHero 
  title="Our Cakes" 
  subtitle="Delicious handmade cakes" 
/>
```

## 🏠 Home Components

### CallToAction (`components/home/call-to-action.tsx`)
A call-to-action section with buttons and promotional content.

**Features:**
- Responsive design
- Multiple action buttons
- Background styling

### Categories (`components/home/categories.tsx`)
Displays product categories in a grid layout.

**Features:**
- Category cards with images
- Hover effects
- Navigation links

### ClientTestimonials (`components/home/client-testimonials.tsx`)
Shows customer testimonials in a carousel or grid.

**Features:**
- Testimonial cards
- Customer ratings
- Responsive layout

### FeaturedProducts (`components/home/featured-products.tsx`)
Displays featured products from the database.

**Features:**
- Product cards
- Price display
- Add to cart functionality

### WhyChooseUs (`components/home/why-choose-us.tsx`)
Highlights the bakery's unique selling points.

**Features:**
- Feature cards
- Icons
- Descriptive text

## 🛠️ Admin Components

### ProductForm (`components/admin/ProductForm.tsx`)
A comprehensive form for creating and editing products.

**Props:**
- `product`: ProductWithCategory | null - Product to edit (null for new)
- `onSave`: (data: Partial<ProductWithCategory>) => void - Save callback
- `onCancel`: () => void - Cancel callback
- `loading`: boolean - Loading state

**Features:**
- Form validation
- Category selection dropdown
- Image URL input
- Price input with validation
- Loading states

**Usage:**
```tsx
import ProductForm from '@/components/admin/ProductForm'

<ProductForm
  product={selectedProduct}
  onSave={handleSaveProduct}
  onCancel={handleCancel}
  loading={isSaving}
/>
```

## 🎭 Layout Components

### Header (`components/layout/header.tsx`)
The main navigation header with logo, menu, and cart.

**Features:**
- Responsive navigation
- Mobile menu
- Cart indicator
- Logo display

### Footer (`components/layout/footer.tsx`)
The main footer with links, contact info, and social media.

**Features:**
- Multiple link sections
- Contact information
- Social media links
- Copyright notice

## 🔧 Custom Hooks

### useProducts (`lib/hooks/useProducts.ts`)
A custom React hook for fetching products from the API.

**Parameters:**
- `options.category`: string - Filter by category slug
- `options.limit`: number - Maximum number of products
- `options.offset`: number - Number of products to skip

**Returns:**
- `products`: ProductWithCategory[] - Array of products
- `loading`: boolean - Loading state
- `error`: string | null - Error message
- `refetch`: () => void - Function to refetch data

**Usage:**
```tsx
import { useProducts } from '@/lib/hooks/useProducts'

function ProductList() {
  const { products, loading, error } = useProducts({
    category: 'signature-cakes',
    limit: 10
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## 🎨 Styling Guidelines

### CSS Classes
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing using Tailwind's spacing scale
- Use semantic color names from the design system

### Component Patterns
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow accessibility guidelines
- Use semantic HTML elements

### State Management
- Use React hooks for local state
- Implement proper loading and error states
- Use optimistic updates where appropriate
- Handle edge cases gracefully

## 🧪 Testing Components

### Unit Testing
Each component should have corresponding unit tests:
- Test rendering
- Test user interactions
- Test prop variations
- Test error states

### Integration Testing
Test component interactions:
- Form submissions
- API calls
- Navigation
- State updates

## 📝 Best Practices

1. **Naming**: Use descriptive, semantic names
2. **Props**: Define clear interfaces for all props
3. **Documentation**: Add JSDoc comments for complex components
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Performance**: Optimize re-renders and bundle size
6. **Error Handling**: Implement proper error boundaries
7. **Loading States**: Show appropriate loading indicators
8. **Responsive Design**: Ensure mobile-first approach

## 🔄 Component Lifecycle

1. **Development**: Create component with TypeScript interfaces
2. **Testing**: Write unit and integration tests
3. **Documentation**: Add JSDoc comments and usage examples
4. **Review**: Code review for best practices
5. **Integration**: Integrate with other components
6. **Deployment**: Deploy and monitor performance 