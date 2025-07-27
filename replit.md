# Street Food Marketplace - Replit MD

## Overview

This is a full-stack web application for a street food raw materials marketplace that connects street food vendors with suppliers. The application allows vendors to browse and order raw materials, suppliers to list products and manage orders, and includes an admin panel for system management.

## User Preferences

Preferred communication style: Simple, everyday language.
UI Design preference: Beautiful, modern design with background images and advanced features.
Target audience: Hindi/Urdu speaking street food vendors and suppliers.
Authentication preference: Enhanced login pages with themed backgrounds showing app authenticity.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and building
- **Authentication**: Local storage-based authentication with role-based access control

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API**: RESTful API with JSON responses
- **Session Management**: In-memory storage for development (extensible to database)

## Key Components

### Authentication System
- Role-based authentication supporting three user types: vendors, suppliers, and admins
- Simple password-based authentication (development setup)
- Client-side route protection based on user roles
- Persistent sessions using localStorage

### Database Schema
- **Users**: Stores vendor, supplier, and admin accounts with role-specific fields
- **Products**: Raw materials catalog with pricing, stock, and supplier information
- **Orders**: Order management with status tracking
- **Order Items**: Detailed order line items
- **Cart Items**: Shopping cart functionality for vendors

### User Roles and Features

#### Street Food Vendors
- Browse available raw materials by category
- Add products to cart with quantity selection
- Place orders and track order status
- View order history
- Group ordering functionality (UI placeholder)

#### Suppliers
- Add and manage product listings with images
- Set pricing, stock levels, and minimum order quantities
- View and fulfill incoming orders
- Track sales analytics
- Manage product inventory

#### Admin Panel
- User management (vendors and suppliers)
- Order monitoring across the platform
- User status management (active/suspended/pending)
- System-wide analytics and reporting

## Data Flow

1. **Authentication Flow**: Users authenticate via role-specific login pages, credentials are validated against the database, and successful authentication stores user data in localStorage
2. **Product Management**: Suppliers create products that are stored in the database and displayed to vendors through the products API
3. **Shopping Cart**: Vendors add items to cart (stored per vendor), cart persists across sessions
4. **Order Processing**: Cart items are converted to orders with multiple order items, orders are tracked through status updates
5. **Admin Operations**: Admins can view and modify user statuses, monitor all orders, and access system-wide data

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with TypeScript support
- **UI Components**: Comprehensive Radix UI component set via Shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: TanStack React Query for API calls
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React icon library

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Development Server**: Vite dev server with HMR support
- **Database Migrations**: Drizzle Kit for schema management

## Deployment Strategy

### Development Environment
- Uses Vite development server with Express backend
- Hot module replacement for rapid development
- In-memory storage for development data persistence
- Replit-specific development tools and error handling

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild compiles TypeScript server to `dist/index.js`
- Database: Uses Neon Database with connection pooling
- Environment: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Database Configuration
- Drizzle ORM with PostgreSQL dialect
- Schema defined in `shared/schema.ts` for type safety across frontend and backend
- Migrations managed through Drizzle Kit
- Connection to Neon Database for serverless PostgreSQL

The application is designed to be easily deployable on platforms supporting Node.js with the ability to connect to external PostgreSQL databases. The shared schema approach ensures type consistency between client and server code.

## Recent Changes (January 2025)

### Enhanced UI Design
- Added beautiful themed background images to all login pages
- Vendor auth: Street food themed with gradient backgrounds and food emojis
- Supplier auth: Warehouse/supply chain themed with business-focused design
- Admin auth: Professional admin panel design with security-focused styling
- Each login page includes feature highlights and authentic app branding

### Improved Homepage
- Modern gradient background design
- Hindi/Urdu text integration for target market appeal
- Enhanced role selection cards with hover effects and animations
- Added platform statistics and feature highlights
- Professional "Why Choose Our Platform" section with trust indicators

### Team Zipp Up Welcome Page
- Updated team name from "ZUPP UP" to "ZIPP UP" 
- Added team member names in specified order: Diya Agarwal (Team Lead), Vijay Jangid (Developer), Garvita Agarwal (Designer), Harshita Gehlot (Analyst), Karan Purohit (Developer)
- Added note explaining this is a temporary welcome introduction showcasing team collaboration
- Enhanced with animated team member cards and professional presentation

### Enhanced Visual Design
- Added marketplace-relevant background images to all role selection cards
- Street Vendor card: Street food scene background
- Supplier card: Warehouse/supply chain background  
- Admin card: Professional office environment background
- Consistent glassmorphism effects and backdrop blur across all pages
- Unified animation system with fade-in, slide-up, and bounce effects

### Advanced Features Added
- Backdrop blur effects for modern glassmorphism design
- Gradient buttons with hover states
- Enhanced typography and spacing
- Responsive design improvements
- Professional authentication flows with better UX
- Comprehensive CSS animation library for consistent effects

### Database Integration
- Complete PostgreSQL database setup with Neon Database
- Automated database seeding with sample data on server startup
- Admin credentials: admin@streetmarket.com / admin123
- Sample suppliers and vendors with realistic product catalog
- 8 sample products across different categories (spices, grains, vegetables, oils)

### Technical Improvements
- Fixed all TypeScript errors and module import issues
- Resolved JSX structure problems
- Improved component organization and styling consistency
- Enhanced error handling and user feedback
- Better integration of authentication flows
- Complete end-to-end functionality from database to frontend