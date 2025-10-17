# Radio Congreso - Plataforma Digital de Transmisión Legislativa

## Overview

Radio Congreso is a comprehensive digital platform for the Mexican Congress built with Next.js 15, React 19, and PostgreSQL. The application serves as the official broadcasting platform for legislative content, providing live streaming capabilities for congressional sessions, radio programming, news management, and transparency portals.

The platform features a content management system for administrators to manage news articles, radio programs, live streams, and legislative information. It includes multiple transmission channels (45.1, 45.2, 45.3), live radio streaming with HLS support, and a responsive design optimized for mobile, tablet, and desktop devices.

## Recent Changes (October 2025)

### Transparency Portal Redesign - Button Update & Hydration Fix
- **Button Design Enhancement**: Redesigned card buttons from circular "+" to pill-shaped "Entra aquí" buttons
  - Gradient pill buttons (purple to fuchsia) with "+ Entra aquí" text
  - Visual connecting line from button to card title
  - Hover effects with scale transform and enhanced shadows
  - Improved accessibility with descriptive ARIA labels
- **React Hydration Fix**: Resolved critical loading state bug in transparency page
  - Removed loading state to prevent server/client hydration mismatch
  - Page now renders immediately and populates data via client-side fetch
  - Fixed "Cargando..." infinite loop issue
- **Instagram Icon SVG Fix**: Replaced malformed Instagram SVG path in footer
- Redesigned all transparency cards using pure CSS/Tailwind (removed PNG dependencies)
- Implemented unified TransparencyCard component with:
  - Gradient pill-shaped headers (purple to fuchsia)
  - Dark indigo/purple gradient body with rounded borders
  - Shadow and glow effects for visual depth
  - Pill-shaped "Entra aquí" button with connecting line to title
  - Support for both descriptive text and downloadable file lists
- Applied consistent design across all 7 transparency sections with responsive grid layouts:
  - Información de Utilidad Pública (3-column grid)
  - Estructura y Presupuesto (3-column grid)
  - Normatividad (3-column grid)
  - Compromisos con la Transparencia (3-column grid)
  - Transparencia Focalizada (3-column grid)
  - Datos Abiertos (3-column grid)
  - Acerca de Nosotros (4-column grid)
- Added comprehensive accessibility features:
  - ARIA labels for screen readers
  - Visible focus styles for keyboard navigation
  - Semantic HTML structure
- Fixed Date serialization in transparency sections API for proper JSON responses

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS with shadcn/ui components and Radix UI primitives
- **State Management**: React Context for floating player and mobile menu state
- **Authentication**: JWT-based authentication with HTTP-only cookies
- **File Handling**: Custom file upload system with local storage in `/public/uploads/`

### Backend Architecture
- **API Routes**: Next.js API routes following RESTful conventions
- **Database**: PostgreSQL with direct connection pooling
- **Authentication Middleware**: JWT verification protecting `/admin` routes
- **File Serving**: Custom file API endpoint for serving uploaded content
- **Auto-publishing**: Scheduled content publishing system with background jobs

### Content Management System
- **News Management**: Rich text editor with markdown support, categorization, and scheduled publishing
- **Radio Programs**: Episode management with audio file uploads and program organization
- **Live Streams**: Multi-channel streaming configuration with HLS support
- **User Management**: Role-based access control for administrators and content managers

### Media Streaming
- **Audio Streaming**: HLS.js for live radio streams with fallback support
- **Video Streaming**: Multiple channel configuration (45.1, 45.2, 45.3) with live status monitoring
- **File Storage**: Local file system storage with API-based serving

### Database Schema
The PostgreSQL database includes tables for:
- Users (authentication and roles)
- News articles with categories and scheduling
- Radio programs and episodes
- Live streams and channels
- Parliamentary groups and legislators
- Organs and transparency information

### Security Features
- JWT token authentication with secure cookie storage
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting for API endpoints
- CORS protection and secure headers

## External Dependencies

### Core Dependencies
- **Next.js 15**: React framework with App Router
- **React 19**: UI library with latest features
- **PostgreSQL**: Primary database with pg driver
- **TypeScript**: Static typing throughout the application

### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component system

### Media Processing
- **HLS.js**: HTTP Live Streaming for audio/video playback
- **@uiw/react-md-editor**: Rich text editing capabilities

### Authentication & Security
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **nodemailer**: Email functionality for contact forms

### Development Tools
- **autoprefixer**: CSS vendor prefixing
- **postcss**: CSS processing
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility

### Third-party Integrations
- **Email Service**: Configurable SMTP for contact form submissions
- **Social Media**: Integration with WhatsApp, Facebook, and Twitter/X
- **VOD Platform**: Integration with Canal del Congreso VOD service for legislator search
- **External Transparency Portal**: Links to official transparency website

The application is designed for deployment on cloud platforms with support for environment-based configuration and automatic scaling capabilities.