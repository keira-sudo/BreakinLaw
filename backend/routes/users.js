import express from 'express';
import { supabase } from '../server.js';

const router = express?.Router();

// Get user profile
router?.get('/profile', async (req, res, next) => {
  try {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', req?.user?.id)?.single();

    if (error) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'User profile not found'
      });
    }

    res?.json({
      profile: data
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router?.put('/profile', async (req, res, next) => {
  try {
    const {
      full_name,
      date_of_birth,
      location,
      phone,
      preferred_language
    } = req?.body;

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (date_of_birth !== undefined) updates.date_of_birth = date_of_birth;
    if (location !== undefined) updates.location = location;
    if (phone !== undefined) updates.phone = phone;
    if (preferred_language !== undefined) updates.preferred_language = preferred_language;

    if (Object.keys(updates)?.length === 0) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'No valid fields provided for update'
      });
    }

    const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', req?.user?.id)?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Update Failed',
        message: error?.message
      });
    }

    res?.json({
      message: 'Profile updated successfully',
      profile: data
    });
  } catch (error) {
    next(error);
  }
});

// Get user activity
router?.get('/activity', async (req, res, next) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = Math.min(parseInt(req?.query?.limit) || 20, 100);
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase?.from('user_activity')?.select('*', { count: 'exact' })?.eq('user_id', req?.user?.id)?.order('created_at', { ascending: false })?.range(offset, offset + limit - 1);

    if (error) {
      return res?.status(400)?.json({
        error: 'Query Failed',
        message: error?.message
      });
    }

    res?.json({
      activities: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Log user activity
router?.post('/activity', async (req, res, next) => {
  try {
    const {
      activity_type,
      entity_type,
      entity_id,
      metadata = {}
    } = req?.body;

    if (!activity_type) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Activity type is required'
      });
    }

    const { data, error } = await supabase?.from('user_activity')?.insert({
        user_id: req?.user?.id,
        activity_type,
        entity_type,
        entity_id,
        metadata,
        ip_address: req?.ip,
        user_agent: req?.get('User-Agent')
      })?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Activity Log Failed',
        message: error?.message
      });
    }

    res?.status(201)?.json({
      message: 'Activity logged successfully',
      activity: data
    });
  } catch (error) {
    next(error);
  }
});

export default router;