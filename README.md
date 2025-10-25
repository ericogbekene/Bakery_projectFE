# 🎂 MC Cakes - Bakery Management System

A modern, full-stack bakery management system built with Next.js 15, TypeScript, PostgreSQL, and Prisma.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse cakes, loaves, pastries, and other bakery items
- **Category Filtering**: Filter products by category (Signature Cakes, Wedding Cakes, etc.)
- **Product Details**: View detailed product information with images and descriptions
- **Order Management**: Place custom orders with specifications
- **Responsive Design**: Mobile-first responsive design

### 🏪 Admin Features
- **Product Management**: Full CRUD operations for products
- **Category Management**: Create, update, and delete product categories
- **Admin Dashboard**: Intuitive interface for managing bakery operations
- **Real-time Updates**: Live data updates with caching

### 🔧 Technical Features
- **RESTful API**: Complete API with OpenAPI/Swagger documentation
- **Database Integration**: PostgreSQL with Prisma ORM
- **Caching**: In-memory caching for improved performance
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form management with validation

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **Zod**: Schema validation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Turbopack**: Fast bundler (development)

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── products/      # Product management API
│   │   ├── categories/    # Category management API
│   │   └── docs/          # API documentation
│   ├── admin/             # Admin dashboard
│   ├── menu/              # Product catalog pages
│   └── (other pages)      # Customer-facing pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── shared/           # Shared layout components
│   ├── home/             # Home page components
│   └── admin/            # Admin-specific components
├── lib/                  # Utility libraries
│   ├── db/              # Database configuration
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── constants/            # Application constants
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bakery_projectFE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL service
   sudo service postgresql start
   
   # Create database and user
   sudo -u postgres psql -c "CREATE DATABASE bakery_db;"
   sudo -u postgres psql -c "CREATE USER bakery_user WITH PASSWORD 'bakery_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bakery_db TO bakery_user;"
   ```

5. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - API Documentation: http://localhost:3000/api-docs
   - Raw API Spec: http://localhost:3000/api/docs

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Available Endpoints

#### Products
- `GET /products` - Get all products
- `POST /products` - Create a new product
- `GET /products/{id}` - Get a specific product
- `PUT /products/{id}` - Update a product
- `DELETE /products/{id}` - Delete a product

#### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create a new category
- `GET /categories/{slug}` - Get a specific category
- `PUT /categories/{slug}` - Update a category
- `DELETE /categories/{slug}` - Delete a category

### Interactive Documentation
Visit http://localhost:3000/api-docs for interactive API documentation with Swagger UI.

## 🗄️ Database Schema

### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  price DECIMAL(10,2),
  categoryId TEXT NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# All tests with coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/           # Unit tests for utilities and hooks
├── integration/    # API integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data and mocks
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="production"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Docker Deployment
```bash
# Build Docker image
docker build -t bakery-app .

# Run container
docker run -p 3000:3000 bakery-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@bakery.com
- Documentation: http://localhost:3000/api-docs

---

**Built with ❤️ for the bakery industry**
