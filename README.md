# RealSpark - Dating Platform

A comprehensive Angular-based dating platform featuring real-time messaging, user management, and advanced social interaction capabilities.

🚀 **Live Demo:** [https://dating-app-umber.vercel.app/](https://dating-app-umber.vercel.app/)

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 About the Project

RealSpark is a modern dating application built with Angular 20, featuring real-time communication, sophisticated user matching, and comprehensive safety features. The platform supports multiple user roles including clients, writers, and administrators, with a complete monetization system.

### Key Highlights

- 🔄 Real-time messaging with WebSocket integration
- 👥 Multi-role user system (Clients, Writers, Admins)
- 💰 Token-based monetization system
- 🔒 Advanced user safety and reporting features
- 📱 Responsive design with modern UI components
- 🚀 Server-side rendering (SSR) support

## ✨ Features

### 🗣️ Communication

- **Real-time Messaging**: Instant chat with WebSocket support
- **File Attachments**: Share images and documents in conversations
- **Message Status**: Read receipts and delivery confirmations
- **Multi-chat Management**: Handle multiple conversations simultaneously

### 👤 User Management

- **User Authentication**: Secure JWT-based login system
- **Profile Management**: Complete user profile customization
- **User Blocking**: Block unwanted users with detailed reasons
- **Reporting System**: Comprehensive user reporting with admin moderation

### 💳 Monetization

- **Token System**: Credit-based messaging system
- **Package Purchases**: Multiple token package options
- **Writer Commissions**: Revenue sharing for content writers
- **Payment Integration**: Secure payment processing

### 🛡️ Safety & Moderation

- **Content Moderation**: Admin tools for content review
- **User Reports**: Detailed reporting system with categorization
- **Activity Logging**: Comprehensive user activity tracking
- **Admin Dashboard**: Full administrative control panel

### 🔧 Technical Features

- **Progressive Web App**: PWA capabilities for mobile experience
- **SEO Optimized**: Meta tags and structured data implementation
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Error Handling**: Comprehensive error management and user feedback

## 🛠️ Tech Stack

### Frontend

- **Angular 20** - Latest Angular framework with standalone components
- **TypeScript 5.9** - Type-safe JavaScript development
- **RxJS** - Reactive programming with Observables
- **PrimeNG** - Rich UI component library
- **Bootstrap 5** - Responsive CSS framework
- **Angular Material** - Material Design components

### Real-time Communication

- **Laravel Echo** - WebSocket client for real-time features
- **Pusher** - Real-time WebSocket service
- **HTTP Client** - Angular's built-in HTTP client with interceptors

### Development Tools

- **Angular CLI 20.3.10** - Command line interface
- **Karma & Jasmine** - Testing framework
- **TypeScript ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v20 or higher)

```bash
# Install Angular CLI globally
npm install -g @angular/cli@20
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dating_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   The application uses environment files for configuration:
   - `src/environments/environment.ts` - Production environment
   - `src/environments/environment.development.ts` - Development environment

   Current configuration points to:

   ```typescript
   export const environment = {
     production: false,
     baseUrl: 'https://realspark.jonahdevs.co.ke/api',
     pusherAppKey: 'd25ea694aba43704f511',
     pusherAppCluster: 'eu',
   };
   ```

4. **Start the development server**

   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run linting
ng lint

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── account-settings/ # User profile management
│   │   ├── admin-panel/      # Administrative interface
│   │   ├── buy-credit/       # Token purchase interface
│   │   ├── chatscreen/       # Main chat interface
│   │   ├── client-chat/      # Client-specific chat
│   │   ├── client-home/      # User discovery/matching
│   │   ├── forgot-password/  # Password recovery
│   │   ├── landing-page/     # Application landing page
│   │   ├── login/           # User authentication
│   │   ├── reset-password/   # Password reset
│   │   ├── signup/          # User registration
│   │   └── writer-dashboard/ # Writer management interface
│   │
│   ├── services/            # Business Logic Services
│   │   ├── auth-service.ts      # Authentication management
│   │   ├── chat.ts             # Chat functionality
│   │   ├── data-service.ts     # Global data management
│   │   ├── account-service.ts  # User account operations
│   │   ├── file-upload.service.ts # File handling
│   │   ├── logbook-service.ts  # Activity logging
│   │   ├── purchase-service.ts # Payment processing
│   │   ├── reports.service.ts  # User reporting system
│   │   ├── seo.service.ts      # SEO optimization
│   │   └── token-packages.service.ts # Token management
│   │
│   ├── data/                # Data Models & DTOs
│   │   ├── auth-dto.ts         # Authentication data models
│   │   ├── chats-dto.ts        # Chat-related models
│   │   └── tokens-dto.ts       # Token system models
│   │
│   ├── app.routes.ts        # Application routing
│   ├── app.config.ts        # Application configuration
│   ├── auth-interceptor.ts  # HTTP request interceptor
│   └── web-socket-service.ts # WebSocket management
│
├── environments/            # Environment configurations
├── assets/                 # Static assets
└── styles.css             # Global styles
```

