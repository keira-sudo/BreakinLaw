// backend/server.js
import 'dotenv/config'; // Load backend/.env first

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import rightsGuidesRoutes from './routes/rightsGuides.js';
import journalRoutes from './routes/journal.js';
import chatRoutes from './routes/chat.js';
import legalQueriesRoutes from './routes/legalQueries.js';
import analyticsRoutes from './routes/analytics.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import supabaseAuth from './middleware/supabaseAuth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ---------- Env + Supabase bootstrap ----------
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

// Debug (safe): show whether envs are present (not their values)
console.log('🔧 ENV CHECK:',
  'SUPABASE_URL:', !!SUPABASE_URL,
  'SERVICE_ROLE:', !!SUPABASE_SERVICE_ROLE_KEY,
  'ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS || '(default)'
);

// Create Supabase client if configured; otherwise keep null and continue in dev
export const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

if (!supabase) {
  console.warn('⚠️  Supabase not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
  console.warn('    The server will start, but routes requiring auth should be used only after you add these.');
}

// Use a no-op auth middleware if Supabase is not configured (dev convenience)
const maybeAuth = supabase ? supabaseAuth : (req, _res, next) => next();

// ---------- App middleware ----------
app.set('trust proxy', 1); // so rate-limit uses correct IP behind proxies

// Security
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// CORS (allow dev ports by default, or use ALLOWED_ORIGINS env)
const defaultOrigins = ['http://localhost:4028', 'http://localhost:5173'];
const allowedOrigins =
  (process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean)) ||
  defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      // Allow no-origin (curl, mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Compression + body parsers
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || `${15 * 60 * 1000}`, 10), // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use(limiter);

// ---------- Health check ----------
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    supabaseConfigured: !!supabase,
  });
});

// ---------- API routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/users', maybeAuth, userRoutes);
app.use('/api/rights-guides', rightsGuidesRoutes);
app.use('/api/journal', maybeAuth, journalRoutes);
app.use('/api/chat', maybeAuth, chatRoutes);

/**
 * DEV-ONLY: Chat endpoints without auth so you can test the bot.
 * Re-enable `maybeAuth` when your frontend sends a Supabase Bearer token.
 */
app.use('/api/legal-queries', /* no auth */ legalQueriesRoutes);
app.use('/api/analytics', maybeAuth, analyticsRoutes);

// Alias for /ask (same router), also without auth in dev
app.use('/api/ask', /* no auth */ legalQueriesRoutes);

// 404 (catch-all)
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🚀 BeReady Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
