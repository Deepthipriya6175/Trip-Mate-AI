import { hashPassword, comparePassword, signToken } from '../utils/jwt.js';
import { supabase, isUsingLiveSupabase, localStore } from '../config/db.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role = 'tourist', preferred_language = 'en', phone = '', hotel_id } = req.body;

    // Check existing
    let existing = null;
    if (isUsingLiveSupabase() && supabase) {
      const { data } = await supabase.from('profiles').select('id').eq('email', email).single();
      existing = data;
    } else {
      existing = localStore.findUserByEmail(email);
    }

    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }

    const password_hash = await hashPassword(password);
    let newUser = null;

    if (isUsingLiveSupabase() && supabase) {
      const { data, error } = await supabase.from('profiles').insert([{
        email,
        password_hash,
        full_name,
        role,
        preferred_language,
        phone
      }]).select().single();

      if (error) throw error;
      newUser = data;

      if (role === 'hotel_staff' && hotel_id) {
        await supabase.from('hotel_staff').insert([{
          user_id: newUser.id,
          hotel_id,
          department: 'front_desk',
          role_title: 'Staff Member'
        }]);
      }
    } else {
      newUser = localStore.createUser({
        email,
        password_hash,
        full_name,
        role,
        preferred_language,
        phone
      });

      if (role === 'hotel_staff' && hotel_id) {
        newUser.hotel_id = hotel_id;
      }
    }

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      full_name: newUser.full_name
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        preferred_language: newUser.preferred_language,
        phone: newUser.phone,
        hotel_id: newUser.hotel_id
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = null;
    if (isUsingLiveSupabase() && supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('email', email).single();
      user = data;
    } else {
      user = localStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    });

    res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_language: user.preferred_language || 'en',
        phone: user.phone || '',
        hotel_id: user.hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};

export const demoLogin = async (req, res, next) => {
  try {
    const { role = 'tourist' } = req.body;
    const demoEmails = {
      tourist: 'tourist@tripmate.com',
      hotel_staff: 'staff@tripmate.com',
      admin: 'admin@tripmate.com'
    };

    const targetEmail = demoEmails[role] || demoEmails.tourist;
    let user = localStore.findUserByEmail(targetEmail);

    if (!user) {
      user = localStore.users.find(u => u.role === role) || localStore.users[0];
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    });

    res.json({
      success: true,
      message: `Signed in as Demo ${role.toUpperCase()}.`,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        preferred_language: user.preferred_language || 'en',
        phone: user.phone || '',
        hotel_id: user.hotel_id || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      }
    });
  } catch (err) {
    next(err);
  }
};

