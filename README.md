# LinkedIn Clone - Professional Community Platform

A modern, responsive LinkedIn-like community platform built with Next.js, Node.js, and MongoDB. This project demonstrates full-stack development with authentication, real-time interactions, and a professional UI.

## 🚀 Live Demo

- **Frontend**: [Vercel Deployment](https://mini-linkedin-opal.vercel.app/)
- **Backend**: [Render Deployment](https://linkedin-clone-backend-t8tz.onrender.com/)

## ✨ Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Public Post Feed**: Create, read, like, and comment on posts
- **User Profiles**: View and edit personal profiles with bio
- **User Discovery**: Browse and follow other users
- **Real-time Interactions**: Like, comment, and follow functionality

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional interface inspired by LinkedIn
- **Type Safety**: Full TypeScript implementation
- **API Integration**: RESTful API with proper error handling
- **State Management**: Client-side state management with React hooks
- **Form Validation**: Client and server-side validation
- **Toast Notifications**: User-friendly feedback system

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date formatting utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB Atlas** - Cloud database service

### Deployment
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/linkedin-clone.git
cd linkedin-clone
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

#### Frontend Environment Variables
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `your_mongodb_atlas_connection_string` in the backend `.env` file

### 5. Run the Application

#### Development Mode
```bash
# From the root directory
npm run dev
```

This will start both frontend (port 3000) and backend (port 5000) in development mode.

#### Production Mode
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 📱 Demo Account

For testing purposes, you can use this demo accounts:

### Demo User
- **Email**: abc@gmail.com
- **Password**: abc@123

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/like/:id` - Like/unlike post
- `POST /api/posts/comment/:id` - Add comment
- `DELETE /api/posts/comment/:id/:comment_id` - Delete comment

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `GET /api/users/:id/posts` - Get user's posts
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/follow/:id` - Follow/unfollow user

## 🎨 Features in Detail

### User Authentication
- Secure registration with email validation
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes and middleware
- Automatic token refresh

### Post Management
- Create text-based posts with character limits
- Real-time like and unlike functionality
- Nested comments system
- Post deletion (author only)
- Comment deletion (author only)
- Timestamp display with relative time

### User Profiles
- Editable profile information
- Bio and personal details
- Follower/following counts
- Profile picture support (placeholder)
- Join date display

### User Discovery
- Browse all users
- Follow/unfollow functionality
- User cards with key information
- Real-time follower count updates

### UI/UX Features
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations and transitions
- Professional LinkedIn-inspired design
- Dark mode support (planned)


## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Protected API endpoints
- Rate limiting (planned)

## 🧪 Testing

The application includes comprehensive error handling and validation:

- Form validation (client and server-side)
- API error handling
- Network error recovery
- Input sanitization
- Authentication checks

## 📈 Performance Optimizations

- Lazy loading of components
- Optimized images and assets
- Efficient database queries
- Client-side caching
- Responsive image loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🙏 Acknowledgments

- LinkedIn for design inspiration
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB Atlas for the database service
- Vercel and Render for hosting services

## 📞 Support

If you have any questions or need help with the project, please:

1. Contact me on bhupeshy510@gmail.com
2. Raise issue on this repo

---