### Key Components

#### 🏠 **Landing Page** (`/welcome`)

- Application introduction and feature highlights
- User registration and login access points

#### 👤 **Authentication System**

- **Login** (`/signin`) - User authentication
- **Signup** (`/join`) - New user registration
- **Password Recovery** (`/recover`, `/reset`) - Account recovery

#### 💬 **Chat System**

- **Chatscreen** (`/engage/:id`) - Main chat interface
- **Client Chat** (`/connect/:id`) - Direct messaging
- **Writer Dashboard** (`/studio`) - Writer management interface

#### 🏛️ **User Management**

- **Client Home** (`/explore`) - User discovery and matching
- **Account Settings** (`/profile`) - Profile management
- **Admin Panel** (`/control`) - Administrative controls

#### 💰 **Monetization**

- **Buy Credit** (`/purchase`) - Token purchase interface

## 🔌 API Integration

The application integrates with a Laravel backend API located at `https://realspark.jonahdevs.co.ke/api`.

### Key API Endpoints

#### Authentication

- `POST /login` - User authentication
- `POST /register` - User registration
- `POST /logout` - User logout
- `POST /forgot-password` - Password recovery

#### Chat System

- `GET /chats` - Get user conversations
- `POST /chats/send` - Send message
- `GET /chats/{id}/messages` - Get chat messages
- `POST /chats/{id}/claim` - Claim chat (writers)
- `PUT /chats/{id}/read` - Mark messages as read

#### User Management

- `GET /profiles` - Get user profiles
- `POST /profiles/block` - Block user
- `POST /profiles/report` - Report user
- `GET /profiles/blocked` - Get blocked users

#### Token System

- `GET /token-packages` - Get available packages
- `POST /token-packages/purchase` - Purchase tokens
- `GET /tokens/balance` - Get user balance

### HTTP Interceptor

The application uses an HTTP interceptor (`auth-interceptor.ts`) for:

- Automatic JWT token attachment
- Request/response logging
- Error handling and user feedback
- Authentication state management

## 🌐 Deployment

The application is deployed on Vercel with the following configuration:

### Build Configuration

```bash
# Build command
ng build

# Output directory
dist/dating_app
```

### Environment Variables (Vercel)

- `ENVIRONMENT`: production
- `API_URL`: https://realspark.jonahdevs.co.ke/api
- `PUSHER_KEY`: d25ea694aba43704f511
- `PUSHER_CLUSTER`: eu

### SSR Support

The application includes server-side rendering configuration in:

- `app.config.server.ts`
- `app.routes.server.ts`

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
ng test

# Code coverage
ng test --code-coverage

# E2E tests (when configured)
ng e2e
```

## 📈 Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive image handling
- **Bundle Splitting**: Optimized chunk sizes
- **Tree Shaking**: Dead code elimination
- **SSR**: Server-side rendering for better SEO

## 🔧 Development Notes

### Known Issues

- **CORS Configuration**: Backend currently has restricted CORS settings
- **WebSocket Connection**: Requires valid authentication token
- **File Upload**: Large file handling optimization needed

### Future Enhancements

- Push notification integration
- Advanced matching algorithms
- Video chat capabilities
- Mobile application (React Native/Flutter)

## 📄 License

This project is developed for educational and portfolio purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ using Angular 20 and modern web technologies**
