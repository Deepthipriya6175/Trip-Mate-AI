import { verifyToken } from '../utils/jwt.js';
import { supabase, isUsingLiveSupabase, localStore } from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token required. Please sign in.'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session. Please sign in again.'
    });
  }

  // Find user details to ensure active validity
  let user = null;
  if (isUsingLiveSupabase() && supabase) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', decoded.id)
        .single();
      user = data;
    } catch (err) {
      console.warn('Supabase auth lookup error:', err.message);
    }
  }

  if (!user) {
    user = localStore.findUserById(decoded.id);
  }

  if (!user) {
    // If not found in store, use payload identity
    user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'tourist',
      full_name: decoded.full_name || 'Guest User'
    };
  }

  req.user = user;
  next();
};

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized.' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: `Access forbidden: requires ${allowedRoles.join(' or ')} role.`
      });
    }

    next();
  };
};

