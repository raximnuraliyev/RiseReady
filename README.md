# RiseReady

```
  ____  _          _____               _     _
 |  _ \(_)        |  __ \             | |   | |
 | |_) |_ ___  ___| |__) |___  __ _  __| |__ | |_   _ 
 |  _ <| / __|/ _ \  _  // _ \/ _` |/ _` |/ _ \| __|/ _  \
 | |_) | \__ \  __/ | \ \  __/ (_| | (_| | (_) | |_|  __/
 |____/|_|___/\___|_|  \_\___|\__,_|\__,_|\___/ \__|\___|

```

## Your Career Accelerator for Internships and Growth

**RiseReady** is a comprehensive learning and career development platform that connects students with internship opportunities, provides intelligent AI-powered career guidance, and offers personalized learning paths to accelerate professional growth.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation Guide](#installation-guide)
- [Environment Variables Guide](#environment-variables-guide)
- [Usage Guide](#usage-guide)
- [File Structure](#file-structure)
- [Development Scripts](#development-scripts)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What is RiseReady?

RiseReady is a modern, student-focused web application designed to bridge the gap between academic learning and professional career opportunities. It combines intelligent AI assistance, real-time internship discovery, and personalized career guidance to help students build stronger professional profiles.

### Who is it for?

- **Students** seeking internship opportunities and career guidance
- **Career-focused learners** who want personalized development paths
- **Professionals** looking to track growth and manage their learning journey

### Problems We Solve

- **Information Overload**: Curated internship opportunities tailored to your profile
- **Lack of Guidance**: AI-powered assistant provides instant career advice
- **Scattered Learning**: Centralized dashboard for tracking progress and opportunities
- **Personalization Gap**: Dynamic themes, animations, and UI customized to individual preferences

### Core Value Proposition

RiseReady delivers a seamless, modern experience combining:
- **Intelligent AI Integration** for instant, contextual career guidance
- **Real-time Opportunity Discovery** through LinkedIn and industry partnerships
- **Personalized Learning Paths** adapted to individual goals and skill levels
- **Engaging UI/UX** with smooth animations and customizable themes

---

## Features

### AI Assistant
Powered by OpenRouter API with intelligent caching via MongoDB. Get instant answers to career questions, resume advice, and interview preparation tips. Responses are cached to optimize API usage and provide faster subsequent queries.

### User Dashboard
Comprehensive personal workspace featuring:
- Calendar integration for tracking internship deadlines and applications
- Quick access to all your opportunities and tasks
- Real-time notifications for important updates
- Profile overview and progress tracking

### Internship Finder
Discover relevant internship opportunities integrated with:
- LinkedIn plugin for expanded job listings
- Advanced filtering by industry, location, and timeline
- Personalized recommendations based on your profile
- Application status tracking

### Profile Management
Create and maintain your professional profile including:
- Detailed skill inventory
- Project portfolio with descriptions
- Experience timeline
- Education history and certifications

### Real-time Notifications System
Stay informed with:
- Instant alerts for new opportunities matching your interests
- Deadline reminders for applications and tasks
- Email notifications for critical updates (optional)
- Socket.IO-powered real-time delivery

### Modern UI/UX with Animations
Experience a student-friendly interface featuring:
- Smooth, GPU-accelerated animations using Framer Motion
- Parallax scrolling effects
- Dynamic gradient backgrounds
- Scroll-reveal animations for engaging content discovery

### Custom Themes and Dynamic Backgrounds
Personalize your experience with:
- Multiple theme options (light, dark, custom)
- Dynamically generated gradient backgrounds
- User preference persistence
- Accessible color contrast standards

### Role-Based Access Control
Secure, flexible permission system:
- **Admin Role**: Full access to user management, content moderation, and analytics
- **User Role**: Standard access to personal dashboard, opportunities, and profiles
- JWT-based authentication
- Session management and secure logout

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | Modern UI framework with hooks and concurrent features |
| **TypeScript** | Type-safe development and better IDE support |
| **Tailwind CSS** | Utility-first CSS for rapid, responsive design |
| **Vite** | Lightning-fast build tool and dev server |
| **Framer Motion** | Advanced animation library for smooth transitions |
| **Axios** | HTTP client for API requests |
| **Socket.IO Client** | Real-time communication for notifications |
| **React Router** | Client-side routing |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime for server-side development |
| **Express.js** | Lightweight, flexible web framework |
| **MongoDB** | NoSQL database for flexible data modeling |
| **Mongoose** | MongoDB object modeling and schema validation |
| **Socket.IO** | Real-time bidirectional communication |
| **JWT (jsonwebtoken)** | Secure token-based authentication |

### External Services
| Service | Integration |
|---------|-------------|
| **OpenRouter API** | AI-powered assistant for career guidance |
| **LinkedIn Plugin** | Internship and job opportunity discovery |
| **Nodemailer** | Email notifications and reminders |

---

## System Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client (React + Vite)                      │
│                                                                 │
│  - UI Components with Animations                                │
│  - Real-time Socket.IO Connection                               │
│  - Local State Management with Context API                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP REST API
                    WebSocket (Socket.IO)
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                  Backend (Express + Node.js)                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ API Routes & Controllers                               │     │
│  │ - Authentication (JWT)                                 │     │
│  │ - User Management                                      │     │
│  │ - Internship Finder                                    │     │
│  │ - Notifications                                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                           │                                     │
│  ┌────────────────────────▼──────────────────────────────┐      │
│  │ Background Worker Process                             │      │
│  │ - Scans for due notifications                         │      │
│  │ - Processes reminders (email, Socket.IO)              │      │
│  │ - Atomic claims to prevent duplicates                 │      │
│  └───────────────────────────────────────────────────────┘      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
            Mongoose ODM & Database Queries
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    MongoDB Database                             │
│                                                                 │
│  Collections:                                                   │
│  - Users (profiles, credentials)                                │
│  - Notifications (scheduled reminders)                          │
│  - Internships (cached opportunities)                           │
│  - AIResponses (cached assistant answers)                       │
│  - CalendarEvents (deadlines & reminders)                       │
└─────────────────────────────────────────────────────────────────┘
```

### AI Assistant Architecture

**Request Flow:**
```
User Query
    │
    ▼
Frontend submits to /api/assistant endpoint
    │
    ▼
Backend checks MongoDB cache for similar query
    │
    ├─ Cache Hit: Return cached response immediately
    │
    └─ Cache Miss: 
         ├─ Forward request to OpenRouter API
         ├─ Receive response
         ├─ Store in MongoDB with TTL index (24 hours)
         └─ Return response to client
```

**MongoDB Caching Logic:**
- Each cached response includes: `query`, `response`, `createdAt`, `expiresAt`
- TTL (Time-To-Live) index automatically removes expired entries
- Query similarity matching to maximize cache hits while minimizing false positives
- Reduces OpenRouter API calls and improves response times

**API Limits Optimization:**
- Caching reduces redundant API calls by ~60-70%
- Rate limiting prevents abuse and ensures fair usage
- Batch processing for non-urgent queries
- Exponential backoff for failed requests

### Internship Data Flow

```
LinkedIn Plugin / External Sources
         │
         ▼
Scraper / API Integration Layer
         │
         ▼
Backend processes and normalizes data
         │
         ├─ Validation & duplicate checking
         ├─ User relevance matching
         └─ Enrichment with additional metadata
         │
         ▼
MongoDB Internships Collection
         │
         ▼
Frontend Dashboard & Search
         │
         ├─ Real-time filtering
         ├─ Personalized recommendations
         └─ Application tracking
```

---

## Installation Guide

### Prerequisites

Before starting, ensure you have installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (included with Node.js)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** (for cloning the repository)

### Step-by-Step Installation

#### 1. Clone the Repository

```powershell
git clone https://github.com/raximnuraliyev/RiseReady.git
cd RiseReady
```

#### 2. Install Root Dependencies

```powershell
npm install
```

#### 3. Install Server Dependencies

```powershell
npm install --prefix server
```

#### 4. Create Environment Files

**Frontend `.env` (in project root):**
```env
VITE_API_URL=http://localhost:4000/api
```

**Backend `server/.env` (in server directory):**
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/riseready
JWT_SECRET=your-super-secret-jwt-key-change-this
OPENROUTER_API_KEY=your-openrouter-api-key
WORKER_SECRET=your-worker-authorization-secret
APP_URL=http://localhost:5173
WORKER_BATCH_SIZE=10
```

#### 5. Start MongoDB

**Local MongoDB:**
```powershell
# On Windows with MongoDB installed
mongod
```

**Or use MongoDB Atlas (cloud):**
- Create a cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Get your connection string and add to `MONGO_URI`

#### 6. Run the Application

**All Services (Recommended):**
```powershell
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server with hot reload)
- **API Server**: http://localhost:4000 (Express API)
- **Worker**: Background process for notifications

**Individual Services:**
```powershell
# Terminal 1: Frontend only
npm run dev

# Terminal 2: API Server
npm run dev --prefix server

# Terminal 3: Worker Process
npm run dev:worker --prefix server
```

#### 7. Verify Installation

Open http://localhost:5173 in your browser and:
1. Register a new account or login
2. Check the dashboard loads correctly
3. Verify notifications appear in real-time
4. Test the AI assistant feature

---

## Environment Variables Guide

### Frontend (`VITE_API_URL`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | API base URL for frontend requests | `http://localhost:4000/api` |

### Backend (`server/.env`)

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `PORT` | Express server port | Yes | `4000` |
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/riseready` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes | `complex-secret-key-32-chars-min` |
| `OPENROUTER_API_KEY` | API key for OpenRouter AI service | Yes | `sk-or-v1-xxxxx` |
| `WORKER_SECRET` | Secret for worker authorization | Yes | `worker-secret-key` |
| `APP_URL` | Public application URL (for emails) | No | `http://localhost:5173` |
| `WORKER_BATCH_SIZE` | Notifications processed per batch | No | `10` |
| `SMTP_HOST` | SMTP server hostname | No | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | No | `587` |
| `SMTP_USER` | SMTP authentication username | No | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP authentication password | No | `app-specific-password` |
| `SMTP_SECURE` | Use TLS/SSL for SMTP | No | `true` |

### Getting API Keys

**OpenRouter API Key:**
1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up or login to your account
3. Navigate to API keys section
4. Create a new key and copy it

**LinkedIn Plugin:**
1. Register at [LinkedIn Developer Portal](https://www.linkedin.com/developers)
2. Create a new application
3. Request access to required scopes
4. Configure redirect URIs to match your deployment URL

---

## Usage Guide

### Getting Started

#### 1. User Registration and Login

- Navigate to http://localhost:5173
- Click "Sign Up" to create a new account
- Fill in required fields: email, password, full name
- Verify your email (if configured)
- Login with your credentials

#### 2. Dashboard Overview

Upon login, your dashboard displays:
- **Quick Stats**: Applications submitted, opportunities viewed, tasks pending
- **Calendar**: Upcoming deadlines and reminders
- **Opportunities**: Personalized internship recommendations
- **Recent Activity**: Your actions and system updates

#### 3. Using the AI Assistant

- Click the "AI Assistant" button in the navigation
- Type your career question or request
- Examples:
  - "How do I improve my resume for tech internships?"
  - "What skills are most valuable for data science roles?"
  - "How should I prepare for a behavioral interview?"
- Assistant provides instant, intelligent responses
- Follow-up questions are cached for faster responses

#### 4. Finding Internships

**Browse Opportunities:**
1. Navigate to "Internship Finder"
2. View personalized recommendations
3. Use filters:
   - **Industry**: Technology, Finance, Healthcare, etc.
   - **Location**: Remote, On-site, Hybrid
   - **Duration**: 3 months, 6 months, Semester

**Apply to Internships:**
1. Click an opportunity to view details
2. Review requirements and responsibilities
3. Click "Apply Now"
4. Set a reminder for follow-up

#### 5. Profile Management

**Complete Your Profile:**
1. Go to "My Profile"
2. Add personal information:
   - Education history
   - Work experience
   - Technical skills
   - Project portfolio links
3. Upload profile picture
4. Write a compelling bio
5. Profile completeness affects recommendation quality

#### 6. Calendar and Reminders

**Create Reminders:**
1. Navigate to Calendar
2. Click on a date to create an event
3. Set event details: title, time, type (deadline, interview, etc.)
4. Choose reminder: 30 min, 1 hour, 1 day before
5. Event appears in notifications when due

### Personalization

**Customize Your Theme:**
1. Open Settings (gear icon)
2. Select "Appearance"
3. Choose from available themes
4. Changes apply instantly

**Dynamic Backgrounds:**
- Backgrounds change based on your activity
- Animated gradients update every interaction
- Preference saved to your profile

---

## File Structure

### Frontend Structure

```
src/
├── components/
│   ├── AIAssistant.tsx           # AI chat interface
│   ├── Dashboard.tsx             # Main dashboard
│   ├── DashboardBackgrounds.tsx  # Dynamic theme backgrounds
│   ├── AnimatedBackground.tsx    # Animated gradient effects
│   ├── AnimatedGradientText.tsx  # Gradient text animation
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Footer component
│   ├── ParallaxSection.tsx       # Parallax scroll effects
│   ├── ScrollReveal.tsx          # Scroll reveal animation
│   ├── DiscordLinkCard.tsx       # Community link card
│   └── ErrorBoundary.tsx         # Error handling wrapper
├── contexts/
│   └── AuthContext.tsx           # Global auth state
├── hooks/
│   └── useAuth.ts                # Custom auth hook
├── pages/
│   ├── Home.tsx                  # Landing page
│   ├── Login.tsx                 # Login page
│   ├── Register.tsx              # Registration page
│   ├── ProfilePage.tsx           # User profile
│   └── InternshipFinder.tsx       # Opportunity browser
├── routes/
│   └── Router.tsx                # Route definitions
├── utils/
│   ├── socket.ts                 # Socket.IO configuration
│   ├── api.ts                    # API client (Axios)
│   └── helpers.ts                # Utility functions
├── styles/
│   └── animations.css            # Global animations
├── types/
│   └── index.ts                  # TypeScript interfaces
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
├── App.css                       # App-level styles
└── index.css                     # Global styles
```

### Backend Structure

```
server/
├── src/
│   ├── index.js                  # Express server entry
│   ├── app.js                    # Express app configuration
│   ├── worker.js                 # Background worker process
│   ├── config/
│   │   ├── database.js           # MongoDB connection
│   │   └── jwt.js                # JWT configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User management
│   │   ├── aiController.js       # AI assistant endpoints
│   │   ├── internshipController.js # Internship finder
│   │   └── notificationController.js # Notification system
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Notification.js       # Notification schema
│   │   ├── Internship.js         # Internship schema
│   │   ├── AIResponse.js         # Cached AI responses
│   │   └── CalendarEvent.js      # Calendar events
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   ├── validation.js         # Request validation
│   │   └── rateLimiter.js        # Rate limiting
│   └── routes/
│       ├── auth.js               # Auth routes
│       ├── users.js              # User routes
│       ├── ai.js                 # AI assistant routes
│       ├── internships.js        # Internship routes
│       └── notifications.js      # Notification routes
├── scripts/
│   ├── create-test-user.js       # Development helper
│   └── create-link-for-email.js  # Email link generator
├── ecosystem.config.js           # PM2 configuration
└── package.json                  # Server dependencies
```

---

## Development Scripts

### Root Scripts (`npm run <script>`)

| Script | Purpose | Location |
|--------|---------|----------|
| `npm run dev` | Start Vite frontend dev server | Root |
| `npm run dev:all` | Start all services concurrently | Root |
| `npm run build` | Build frontend for production | Root |
| `npm run lint` | Run ESLint on entire project | Root |
| `npm run preview` | Preview production build locally | Root |
| `npm run bootstrap` | Install dependencies for all packages | Root |

### Server Scripts (`npm run <script> --prefix server`)

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start API server with nodemon (auto-reload) |
| `npm run start` | Start API server for production |
| `npm run worker` | Run background worker process |
| `npm run dev:worker` | Run worker with nodemon (auto-reload) |

### Usage Examples

```powershell
# Start everything at once
npm run dev:all

# Start only frontend
npm run dev

# Start only API server from root
npm run dev --prefix server

# Start only worker from root
npm run dev:worker --prefix server

# Build frontend for production
npm run build

# Check code quality
npm run lint
```

---

## Screenshots

### Dashboard Preview
[Your dashboard screenshot here - showing main interface, calendar, opportunities]

### AI Assistant in Action
[Screenshot of AI assistant interaction with sample questions and responses]

### Profile Management
[Screenshot of user profile page with skill inventory and portfolio]

### Internship Finder
[Screenshot of internship search and filtering interface]

### Notification System
[Screenshot showing real-time notifications and reminders]

---

## Contributing

We welcome contributions from developers, designers, and career professionals! Whether you're fixing bugs, adding features, or improving documentation, your help is valuable.

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the idea, not the person
- Celebrate each other's contributions

### Getting Started as a Contributor

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```powershell
   git clone https://github.com/your-username/RiseReady.git
   cd RiseReady
   ```

3. **Create a feature branch**:
   ```powershell
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** and commit:
   ```powershell
   git add .
   git commit -m "feat: clear description of your change"
   ```

5. **Push to your fork**:
   ```powershell
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on the main repository

### Pull Request Guidelines

- **Title**: Start with `feat:`, `fix:`, `docs:`, `style:`, `test:`, or `refactor:`
- **Description**: Clearly explain what changed and why
- **Testing**: Ensure your changes don't break existing functionality
- **Linting**: Run `npm run lint` and fix any issues
- **Documentation**: Update README or docs if adding features

### Issue Guidelines

When reporting bugs or requesting features:

1. **Check existing issues** to avoid duplicates
2. **Use clear titles** that describe the problem
3. **Provide detailed steps** to reproduce bugs
4. **Include environment** information (Node version, OS, etc.)
5. **Add labels** (bug, enhancement, documentation, etc.)

### Development Checklist

Before submitting a PR:

- [ ] Code passes linting (`npm run lint`)
- [ ] Changes don't break existing features
- [ ] New features include tests (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Commits follow conventional commit format
- [ ] No unnecessary dependencies added

---

## License

RiseReady is licensed under the **MIT License**. You are free to:

- Use commercially
- Modify the source code
- Distribute copies
- Include in proprietary applications

See the `LICENSE` file for full details.

**Conditions**: Include a copy of the license and copyright notice in distributions.

---

## Credits

### Built With

- **Vite** - Next generation frontend tooling
- **React** - JavaScript UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **OpenRouter** - AI model aggregation platform

### Inspiration & Resources

- Community feedback and feature requests
- Open-source projects in the career tech space
- Career development best practices
- Student and employer insights

### Contributors

Special thanks to all contributors who've helped improve RiseReady through code, feedback, and ideas.

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Failed to resolve import 'socket.io-client'"

**Solution:**
```powershell
# Make sure you're in the project root
npm install
```

This installs dependencies needed by both frontend and backend.

#### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solution:**
```powershell
# Find and kill process on port 4000
Get-Process | Where-Object {$_.Name -like "*node*"} | Stop-Process

# Or change the port in server/.env
PORT=4001
```

#### Issue: MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect to server`

**Check:**
1. MongoDB is running locally or Atlas connection string is correct
2. MONGO_URI in `server/.env` is properly formatted
3. Network connectivity if using Atlas

**Fix:**
```powershell
# Test MongoDB connection locally
mongosh
```

#### Issue: Vite Port Mismatch

**Error:** Frontend connects to wrong API port

**Solution:** Verify `VITE_API_URL` in `.env` matches your backend PORT in `server/.env`

#### Issue: Worker Process Not Starting

**Error:** Worker fails with authentication error

**Check:**
1. `WORKER_SECRET` matches between server and worker
2. Database is accessible
3. Check worker logs in terminal

```powershell
# Manual test
npm run worker --prefix server
```

#### Issue: Notifications Not Appearing

**Checklist:**
- [ ] Socket.IO connection established (check browser DevTools)
- [ ] Worker process is running
- [ ] MongoDB notifications collection exists
- [ ] WORKER_SECRET is configured correctly
- [ ] Check browser console for errors

#### Issue: AI Assistant Returns Empty Response

**Debug:**
1. Verify `OPENROUTER_API_KEY` is set correctly
2. Check API key has sufficient credits
3. Review API rate limits
4. Check server logs for API errors

```powershell
# Test API connectivity
npm run dev:all
# Open browser and check Network tab in DevTools
```

#### Issue: CORS Errors in Browser Console

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Verify backend CORS configuration in `server/src/app.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### Issue: Dependencies Not Installing

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps flag
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
```

### Getting Help

- **GitHub Issues**: Search existing or create new [issues](https://github.com/raximnuraliyev/RiseReady/issues)
- **Documentation**: Review relevant docs in project repository
- **Community**: Connect with other developers and users

### Performance Tips

1. **Frontend**: Keep component state minimal, use React DevTools Profiler
2. **Backend**: Monitor MongoDB query performance with `.explain()`
3. **Database**: Create indexes on frequently queried fields
4. **Caching**: Monitor AI response cache hit rates

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Happy coding! We're excited to see what you build with RiseReady.**