import express from 'express';
import { supabase } from '../server.js';

const router = express.Router();

// Get user's journal entries
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      search,
      resolved,
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('rights_journal_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (resolved !== undefined) {
      query = query.eq('is_resolved', resolved === 'true');
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,evidence_notes.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query.range(offset, offset + limitNum - 1);

    if (error) {
      return res.status(400).json({
        error: 'Query Failed',
        message: error.message
      });
    }

    res.json({
      entries: data,
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

// Get specific journal entry
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('rights_journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Journal entry not found'
      });
    }

    res.json({
      entry: data
    });
  } catch (error) {
    next(error);
  }
});

// Create journal entry
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      incident_date,
      location,
      people_involved = [],
      evidence_notes,
      follow_up_actions,
      tags = [],
      is_resolved = false,
      private_notes
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Title and category are required'
      });
    }

    const { data, error } = await supabase
      .from('rights_journal_entries')
      .insert({
        user_id: req.user.id,
        title,
        category,
        description,
        incident_date,
        location,
        people_involved,
        evidence_notes,
        follow_up_actions,
        tags,
        is_resolved,
        private_notes
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
      message: 'Journal entry created successfully',
      entry: data
    });
  } catch (error) {
    next(error);
  }
});

// Update journal entry
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if entry exists and belongs to user
    const { data: entry, error: fetchError } = await supabase
      .from('rights_journal_entries')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Journal entry not found'
      });
    }

    const {
      title,
      category,
      description,
      incident_date,
      location,
      people_involved,
      evidence_notes,
      follow_up_actions,
      tags,
      is_resolved,
      private_notes
    } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (incident_date !== undefined) updates.incident_date = incident_date;
    if (location !== undefined) updates.location = location;
    if (people_involved !== undefined) updates.people_involved = people_involved;
    if (evidence_notes !== undefined) updates.evidence_notes = evidence_notes;
    if (follow_up_actions !== undefined) updates.follow_up_actions = follow_up_actions;
    if (tags !== undefined) updates.tags = tags;
    if (is_resolved !== undefined) updates.is_resolved = is_resolved;
    if (private_notes !== undefined) updates.private_notes = private_notes;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No valid fields provided for update'
      });
    }

    const { data, error } = await supabase
      .from('rights_journal_entries')
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
      message: 'Journal entry updated successfully',
      entry: data
    });
  } catch (error) {
    next(error);
  }
});

// Delete journal entry
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('rights_journal_entries')
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
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get journal statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('rights_journal_entries')
      .select('category, is_resolved')
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({
        error: 'Query Failed',
        message: error.message
      });
    }

    const stats = {
      total: data.length,
      resolved: data.filter(entry => entry.is_resolved).length,
      unresolved: data.filter(entry => !entry.is_resolved).length,
      byCategory: {}
    };

    // Count by category
    data.forEach(entry => {
      if (!stats.byCategory[entry.category]) {
        stats.byCategory[entry.category] = { total: 0, resolved: 0, unresolved: 0 };
      }
      stats.byCategory[entry.category].total++;
      if (entry.is_resolved) {
        stats.byCategory[entry.category].resolved++;
      } else {
        stats.byCategory[entry.category].unresolved++;
      }
    });

    res.json({
      stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;