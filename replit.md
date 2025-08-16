# Draw to Video - Professional Cinema-Grade Video Generation Platform

## Overview

Draw to Video is a world-class SaaS platform designed to compete directly with industry leaders like Higgsfield AI for Google's top 5 rankings for "draw to video". The platform transforms simple sketches into viral-quality AI-generated videos through zero-prompt visual direction, targeting the explosive "draw to video" trend on TikTok and Instagram.

Built with professional SaaS design standards, the platform offers a premium user experience with modern gradient interfaces, comprehensive social proof, and conversion-optimized landing pages. Key differentiators include instant 5-10 second video generation, 3 core Hollywood-style camera effects for MVP, and a freemium model designed for viral growth among content creators.

**Current Status**: MVP implementation completed with 3 core P0 features - Zoom In, Orbit, and Pull Back camera effects. Full English interface targeting Google SEO rankings. Professional-grade canvas drawing system with real-time path visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite optimized for SEO performance (<2s load time)
- **Design System**: Premium SaaS template with professional gradient themes and conversion optimization
- **Landing Page**: World-class conversion funnel with social proof, testimonials, and pricing tiers
- **UI Components**: shadcn/ui with custom styling matching top-tier SaaS platforms
- **SEO Optimization**: Structured data, meta tags, and performance metrics targeting Google rankings
- **User Flow**: Landing → Upload → Draw → Generate → Download with viral sharing features
- **Professional Canvas**: Advanced drawing tools with 50+ cinema-grade camera presets
- **Mobile-First**: Responsive design optimized for TikTok/Instagram creators

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Object Storage**: Google Cloud Storage with custom ACL system for file management
- **API Design**: RESTful endpoints following convention-based routing
- **Development Setup**: Replit-optimized configuration with custom middleware

### Data Storage Solutions
- **Database Schema**: Users and Projects tables with JSON annotations field
- **File Storage**: Cloud-based object storage for images and generated videos
- **Schema Management**: Drizzle migrations with PostgreSQL dialect
- **Connection**: Neon Database serverless PostgreSQL for production

### Authentication and Authorization
- **Object ACL System**: Custom access control with group-based permissions
- **File Security**: Presigned URLs for secure upload/download operations
- **API Protection**: Middleware-based request validation and error handling

### Professional Canvas and Motion System
- **Zero-Prompt Interface**: Pure visual direction without text input requirements
- **Canvas Drawing System**: HTML5 canvas with real-time path drawing and arrow indicators
- **3 Core Camera Effects**: Zoom In (push forward), Orbit (circular movement), Pull Back (reveal scene)
- **Path Visualization**: Real-time drawing with directional arrows and undo/clear functionality
- **Motion Tracking**: Visual path feedback with gradient styling and professional indicators
- **Real-time Rendering**: Immediate canvas updates with smooth drawing experience
- **Cinema-Grade Output**: 720p HD video generation with 24fps professional camera movements

## External Dependencies

### Cloud Services
- **Google Cloud Storage**: Object storage for images and videos with integrated authentication via Replit sidecar
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Infrastructure**: Development environment with custom vite plugins and runtime error handling

### UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon library with tree-shaking support
- **Custom Fonts**: Google Fonts integration (Inter, Poppins, Geist Mono)

### File Management
- **Uppy.js**: Modular file upload library with dashboard interface
- **AWS S3 Plugin**: Direct-to-cloud upload functionality
- **File Validation**: Type and size restrictions with progress tracking

### Development Tools
- **TypeScript**: Static type checking with strict configuration
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Drizzle Kit**: Database migration and schema management tools