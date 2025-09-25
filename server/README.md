# StellarSoil Backend Server

This is the backend server for StellarSoil, providing API endpoints for the agriculture marketplace platform.

## Features

- Multi-role authentication system
- Secure file upload handling
- JWT-based authentication
- Role-based middleware
- Admin approval system for farmers
- MongoDB database integration
- Express.js REST API

### Multilingual Chatbot (English / Tamil / Hindi)

The chat controller now auto-detects Tamil (ta) and Hindi (hi) messages and translates them to English for AI intent parsing, then translates responses back.

Request body additions for `/api/chat/send` (example route name):
```
{
  "message": "30 கிலோ தக்காளி ஆர்டர் பண்ணு", 
  "userRole": "customer", 
  "preferLanguage": "ta"
}
```
If `preferLanguage` is omitted the service replies in the detected language automatically.

Direct commands like:
* Customer: "order 30 kg tomato" (or equivalent in Tamil/Hindi) → auto adds to cart (skips confirmation) if product & quantity identified.
* Farmer: "list 50 kg tomato 25 rupees" → auto creates/updates listing if all data present.

If the translation library `@vitalets/google-translate-api` is missing, the system gracefully falls back to English-only mode.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/JEGAN-11/StellarSoil.git
cd StellarSoil/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stellar-soil
JWT_SECRET=your_jwt_secret_here
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

```
POST /api/auth/register
- Register new user/farmer
- Multipart form data for farmer registration with Kisan ID

POST /api/auth/login
- Login with email and password
- Returns JWT token and user data
```

### Admin Routes

```
GET /api/admin/pending-farmers
- Get list of farmers pending verification

PUT /api/admin/approve-farmer/:id
- Approve a farmer's registration

PUT /api/admin/reject-farmer/:id
- Reject a farmer's registration

PUT /api/admin/toggle-user-status/:id
- Activate/deactivate user account
```

### Protected Routes

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## File Upload

- Kisan ID documents are stored in `/uploads/kisan-ids/`
- Supports PDF, JPG, JPEG, and PNG formats
- Max file size: 5MB

## Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['user', 'admin', 'farmer'],
  kisanId: {
    documentPath: String,
    verified: Boolean
  },
  isActive: Boolean,
  isVerified: Boolean
}
```

## Error Handling

- Custom error middleware
- Standardized error responses
- File upload error handling
- Validation error handling

## Security Features

- Password hashing with bcrypt
- JWT authentication
- File type validation
- Role-based access control
- Request rate limiting
- Input sanitization

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when implemented)

### Project Structure

```
server/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── uploads/        # File upload directory
└── index.js        # Server entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
