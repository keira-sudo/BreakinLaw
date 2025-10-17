# BeReady UK Legal Guidance - Backend Server

A complete Node.js backend server with Supabase integration for the BeReady UK legal guidance application.

## 🏗️ Architecture

- **Framework**: Express.js 5.x with ES modules
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with JWT tokens
- **Security**: Helmet, CORS, Rate limiting, Input validation
- **Structure**: RESTful API with modular routing

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file with your Supabase credentials:
```bash
# Copy from .env file and update with your actual values
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup
Run the migration file in your Supabase dashboard:
```sql
-- Execute: supabase/migrations/20250910180317_beready_legal_guidance_system.sql
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📊 Database Schema

The system includes these main entities:

### Core Tables
- `user_profiles` - Extended user information
- `rights_guides` - Published legal guidance articles
- `rights_journal_entries` - User's personal legal incident records
- `chat_sessions` & `chat_messages` - AI chat conversations
- `legal_queries` - Formal legal questions for expert review
- `user_activity` - System activity logging

### Mock Data Included
The migration includes test users you can use immediately:

**Demo Credentials:**
- **Admin**: `admin@beready.uk` / `admin123`
- **User**: `user@beready.uk` / `user123` 
- **Legal Expert**: `expert@beready.uk` / `expert123`

## 🔗 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /signin` - User login
- `POST /signout` - User logout
- `POST /refresh` - Refresh JWT token
- `GET /me` - Get current user info

### Users (`/api/users`) 🔐
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /activity` - Get user activity history
- `POST /activity` - Log user activity

### Rights Guides (`/api/rights-guides`)
- `GET /` - List published guides (public)
- `GET /:slug` - Get guide by slug (public)
- `POST /` - Create guide (🔐 experts/admins)
- `PUT /:id` - Update guide (🔐 author/admin)
- `DELETE /:id` - Delete guide (🔐 author/admin)
- `GET /meta/categories` - Get available categories

### Journal (`/api/journal`) 🔐
- `GET /` - List user's journal entries
- `GET /:id` - Get specific entry
- `POST /` - Create journal entry
- `PUT /:id` - Update entry
- `DELETE /:id` - Delete entry
- `GET /stats/summary` - Get journal statistics

### Chat (`/api/chat`) 🔐
- `GET /sessions` - List user's chat sessions
- `POST /sessions` - Create new chat session
- `GET /sessions/:id` - Get session with messages
- `PUT /sessions/:id` - Update session
- `DELETE /sessions/:id` - Delete session
- `POST /sessions/:id/messages` - Send message
- `GET /sessions/:id/messages` - Get messages (paginated)

### Legal Queries (`/api/legal-queries`) 🔐
- `GET /` - List queries (filtered by role)
- `GET /:id` - Get specific query
- `POST /` - Create new query
- `PUT /:id` - Update query
- `POST /:id/assign` - Assign to expert (admin only)
- `DELETE /:id` - Delete query
- `GET /stats/summary` - Get query statistics

### Analytics (`/api/analytics`) 🔐
- `GET /dashboard` - User dashboard analytics
- `GET /guides` - Guide analytics (experts/admins)
- `POST /activity` - Log activity
- `GET /trends` - Activity trends (admin only)

🔐 = Requires authentication

## 🔐 Authentication & Authorization

### Roles
- **user**: Standard users - can create journal entries, chat, submit queries
- **legal_expert**: Can create guides, handle legal queries, view analytics
- **admin**: Full system access, user management, system analytics

### Token Usage
Include JWT token in requests:
```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

## 🛡️ Security Features

- **JWT Authentication** with Supabase integration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection** with configurable origins
- **Helmet Security Headers**
- **Request Size Limiting**: 10MB max
- **Row Level Security (RLS)** on all tables
- **Input Validation** and sanitization

## 📝 Usage Examples

### Frontend Integration
```javascript
// Sign in user
const response = await fetch('http://localhost:3001/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Create journal entry
const response = await fetch('http://localhost:3001/api/journal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    title: 'Housing Issue',
    category: 'housing',
    description: 'Landlord refusing repairs'
  })
});
```

### Testing with cURL
```bash
# Test health endpoint
curl http://localhost:3001/health

# Sign in
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@beready.uk","password":"user123"}'

# Get rights guides
curl http://localhost:3001/api/rights-guides
```

## 🔧 Development

### File Structure
```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies & scripts
├── .env                   # Environment variables
├── middleware/
│   ├── supabaseAuth.js    # Authentication middleware
│   └── errorHandler.js    # Global error handling
└── routes/
    ├── auth.js           # Authentication routes
    ├── users.js          # User management
    ├── rightsGuides.js   # Rights guides API
    ├── journal.js        # Journal entries API
    ├── chat.js           # Chat sessions API
    ├── legalQueries.js   # Legal queries API
    └── analytics.js      # Analytics & reporting
```

### Adding New Routes
1. Create route file in `/routes`
2. Import and register in `server.js`
3. Add authentication middleware as needed
4. Test endpoints

### Error Handling
The system includes comprehensive error handling:
- Supabase-specific errors (PGRST codes)
- JWT authentication errors
- Validation errors
- Generic server errors

## 🚀 Deployment

### Environment Variables
Ensure these are set in production:
```bash
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
JWT_SECRET=your_secure_jwt_secret
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Production Considerations
- Use HTTPS in production
- Set secure JWT secrets
- Configure proper CORS origins
- Monitor rate limits based on traffic
- Set up proper logging
- Use process managers (PM2, etc.)

## 🆘 Troubleshooting

### Common Issues

**"Authentication failed"**
- Check JWT token in Authorization header
- Verify token hasn't expired
- Ensure user exists in database

**"Permission denied"**
- Check user role permissions
- Verify RLS policies are correct
- Ensure user profile exists

**"Database connection error"**
- Verify Supabase credentials in .env
- Check Supabase project status
- Confirm database migration was run

### Mock Data Access
Use the provided test accounts to immediately test functionality without creating new users.

## 📞 Support

For issues or questions about the BeReady backend server, check:
1. Console logs for detailed error messages
2. Supabase dashboard for database issues
3. Network tab for API request/response details