# Draw to Video - Professional Cinema-Grade Video Generation Platform

## Overview

Draw to Video is a professional-grade React-based web application that transforms sketches into cinematic AI-generated videos. Designed to compete with industry leaders like Higgsfield AI, the platform offers zero-prompt visual direction, 50+ professional camera presets, and Hollywood-style motion controls. Users upload images and draw movement instructions directly on a professional canvas to guide video generation without any text prompts.

The application targets content creators, filmmakers, marketers, and visual artists who demand cinema-quality AI video generation. Key features include modern gradient dark theme UI, professional drawing tools with sequence numbering (1,2,3), 50+ camera movement presets (dolly shots, crane movements, FPV drone footage), and instant HD video generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for lightning-fast development
- **UI Design**: Professional gradient dark theme matching industry standards (Higgsfield-inspired)
- **UI Components**: shadcn/ui component library with custom cinema-grade styling
- **Styling**: Tailwind CSS with dark theme variables and gradient designs
- **State Management**: TanStack Query for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Professional Canvas**: HTML5 Canvas with sequence numbering, 50+ camera presets, and motion tracking
- **File Upload**: Drag-and-drop with professional upload interface

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
- **Professional Tools**: Select, movement arrows, action text, focus circles, frame rectangles
- **Sequence Numbering**: 1,2,3 annotation system for action ordering
- **50+ Camera Presets**: Dolly shots, pan movements, tilt sequences, Dutch angles, crane shots
- **Motion Tracking**: Arrow-based movement paths with gradient styling and shadows
- **Real-time Rendering**: Optimistic canvas updates with professional visual feedback
- **Cinema-Grade Output**: HD video generation with professional camera movements

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