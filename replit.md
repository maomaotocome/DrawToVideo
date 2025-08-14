# Draw to Video - Interactive Video Generation Platform

## Overview

Draw to Video is a React-based web application that allows users to create AI-generated videos through visual interaction. Users upload an image and draw annotations (arrows, shapes, text) directly on the canvas to guide video generation. The platform addresses the limitations of text-to-video AI tools by providing an intuitive, visual approach to content creation that eliminates prompt engineering frustration.

The application serves content creators, educators, marketers, and filmmakers who need precise control over AI video generation without technical expertise. Key features include drag-and-drop image upload, interactive canvas with drawing tools, real-time annotation tracking, and high-quality video output.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Canvas Implementation**: HTML5 Canvas API for drawing interactions
- **File Upload**: Uppy.js with dashboard modal for file management

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

### Canvas and Annotation System
- **Drawing Tools**: Select, pen, arrow, text, rectangle, and circle tools
- **Annotation Types**: Structured annotation objects with type-specific data
- **Real-time Updates**: Optimistic updates with server synchronization
- **Undo/Redo**: Canvas history management for user actions
- **Export**: Canvas-to-image conversion for AI processing

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