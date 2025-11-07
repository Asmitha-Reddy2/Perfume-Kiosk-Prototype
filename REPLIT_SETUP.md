# Perfume Kiosk - Replit Setup Guide

This project has been successfully configured to run in the Replit environment.

## Architecture

- **Frontend**: React with Vite, running on port 5000 (webview)
- **Backend**: Express.js API, running on port 3001 (console)
- **Communication**: Vite proxy forwards `/api/*` requests from frontend to backend

## Workflows

Two workflows are configured and running:

1. **frontend**: Vite dev server on 0.0.0.0:5000 (user-facing webview)
2. **backend**: Express server on localhost:3001 (API server)

## Required Configuration

### Razorpay API Keys (Required for Payment Processing)

The application needs Razorpay Test API keys to function. To set them up:

1. Log in to your [Razorpay Test Dashboard](https://dashboard.razorpay.com/app/keys)
2. Create a new set of Test API Keys
3. Update the file `backend/.env` with your keys:
   ```
   RAZORPAY_KEY_ID=your_test_key_id
   RAZORPAY_KEY_SECRET=your_test_key_secret
   RAZORPAY_WEBHOOK_SECRET=my-super-secret-key
   ```
4. Restart the backend workflow to apply the changes

**Note**: Without valid Razorpay keys, order creation will fail with "Authentication failed" errors.

## How It Works

### Development Environment

1. **Frontend** (port 5000):
   - Vite dev server with HMR (Hot Module Replacement)
   - Configured with `allowedHosts: true` for Replit proxy compatibility
   - All API requests to `/api/*` are proxied to the backend

2. **Backend** (port 3001):
   - Express server handling orders and payment processing
   - Uses Razorpay SDK for payment link generation
   - Mock database for order storage (in-memory)

### Deployment

The project is configured for VM deployment with:
- Build step: Compiles the frontend
- Run step: Starts both backend and frontend servers concurrently

## Testing the Application

1. Open the webview (frontend on port 5000)
2. Select a perfume and number of pumps
3. Click "Pay" to create an order
4. If Razorpay keys are configured, a QR code will be displayed
5. Use Razorpay test UPI IDs to simulate payment
6. The app polls for payment status and advances through the flow

## Troubleshooting

### Order Creation Fails

**Symptom**: "Failed to create order" error after clicking Pay button

**Solution**: Configure Razorpay API keys in `backend/.env` as described above

### Frontend Not Loading

**Symptom**: Blank screen or connection errors

**Solution**: 
1. Check that frontend workflow is running
2. Verify Vite is bound to 0.0.0.0:5000
3. Clear browser cache and hard refresh

### Backend API Not Responding

**Symptom**: Network errors or 500 status codes

**Solution**:
1. Check backend workflow logs for errors
2. Verify backend is running on port 3001
3. Check that Vite proxy is configured correctly

## File Structure

```
.
├── backend/
│   ├── index.js          # Express server
│   ├── mock_db.js        # In-memory database
│   ├── package.json
│   └── .env              # Razorpay credentials (needs configuration)
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API client
│   │   └── store/        # Zustand state management
│   ├── vite.config.js    # Vite configuration with proxy
│   └── package.json
└── README.md             # Original project documentation
```

## Next Steps

1. Configure Razorpay API keys in `backend/.env`
2. Restart the backend workflow
3. Test the complete order flow
4. For webhook testing, see the original README.md for localtunnel setup
