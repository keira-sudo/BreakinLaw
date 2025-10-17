import express from 'express';
import { supabase } from '../server.js';

const router = express.Router();

// Get user's chat sessions
router.get('/sessions', async (req, res, next) => {
  try {
    const {
      category,
      active,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('chat_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (active !== undefined) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error, count } = await query.range(offset, offset + limitNum - 1);

    if (error) {
      return res.status(400).json({
        error: 'Query Failed',
        message: error.message
      });
    }

    res.json({
      sessions: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create new chat session
router.post('/sessions', async (req, res, next) => {
  try {
    const {
      title,
      category = 'other'
    } = req.body;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: req.user.id,
        title: title || `New chat - ${new Date().toLocaleDateString()}`,
        category
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Creation Failed',
        message: error.message
      });
    }

    res.status(201).json({
      message: 'Chat session created successfully',
      session: data
    });
  } catch (error) {
    next(error);
  }
});

// Get specific chat session with messages
router.get('/sessions/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (sessionError) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Chat session not found'
      });
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      return res.status(400).json({
        error: 'Query Failed',
        message: messagesError.message
      });
    }

    res.json({
      session: {
        ...session,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update chat session
router.put('/sessions/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      is_active
    } = req.body;

    // Check if session exists and belongs to user
    const { data: session, error: fetchError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Chat session not found'
      });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No valid fields provided for update'
      });
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Update Failed',
        message: error.message
      });
    }

    res.json({
      message: 'Chat session updated successfully',
      session: data
    });
  } catch (error) {
    next(error);
  }
});

// Delete chat session
router.delete('/sessions/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({
        error: 'Deletion Failed',
        message: error.message
      });
    }

    res.json({
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Send message in chat session
router.post('/sessions/:sessionId/messages', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const {
      message,
      is_from_ai = false,
      metadata = {}
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message content is required'
      });
    }

    // Verify session exists and belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', req.user.id)
      .single();

    if (sessionError) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Chat session not found'
      });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: req.user.id,
        message,
        is_from_ai,
        metadata
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: 'Message Failed',
        message: error.message
      });
    }

    // Update session updated_at timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    res.status(201).json({
      message: 'Message sent successfully',
      chatMessage: data
    });
  } catch (error) {
    next(error);
  }
});

// Get messages for a session (with pagination)
router.get('/sessions/:sessionId/messages', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const {
      page = 1,
      limit = 50
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    // Verify session exists and belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', req.user.id)
      .single();

    if (sessionError) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Chat session not found'
      });
    }

    const { data, error, count } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limitNum - 1);

    if (error) {
      return res.status(400).json({
        error: 'Query Failed',
        message: error.message
      });
    }

    res.json({
      messages: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;