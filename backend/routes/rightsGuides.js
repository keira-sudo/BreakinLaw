import express from 'express';
import { supabase } from '../server.js';
import supabaseAuth from '../middleware/supabaseAuth.js';

const router = express?.Router();

// Get published guides (public endpoint)
router?.get('/', async (req, res, next) => {
  try {
    const {
      category,
      featured,
      search,
      page = 1,
      limit = 20
    } = req?.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase?.from('rights_guides')?.select(`
        id,
        title,
        slug,
        category,
        description,
        summary,
        keywords,
        author_id,
        featured,
        view_count,
        created_at,
        updated_at,
        author:user_profiles(full_name)
      `, { count: 'exact' })?.eq('status', 'published')?.order('created_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query?.eq('category', category);
    }

    if (featured === 'true') {
      query = query?.eq('featured', true);
    }

    if (search) {
      query = query?.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,summary.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query?.range(offset, offset + limitNum - 1);

    if (error) {
      return res?.status(400)?.json({
        error: 'Query Failed',
        message: error?.message
      });
    }

    res?.json({
      guides: data,
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

// Get guide by slug (public endpoint)
router?.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req?.params;

    const { data, error } = await supabase?.from('rights_guides')?.select(`
        *,
        author:user_profiles(full_name, role)
      `)?.eq('slug', slug)?.eq('status', 'published')?.single();

    if (error) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'Guide not found'
      });
    }

    // Increment view count
    await supabase?.from('rights_guides')?.update({ view_count: (data?.view_count || 0) + 1 })?.eq('id', data?.id);

    res?.json({
      guide: data
    });
  } catch (error) {
    next(error);
  }
});

// Create new guide (authenticated - requires legal_expert or admin role)
router?.post('/', supabaseAuth, async (req, res, next) => {
  try {
    const userRole = req?.userProfile?.role;
    
    if (!['admin', 'legal_expert']?.includes(userRole)) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'Only admins and legal experts can create guides'
      });
    }

    const {
      title,
      slug,
      category,
      description,
      content,
      summary,
      keywords = [],
      featured = false,
      status = 'draft'
    } = req?.body;

    if (!title || !slug || !category || !content) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Title, slug, category, and content are required'
      });
    }

    const { data, error } = await supabase?.from('rights_guides')?.insert({
        title,
        slug,
        category,
        description,
        content,
        summary,
        keywords,
        author_id: req?.user?.id,
        featured: userRole === 'admin' ? featured : false,
        status: userRole === 'admin' ? status : 'draft'
      })?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Creation Failed',
        message: error?.message
      });
    }

    res?.status(201)?.json({
      message: 'Guide created successfully',
      guide: data
    });
  } catch (error) {
    next(error);
  }
});

// Update guide (authenticated)
router?.put('/:id', supabaseAuth, async (req, res, next) => {
  try {
    const { id } = req?.params;
    const userRole = req?.userProfile?.role;

    // Check if guide exists and user has permission
    const { data: guide, error: fetchError } = await supabase?.from('rights_guides')?.select('author_id')?.eq('id', id)?.single();

    if (fetchError) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'Guide not found'
      });
    }

    // Only admin or the author can update
    if (userRole !== 'admin' && guide?.author_id !== req?.user?.id) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'You can only update your own guides'
      });
    }

    const {
      title,
      slug,
      category,
      description,
      content,
      summary,
      keywords,
      featured,
      status
    } = req?.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (slug !== undefined) updates.slug = slug;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (content !== undefined) updates.content = content;
    if (summary !== undefined) updates.summary = summary;
    if (keywords !== undefined) updates.keywords = keywords;
    
    // Only admin can change featured status
    if (userRole === 'admin' && featured !== undefined) {
      updates.featured = featured;
    }
    
    // Only admin can publish directly
    if (userRole === 'admin' && status !== undefined) {
      updates.status = status;
    }

    if (Object.keys(updates)?.length === 0) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'No valid fields provided for update'
      });
    }

    const { data, error } = await supabase?.from('rights_guides')?.update(updates)?.eq('id', id)?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Update Failed',
        message: error?.message
      });
    }

    res?.json({
      message: 'Guide updated successfully',
      guide: data
    });
  } catch (error) {
    next(error);
  }
});

// Delete guide (authenticated - admin or author)
router?.delete('/:id', supabaseAuth, async (req, res, next) => {
  try {
    const { id } = req?.params;
    const userRole = req?.userProfile?.role;

    // Check if guide exists and user has permission
    const { data: guide, error: fetchError } = await supabase?.from('rights_guides')?.select('author_id')?.eq('id', id)?.single();

    if (fetchError) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'Guide not found'
      });
    }

    // Only admin or the author can delete
    if (userRole !== 'admin' && guide?.author_id !== req?.user?.id) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'You can only delete your own guides'
      });
    }

    const { error } = await supabase?.from('rights_guides')?.delete()?.eq('id', id);

    if (error) {
      return res?.status(400)?.json({
        error: 'Deletion Failed',
        message: error?.message
      });
    }

    res?.json({
      message: 'Guide deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get categories (public)
router?.get('/meta/categories', async (req, res, next) => {
  try {
    const categories = [
      'housing',
      'consumer', 
      'employment',
      'benefits',
      'family',
      'immigration',
      'other'
    ];

    res?.json({
      categories
    });
  } catch (error) {
    next(error);
  }
});

export default router;