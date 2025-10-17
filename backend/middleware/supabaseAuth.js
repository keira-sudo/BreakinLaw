import { supabase } from '../server.js';

const supabaseAuth = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res?.status(401)?.json({
        error: 'Unauthorized',
        message: 'No valid authorization token provided'
      });
    }

    const token = authHeader?.split(' ')?.[1];
    
    if (!token) {
      return res?.status(401)?.json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase?.auth?.getUser(token);
    
    if (error || !user) {
      return res?.status(401)?.json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single();

    if (profileError && profileError?.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Profile fetch error:', profileError);
    }

    // Attach user info to request
    req.user = user;
    req.userProfile = userProfile;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res?.status(500)?.json({
      error: 'Internal Server Error',
      message: 'Authentication service unavailable'
    });
  }
};

export default supabaseAuth;