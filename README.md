# RazorPay E-Commerce Integration with Node.js & React

A production-style Razorpay payment gateway integration built with **Node.js, Express, TypeScript, MongoDB, React, and Tailwind CSS**.

This project demonstrates how to securely integrate Razorpay into an e-commerce application using modern backend architecture, webhook verification, payment signature verification, and a clean checkout flow.

---

# Features

- Razorpay Order Creation
- Secure Razorpay Checkout
- Payment Signature Verification
- Webhook Signature Verification
- Payment Status API
- Refund API
- Order Management
- MongoDB Order Storage
- Shipping Address Support
- Payment Details Storage
- Raw Payment Response Storage
- Tailwind CSS UI
- React Frontend
- TypeScript
- Express.js Backend

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Razorpay SDK

## Frontend

- React
- TypeScript
- Tailwind CSS
- Axios

# Razorpay Features Implemented

## Create Order

The backend creates a Razorpay Order before opening Checkout.

```text
POST /order
```

Responsibilities

- Validate Order
- Calculate Amount
- Create Razorpay Order
- Store razorpay_order_id
- Return Checkout Session

---

## Razorpay Checkout

The frontend receives the checkout session and opens Razorpay Checkout.

```ts
await startCheckout(session);
```

The customer can pay using

- Credit Card
- Debit Card
- UPI
- Wallet
- Net Banking
- EMI

---

## Payment Verification

After a successful payment, the frontend sends the payment information to the backend.

```text
POST /payment/verify
```

The backend verifies

- razorpay_order_id
- razorpay_payment_id
- razorpay_signature

using

```
HMAC SHA256
```

This ensures the payment callback is authentic.

---

## Webhook Integration

Implemented webhook endpoint

```text
POST /payment/webhook
```

Webhook Signature Verification

- Raw Request Body
- HMAC SHA256
- timingSafeEqual()

Supported Events

- payment.authorized
- payment.captured
- payment.failed
- refund.created
- refund.processed
- refund.failed
- order.paid

---

# Webhook Flow

```text
Razorpay

↓

Webhook

↓

Verify Signature

↓

Parse Event

↓

Handle Event

↓

Update Order

↓

Store Payment Information

↓

Return 200
```

---

# Security

Implemented

- Signature Verification
- Webhook Verification
- Server-side Amount Validation
- Backend Order Creation
- Raw Body Verification
- timingSafeEqual()

No payment amount is trusted from the frontend.

---

# Frontend Pages

- Products
- Shopping Cart
- Checkout
- Payment Success
- Payment Failed

---

# Why This Project?

This project demonstrates how to integrate Razorpay in a real-world e-commerce application while following production-ready backend architecture.

It focuses on

- Security
- Maintainability
- Scalability
- Clean Architecture
- Type Safety

instead of only implementing the minimum payment flow.

---

# Future Improvements

- Inventory Management
- Coupons
- Discounts
- Invoice Generation
- Email Notifications
- SMS Notifications
- Payment History
- Admin Dashboard
- Multiple Payment Gateways
- Stripe Integration
- PayPal Integration
- Analytics Dashboard

---

# License

This project is available for educational and demonstration purposes.
