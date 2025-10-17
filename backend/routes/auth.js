import express from 'express';
import { supabase } from '../server.js';
import jwt from 'jsonwebtoken';

const router = express?.Router();

// Sign Up endpoint with JWT session cookies
router?.post('/signup', async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'user' } = req?.body;

    if (!email || !password) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    if (password?.length < 8) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Validate password strength
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(password)) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Password must contain uppercase, lowercase, and number'
      });
    }

    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email?.split('@')?.[0],
          role
        }
      }
    });

    if (error) {
      return res?.status(400)?.json({
        error: 'Signup Failed',
        message: error?.message
      });
    }

    // Create JWT session and set HTTP-only cookie
    if (data?.session?.access_token) {
      const sessionData = {
        userId: data?.user?.id,
        email: data?.user?.email,
        sessionId: data?.session?.access_token
      };

      const jwtToken = jwt?.sign(sessionData, process?.env?.JWT_SECRET || 'fallback-secret', {
        expiresIn: '7d'
      });

      // Set HTTP-only cookie
      res?.cookie('session', jwtToken, {
        httpOnly: true,
        secure: process?.env?.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    res?.status(201)?.json({
      message: 'User created successfully',
      user: {
        id: data?.user?.id,
        email: data?.user?.email,
        email_confirmed_at: data?.user?.email_confirmed_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Sign In endpoint with JWT session cookies  
router?.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req?.body;

    if (!email || !password) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res?.status(401)?.json({
        error: 'Authentication Failed',
        message: error?.message
      });
    }

    // Get user profile
    const { data: userProfile } = await supabase?.from('user_profiles')?.select('*')?.eq('id', data?.user?.id)?.single();

    // Create JWT session and set HTTP-only cookie
    const sessionData = {
      userId: data?.user?.id,
      email: data?.user?.email,
      sessionId: data?.session?.access_token
    };

    const jwtToken = jwt?.sign(sessionData, process?.env?.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });

    // Set HTTP-only cookie
    res?.cookie('session', jwtToken, {
      httpOnly: true,
      secure: process?.env?.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res?.json({
      message: 'Signed in successfully',
      user: {
        id: data?.user?.id,
        email: data?.user?.email,
        profile: userProfile
      }
    });
  } catch (error) {
    next(error);
  }
});

// Logout endpoint - clear session cookie
router?.post('/logout', async (req, res, next) => {
  try {
    // Clear the session cookie
    res?.clearCookie('session');

    // Also sign out from Supabase
    const { error } = await supabase?.auth?.signOut();

    if (error) {
      console.error('Supabase signout error:', error);
      // Don't fail the request if Supabase signout fails
    }

    res?.json({
      message: 'Signed out successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Session middleware for verifying JWT cookies
export const sessionMiddleware = (req, res, next) => {
  try {
    const sessionCookie = req?.cookies?.session;

    if (!sessionCookie) {
      return res?.status(401)?.json({
        error: 'Unauthorized',
        message: 'No session found'
      });
    }

    const decoded = jwt?.verify(sessionCookie, process?.env?.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res?.clearCookie('session');
    return res?.status(401)?.json({
      error: 'Unauthorized',
      message: 'Invalid session'
    });
  }
};

// Get Current User endpoint
router?.get('/me', sessionMiddleware, async (req, res, next) => {
  try {
    const userId = req?.user?.userId;
    
    // Get user profile from database
    const { data: userProfile, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();

    if (error && error?.code !== 'PGRST116') {
      return res?.status(404)?.json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }

    res?.json({
      user: {
        id: userId,
        email: req?.user?.email,
        profile: userProfile
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;