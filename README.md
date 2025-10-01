# Next Pay Flow

A modern subscription management platform built with Next.js 15, featuring secure payment processing with Razorpay and Google OAuth authentication.

## ScreenShots

### Login Page
<img width="959" height="509" alt="image" src="https://github.com/user-attachments/assets/c7911a79-0346-4003-a577-cd170cf1fec7" />

### Dashboard Page
<img width="744" height="508" alt="image" src="https://github.com/user-attachments/assets/3802b20f-39b1-4817-9cf6-1fd35a879d99" />

<img width="696" height="509" alt="image" src="https://github.com/user-attachments/assets/5e9beb46-3a48-437a-be6c-6455a822a261" />


### Payment for professional plan
<img width="902" height="482" alt="3" src="https://github.com/user-attachments/assets/449b6a09-f611-4eca-a70e-5e62f9eee154" />

<img width="959" height="599" alt="4" src="https://github.com/user-attachments/assets/70d7d59a-afc3-43ac-b1af-807759ba1d35" />

### Updated Subscription
<img width="738" height="506" alt="image" src="https://github.com/user-attachments/assets/1c8f001d-b395-4473-9835-a1567550232a" />


## Features

- **Authentication System**
  - Google OAuth integration with NextAuth.js
  - Google One Tap login support
  - Secure session management with MongoDB adapter

- **Payment Integration**
  - Razorpay payment gateway integration
  - Secure payment verification with HMAC signature validation
  - Multiple subscription plans (Basic, Professional, Business)
  - Real-time payment status updates
  - Payment history with invoice generation
  - PDF invoice downloads for completed transactions

- **Dashboard & UI**
  - Modern, responsive dashboard with Framer Motion animations
  - Dark/Light theme support
  - Real-time subscription status display
  - Account management interface
  - Custom error pages (404, 500)
  - Interactive plan comparison table

- **User Management**
  - Account settings page with profile updates
  - Subscription management and billing history
  - Account deletion with GDPR compliance
  - User preferences management

- **Support System**
  - Beautiful contact form with glass morphism design
  - Email notifications via Resend
  - User information auto-populated in support requests
  - Direct email communication channel

- **Database Integration**
  - MongoDB for user and subscription data
  - Optimized database queries with proper ObjectId handling
  - Session-based user plan updates

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Animation**: Framer Motion
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with official Node.js driver
- **Payments**: Razorpay
- **Email**: Resend for transactional emails
- **PDF Generation**: jsPDF with jsPDF-AutoTable
- **UI Components**: Shadcn/ui, Lucide React icons
- **Styling**: Tailwind CSS with custom theme support
- **Notifications**: Sonner for toast notifications

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   ├── payments/               # Payment API routes
│   │   │   ├── create-order/       # Order creation
│   │   │   ├── verify-payment/     # Payment verification
│   │   │   ├── history/            # Payment history
│   │   │   └── invoice/            # PDF invoice generation
│   │   ├── user/                   # User management APIs
│   │   │   ├── update-profile/     # Profile updates
│   │   │   └── delete-account/     # Account deletion
│   │   └── support/                # Support system
│   │       └── send-message/       # Email support requests
│   ├── dashboard/                  # User dashboard
│   │   ├── billing/                # Payment history & invoices
│   │   ├── settings/               # Account settings
│   │   └── support/                # Support contact page
│   ├── login/                      # Login page
│   ├── error.tsx                   # Global error handler
│   └── not-found.tsx               # 404 page
├── components/
│   ├── auth/                       # Authentication components
│   ├── dashboard/                  # Dashboard UI components
│   ├── pricing/                    # Plan comparison table
│   ├── providers/                  # React providers
│   ├── theme/                      # Theme toggle components
│   └── ui/                         # Reusable UI components
└── lib/                           # Utility functions and configurations
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/next-pay-flow.git
   cd next-pay-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # MongoDB Configuration
   MONGODB_URI=your-mongodb-connection-string

   # Google OAuth (Server-side)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Google OAuth (Client-side - Only Client ID is safe to expose)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret-key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_WEBHOOK_SECRET=your-webhook-secret (optional)

   # Email Configuration (Resend)
   RESEND_API_KEY=your-resend-api-key

   # Application Environment
   NODE_ENV=development
   ```

   **Important Notes:**
   - Get Resend API key from: https://resend.com (Free tier: 3,000 emails/month)
   - Get Google OAuth credentials from: https://console.cloud.google.com
   - Get Razorpay keys from: https://dashboard.razorpay.com
   - Never expose `GOOGLE_CLIENT_SECRET` or `RAZORPAY_KEY_SECRET` to the client
   - Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Key Implementation Details

### Authentication Flow
- Integrated NextAuth.js with MongoDB adapter for persistent sessions
- Custom session callbacks to include user subscription data
- Google OAuth and Google One Tap for seamless login experience

### Payment Processing
- Secure order creation with Razorpay API
- Client-side payment modal integration
- Server-side payment verification using HMAC signatures
- Automatic user plan updates upon successful payment

### Database Design
- User documents with embedded subscription objects
- Proper ObjectId handling for MongoDB queries
- Session-based real-time data updates

### Security Features
- CSRF protection with NextAuth
- Payment signature verification
- Environment variable protection for sensitive data
- Secure API route implementations

## API Endpoints

- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify and process payment
- `POST /api/payments/webhook` - Handle Razorpay webhooks
- `/api/auth/*` - NextAuth endpoints

## Deployment

The application is ready for deployment on platforms like Vercel, with proper environment variable configuration for production MongoDB and Razorpay credentials.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
