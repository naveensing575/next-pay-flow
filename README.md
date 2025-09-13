# Next Pay Flow

A modern subscription management platform built with Next.js 14, featuring secure payment processing with Razorpay and Google OAuth authentication.

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

- **Dashboard & UI**
  - Modern, responsive dashboard with Framer Motion animations
  - Dark/Light theme support
  - Real-time subscription status display
  - Account management interface

- **Database Integration**
  - MongoDB for user and subscription data
  - Optimized database queries with proper ObjectId handling
  - Session-based user plan updates

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with official Node.js driver
- **Payments**: Razorpay
- **UI Components**: Shadcn/ui, Lucide React icons
- **Styling**: Tailwind CSS with custom theme support

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth configuration
│   │   └── payments/               # Payment API routes
│   ├── checkout/[planId]/          # Dynamic checkout pages
│   ├── dashboard/                  # User dashboard
│   └── login/                      # Login page
├── components/
│   ├── auth/                       # Authentication components
│   ├── dashboard/                  # Dashboard UI components
│   ├── providers/                  # React providers
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
   Create a `.env.local` file based on `.env.example`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MONGODB_URI=your-mongodb-connection-string
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
   ```

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