# RezoX Property Management API Server

A comprehensive REST API server for the RezoX property management platform built with Express.js and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with user roles (user/admin)
- **Property Management**: CRUD operations for properties with advanced filtering
- **Booking System**: Property booking and management
- **User Management**: Profile management and admin controls
- **Newsletter**: Subscription management
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Password hashing, CORS protection, and input sanitization

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb+srv://baidikmazumdar789_db_user:evNwjoT5ia9nv4zq@cluster0.j1fz7es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

3. **Seed Database** (Optional)
   ```bash
   node scripts/seedData.js
   ```

4. **Start Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset

### Properties
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Admin only)
- `PUT /api/properties/:id` - Update property (Admin only)
- `DELETE /api/properties/:id` - Delete property (Admin only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/admin/all` - Get all bookings (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id/status` - Update user status (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/subscribers` - Get subscribers (Admin only)
- `PUT /api/newsletter/subscribers/:id` - Update subscriber (Admin only)
- `DELETE /api/newsletter/subscribers/:id` - Delete subscriber (Admin only)

## Database Models

### User
- Basic user information with authentication
- Role-based access control (user/admin)
- Profile management

### Property
- Comprehensive property details
- Location with coordinates
- Images and amenities
- Availability status

### Booking
- Property booking system
- Date range management
- Status tracking
- Contact information

### Newsletter
- Email subscription management
- User preferences
- Subscription status

## Query Parameters

### Properties Filtering
- `propertyType`: apartment, house, condo, townhouse, studio, loft
- `city`: Filter by city
- `minPrice`, `maxPrice`: Price range
- `bedrooms`, `bathrooms`: Number of rooms
- `search`: Text search across title, description, location
- `sortBy`: price, createdAt, title
- `sortOrder`: asc, desc
- `page`, `limit`: Pagination

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": string,
  "data": object,
  "error": string (in case of errors)
}
```

## Development

### Project Structure
```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── scripts/         # Database scripts
└── index.js         # Server entry point
```

### Adding New Features
1. Create model in `models/`
2. Add routes in `routes/`
3. Implement business logic in `services/`
4. Add validation middleware
5. Update API documentation

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper CORS settings
4. Set up MongoDB connection with proper credentials
5. Use a process manager like PM2
6. Set up monitoring and logging

## Health Check

The server provides a health check endpoint:
- `GET /api/health` - Returns server status and timestamp

## License

MIT License - see LICENSE file for details
