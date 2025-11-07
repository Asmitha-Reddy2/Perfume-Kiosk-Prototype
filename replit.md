# Perfume Kiosk Prototype

## Overview

This is a full-stack perfume vending kiosk application that allows customers to select perfumes, customize quantities, and complete payments through an integrated payment gateway. The system simulates a physical kiosk experience with payment processing and order dispatch functionality.

**Core Purpose**: Provide a complete mock vending kiosk experience for perfume dispensing with real payment integration (test mode) and hardware simulation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with Vite build tool

**State Management**: Zustand for global state management
- Centralized store (`kioskStore.js`) manages the complete user flow
- Tracks current screen, selected perfume, pump quantity, and order status
- Handles state transitions: SELECT → PAYMENT → DISPENSE → COMPLETE

**Styling Approach**: Tailwind CSS with dynamic theming
- Dark theme as base with custom color palette
- Dynamic theme variants that change based on selected perfume (ocean_blue, rose_mist, night_amber)
- Uses `tailwind-variants` library for component variant management
- Custom animations for pulse effects and transitions

**Data Fetching**: TanStack React Query (v5)
- Manages server state and API calls
- Handles polling for order status updates during payment verification
- Provides automatic caching and refetching capabilities

**Component Architecture**:
- Utility-first design with reusable helper functions (`cn` for class merging)
- Centralized API client with axios
- Three main API endpoints: create order, fetch status, dispatch order

### Backend Architecture

**Technology Stack**: Express.js (Node.js) with ES6 modules

**API Design**: RESTful API pattern
- `/api/create-order` - Creates new order and generates payment link
- `/api/status/:orderId` - Retrieves current order status
- `/api/dispatch/:orderId` - Simulates hardware dispatch command
- `/api/webhook/razorpay` - Webhook endpoint for payment verification

**Data Storage**: In-memory mock database
- Simple Map-based storage for prototype purposes
- Stores orders with unique IDs, payment details, and status
- Helper functions for CRUD operations: createOrder, getOrder, updateOrder, findOrderByPaymentLinkId
- **Design Decision**: Chosen for rapid prototyping; production would use PostgreSQL or MongoDB

**Payment Processing**: Razorpay integration (Test Mode)
- Creates payment links for QR code scanning
- Webhook-based payment verification using signature validation
- Automatic order status updates from 'CREATED' → 'PAID'
- Requires public URL exposure for webhook reception (via localtunnel or similar)

**Security Considerations**:
- Webhook signature verification using HMAC SHA256
- Raw body parsing for webhook route to preserve signature integrity
- Environment variable configuration for sensitive credentials
- CORS enabled for frontend-backend communication

### Development Environment

**Multi-Process Architecture**:
- Frontend runs on port 5000 (public-facing webview)
- Backend runs on port 3001 (internal API server)
- Vite proxy forwards `/api/*` requests from frontend to backend
- Enables seamless development without CORS issues

**Configuration**:
- Frontend uses Vite with HMR (Hot Module Replacement)
- Path aliases configured (`@` points to `src` directory)
- Host set to `0.0.0.0` with `allowedHosts: true` for Replit proxy compatibility

### Data Flow

1. **Order Creation**: User selects perfume and pumps → Frontend sends request → Backend calculates price, creates Razorpay payment link, stores order → Returns order with QR code URL
2. **Payment Processing**: User scans QR and pays → Razorpay sends webhook → Backend verifies signature, updates order status → Frontend polls status endpoint and detects payment
3. **Dispatch Simulation**: After payment confirmed → User triggers dispatch → Backend logs hardware command → Frontend shows completion screen

## External Dependencies

### Payment Gateway
- **Razorpay**: Payment processing platform (Test Mode)
  - SDK: `razorpay` npm package (v2.9.4)
  - Requires: Key ID, Key Secret, Webhook Secret
  - Creates payment links with QR codes for mobile scanning
  - Webhook URL must be publicly accessible for payment verification

### Third-Party Services for Development
- **Localtunnel** (or similar): Exposes local backend to internet for webhook reception
  - Required because Razorpay webhooks need a public HTTPS endpoint
  - Alternative options: ngrok, cloudflared

### Core Backend Dependencies
- **express**: Web framework (v4.19.2)
- **cors**: Cross-origin resource sharing middleware
- **body-parser**: Request body parsing (includes raw parser for webhooks)
- **dotenv**: Environment variable management
- **uuid**: Unique order ID generation
- **axios**: HTTP client for potential external API calls
- **crypto**: Built-in Node.js module for webhook signature verification

### Core Frontend Dependencies
- **react** & **react-dom**: UI library (v18.2.0)
- **@tanstack/react-query**: Server state management (v5.45.1)
- **zustand**: Client state management (v4.5.2)
- **axios**: HTTP client for API calls (v1.7.2)
- **lucide-react**: Icon library (v0.395.0)
- **tailwindcss**: Utility-first CSS framework (v3.4.4)
- **tailwind-variants**: Type-safe variant API for Tailwind (v0.2.1)
- **clsx** & **tailwind-merge**: Conditional class name utilities

### Build Tools
- **Vite**: Fast build tool and dev server (v5.2.0)
- **@vitejs/plugin-react**: React plugin for Vite with Fast Refresh
- **PostCSS** & **autoprefixer**: CSS processing

### Environment Configuration
Backend requires `.env` file with:
```
RAZORPAY_KEY_ID=<test_key_id>
RAZORPAY_KEY_SECRET=<test_key_secret>
RAZORPAY_WEBHOOK_SECRET=<webhook_secret>
```