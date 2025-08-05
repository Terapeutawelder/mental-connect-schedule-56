# Replit.md - Conexão Mental Platform

## Overview

Conexão Mental is a full-stack telehealth platform for mental health in Brazil. Its core purpose is to connect patients with mental health professionals for video consultations and provide comprehensive management tools for all stakeholders (patients, professionals, and administrators). The platform aims to revolutionize access to mental healthcare through a user-friendly, secure, and efficient online environment, offering diverse therapeutic approaches and flexible scheduling.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred language: Portuguese (pt-BR) - Always communicate in Portuguese.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: React hooks and Context API
- **Data Fetching**: TanStack Query
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod validation schemas
- **UI/UX Decisions**:
    - Consistent purple gradient (#020817, purple-600/700) color scheme throughout.
    - Glass morphism and backdrop blur effects for modern UI elements.
    - Responsive design across all pages and components.
    - Standardized button styles and hover effects.
    - Side-by-side layout for login pages with immersive background images.
    - Elegant dashboards with statistical cards and functional sections.
    - Streamlined professional registration with multi-step forms and visual feedback.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Session-based authentication with connect-pg-simple
- **API Design**: RESTful API (`/api/v1`) with Bearer token authentication and granular permissions.
- **Real-time Communication**: WebSocket for live updates.

### Project Structure
- `/client`: React frontend application
- `/server`: Express.js backend API
- `/shared`: Shared types and database schema
- `/migrations`: Database migration files

### Key Features & Implementations
- **Multi-Role Authentication**: Patient, professional, and admin roles with secure login and approval workflows.
- **Video Consultation System**: WebRTC-based video calling with media recording.
- **Appointment Management**: Online scheduling, availability management, and notification system.
- **Professional Dashboard**: Personal agenda, profile management, and marketing tools (Canva templates).
- **Admin Dashboard**: System monitoring, user/professional/appointment management, and API key/webhook configuration.
- **Dynamic Data Synchronization**: Real-time updates across professional profile and registration.
- **API and Webhook Integrations**: Extensible `/api/v1` with API keys and webhook events for external system integration.

## External Dependencies

- **Database**: Neon Database (PostgreSQL hosting)
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Media Processing**: Hugging Face Transformers (for background removal in video calls - planned, not fully integrated in given logs)
- **Notifications**: WhatsApp API (for appointment notifications - planned)
- **Payment Processing**: Mercado Pago (planned integration)
- **External Integration Platforms**: N8N, Zapier, AI agents (via exposed API)