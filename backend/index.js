import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

import * as db from './mock_db.js';

// --- CONFIGURATION ---
const app = express();
const port = 3001; // Using 3001 to avoid conflict with React dev server (3000)

// In-memory data for perfumes
const PERFUMES = {
    'ocean_blue': { name: 'Ocean Blue', pricePerPump: 3.5 },
    'rose_mist': { name: 'Rose Mist', pricePerPump: 3.2 },
    'night_amber': { name: 'Night Amber', pricePerPump: 4.0 },
};

// --- RAZORPAY SETUP ---
const rzpKeyId = process.env.RAZORPAY_KEY_ID;
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!rzpKeyId || !rzpKeySecret) {
    throw new Error('Razorpay Key ID and Secret are required. Check your .env file.');
}

const razorpay = new Razorpay({
    key_id: rzpKeyId,
    key_secret: rzpKeySecret,
});

// --- MIDDLEWARE ---
// Use CORS for all routes
app.use(cors());

// We need a raw body parser for webhook signature verification
// This must come BEFORE the regular json parser
app.post(
    '/api/webhook/razorpay', 
    bodyParser.raw({ type: 'application/json' }), 
    handleRazorpayWebhook
);

// Regular JSON parser for all other routes
app.use(express.json());


// --- API ROUTES ---

/**
 * [POST] /api/create-order
 * Creates a new order and a dynamic Razorpay Payment Link with QR code.
 */
app.post('/api/create-order', async (req, res) => {
    try {
        const { perfumeId, pumps } = req.body;
        if (!perfumeId || !pumps || !PERFUMES[perfumeId]) {
            return res.status(400).json({ error: 'Invalid perfume ID or pump count.' });
        }

        const perfume = PERFUMES[perfumeId];
        const amount = perfume.pricePerPump * pumps;
        const amountInPaise = Math.round(amount * 100);
        const internalOrderId = uuidv4();
        const receiptId = `kiosk-order-${Date.now()}`;

        // Create the Razorpay Payment Link
        const paymentLink = await razorpay.paymentLink.create({
            amount: amountInPaise,
            currency: "INR",
            accept_partial: false,
            description: `Perfume: ${perfume.name} (${pumps} pumps)`,
            // We use the internal order ID as the reference_id
            reference_id: internalOrderId,
            notify: {
                // Do not send SMS/Email, we will handle it via UI
                sms: false,
                email: false
            },
            // This is crucial for the UI
            display_qr: true, 
            // Set a short expiry, e.g., 5 minutes
            expire_by: Math.floor(Date.now() / 1000) + (5 * 60), 
        });

        // Store the order in our mock DB
        const newOrder = {
            id: internalOrderId,
            perfumeId: perfumeId,
            perfumeName: perfume.name,
            pumps: pumps,
            amount: amount,
            status: 'CREATED', // Statuses: CREATED, PAID, DISPENSING, DISPATCHED
            paymentLinkId: paymentLink.id, // Razorpay Payment Link ID
            qrCodeUrl: paymentLink.qr_code, // Base64 QR code string
            createdAt: new Date(),
        };
        db.createOrder(newOrder);

        console.log(`[API] Created Order ${newOrder.id} for ₹${newOrder.amount}`);

        // Send the order details (including QR code) back to the frontend
        res.json(newOrder);

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create payment link.' });
    }
});

/**
 * [GET] /api/status/:orderId
 * Polled by the frontend to check if the payment status has changed.
 */
app.get('/api/status/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = db.getOrder(orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
        id: order.id,
        status: order.status,
    });
});

/**
 * [POST] /api/dispatch/:orderId
 * Simulates the "physical button press" signal from the kiosk UI.
 * This is the final safety check.
 */
app.post('/api/dispatch/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = db.getOrder(orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    // THE CRITICAL CHECK: Only dispense if the server knows it's PAID
    if (order.status !== 'PAID') {
        console.warn(`[API] Dispatch rejected: Order ${orderId} not paid.`);
        return res.status(402).json({ error: 'Payment not confirmed. Cannot dispense.' });
    }

    if (order.status === 'DISPATCHED' || order.status === 'DISPENSING') {
        console.warn(`[API] Dispatch rejected: Order ${orderId} already dispensed.`);
        return res.status(409).json({ error: 'Already dispensed.' });
    }

    // 1. Mark as DISPENSING
    db.updateOrder(orderId, { status: 'DISPENSING' });
    
    // 2. SIMULATE HARDWARE COMMAND
    // In a real system, this would send an MQTT message or a direct HTTP/Serial call
    // to the microcontroller (e.g., ESP32)
    console.log(`[HARDWARE_MOCK] Sending command to ESP32: Dispense ${order.pumps} pumps of ${order.perfumeName}.`);
    
    // 3. Simulate hardware completion
    const dispenseTime = order.pumps * 500 + 1000; // 0.5s per pump + 1s overhead
    setTimeout(() => {
        db.updateOrder(orderId, { status: 'DISPATCHED' });
        console.log(`[HARDWARE_MOCK] ESP32 confirmed dispense complete for ${orderId}.`);
    }, dispenseTime);

    // 4. Respond to frontend immediately
    res.json({ 
        success: true, 
        message: 'Dispensing started.', 
        pumps: order.pumps,
        estimatedTime: dispenseTime
    });
});


/**
 * [POST] /api/webhook/razorpay
 * Listens for payment confirmation from Razorpay servers.
 */
function handleRazorpayWebhook(req, res) {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    try {
        // 1. Validate the webhook signature
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(body); // Note: body must be raw buffer/string
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            console.warn('[WEBHOOK] Invalid Signature. Request denied.');
            return res.status(401).send('Invalid Signature');
        }

        // 2. Signature is valid. Process the event.
        const eventData = JSON.parse(body.toString());
        const event = eventData.event;
        
        console.log(`[WEBHOOK] Received event: ${event}`);

        if (event === 'payment_link.paid') {
            const paymentLink = eventData.payload.payment_link.entity;
            const orderId = paymentLink.reference_id; // Our internal order ID
            
            const order = db.getOrder(orderId);
            if (order && order.status === 'CREATED') {
                // Update our database
                db.updateOrder(orderId, { status: 'PAID' });
                console.log(`[WEBHOOK] Order ${orderId} marked as PAID.`);
            } else {
                console.warn(`[WEBHOOK] Received paid event for unknown or already processed order: ${orderId}`);
            }
        }

        // 3. Respond to Razorpay
        res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error('[WEBHOOK] Error handling webhook:', error.message);
        res.status(500).send('Webhook processing failed.');
    }
}


// --- START SERVER ---
app.listen(port, () => {
    console.log(`Perfume Kiosk Backend listening on http://localhost:${port}`);
    console.log('--- Razorpay Test Mode ---');
    console.log(`Key ID: ${rzpKeyId.substring(0, 10)}...`);
    console.log('Webhook endpoint: /api/webhook/razorpay');
    console.log('---------------------------');
});