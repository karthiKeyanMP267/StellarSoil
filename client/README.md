# StellarSoil Frontend

This is the frontend application for StellarSoil, an agriculture marketplace platform connecting farmers and buyers.

## Features

- Multi-role authentication system (Admin, Farmer, User)
- Secure file upload for farmer verification
- Admin dashboard for managing farmer verifications
- Role-based access control
- Responsive and modern UI with TailwindCSS
- Protected routes based on user roles

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see server README)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/JEGAN-11/StellarSoil.git
cd StellarSoil/client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

## Authentication System

### User Roles

1. **Admin**
   - Access to admin dashboard
   - Can approve/reject farmer registrations
   - Can manage user accounts

2. **Farmer**
   - Requires Kisan ID verification
   - Access to farmer dashboard
   - Can manage farm profile and listings
   - Must be approved by admin before accessing farmer features

3. **User**
   - Can browse marketplace
   - Can purchase products
   - Access to user dashboard

### Role-Based Routes

- `/admin/*` - Protected admin routes
- `/farm-dashboard/*` - Protected farmer routes
- `/marketplace/*` - Protected user routes

### Registration Process

1. **Regular Users**
   - Basic registration with email and password
   - Instant access to user features

2. **Farmers**
   - Registration requires Kisan ID document upload
   - Account pending until admin approval
   - Email notification upon approval/rejection

## Component Structure

### Core Components

- `AuthModal` - Handles authentication and role selection
- `AdminPanel` - Manages farmer verifications
- `FarmerRoute` - Protected routes for verified farmers
- `UserRoute` - Protected routes for regular users
- `Modal` - Reusable modal component with animations

### API Integration

The application uses axios for API calls, with:
- Automatic token handling
- Role-based request interceptors
- Error handling with automatic logout on 401

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Variables

- `VITE_API_URL` - Backend API URL
- Add any additional environment variables as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
