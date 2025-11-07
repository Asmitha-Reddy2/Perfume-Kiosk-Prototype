// ...existing code...
# Perfume Kiosk Prototype

A full-stack prototype of a perfume vending kiosk with a React + Vite frontend and an Express backend. The app demonstrates order creation, payment via Razorpay (test mode), webhook-based confirmation, and a simulated hardware dispatch flow.

## Quick start (local)

Prerequisites:
- Node 18+
- npm

1. Backend
```sh
cd backend
npm install
# create backend/.env (see below)
npm start
```
Backend runs on http://localhost:3001 by default. See [backend/index.js](backend/index.js).

2. Frontend
```sh
cd frontend
npm install
npm run dev
```
Frontend dev server runs on port 5000 (Vite). See [frontend/vite.config.js](frontend/vite.config.js).

## Environment variables

Create `backend/.env` with Razorpay test credentials:
```
RAZORPAY_KEY_ID=<test_key_id>
RAZORPAY_KEY_SECRET=<test_key_secret>
RAZORPAY_WEBHOOK_SECRET=<webhook_secret>
```
Without keys, order creation will fail (`backend/index.js` checks for these).

## How the flow works (short)

- User selects perfume and pumps in the UI (state managed by [`useKioskStore`](frontend/src/store/kioskStore.js)).
- Frontend calls `/api/create-order` (see [`createOrderApi`](frontend/src/lib/api.js)).
- Backend creates a Razorpay payment link and returns a QR code ([backend/index.js](backend/index.js)).
- Razorpay sends a `payment_link.paid` webhook to `/api/webhook/razorpay` → backend verifies signature and marks order PAID.
- Frontend polls `/api/status/:orderId` to detect payment and advances to dispense screen.
- User triggers dispatch; backend validates payment and simulates hardware (`backend/mock_db.js` + dispatch route in [backend/index.js](backend/index.js)).

## Replit / Deployment

This repo includes a Replit config (`.replit`) and a Replit setup guide ([REPLIT_SETUP.md](REPLIT_SETUP.md)). On Replit the frontend runs on port 5000 and backend on 3001; Vite proxies `/api/*` to the backend (see [frontend/vite.config.js](frontend/vite.config.js)).

## Useful files & symbols
- App entry: [frontend/src/main.jsx](frontend/src/main.jsx)  
- State store: [`useKioskStore`](frontend/src/store/kioskStore.js)  
- API client: [frontend/src/lib/api.js](frontend/src/lib/api.js)  
- Backend server: [backend/index.js](backend/index.js)  
- Mock DB: [backend/mock_db.js](backend/mock_db.js)  
- Vite config / proxy: [frontend/vite.config.js](frontend/vite.config.js)

If you want specific edits (add instructions, examples, or screenshots), tell me which