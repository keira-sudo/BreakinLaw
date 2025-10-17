import express from 'express';
import { supabase } from '../server.js';
import { chat } from '../../lib/llm.ts'
; // Import Ollama chat function

const router = express?.Router();

// Add the missing /ask endpoint
router?.post('/ask', async (req, res, next) => {
  try {
    // Parse request body
    const { question } = req?.body;
    
    if (!question || typeof question !== 'string' || question?.trim()?.length === 0) {
      return res?.status(400)?.json({
        error: 'Question is required and must be a non-empty string'
      });
    }

    // Prepare messages for Ollama chat
    const messages = [
      {
        role: 'system',
        content: `You are a legal AI assistant specializing in UK law. Provide helpful legal guidance while being clear about limitations. 
        
        IMPORTANT GUIDELINES:
        - Always specify jurisdiction (England & Wales, Scotland, or Northern Ireland)
        - Provide practical step-by-step guidance
        - Highlight risks and deadlines
        - Advise when to seek professional legal advice
        - Include relevant legal citations where possible
        
        Respond in JSON format with these fields:
        {
          "jurisdiction": "England & Wales",
          "short_answer": "Brief summary",
          "step_by_step_plan": ["Step 1", "Step 2", "Step 3"],
          "risks_or_deadlines": ["Risk 1", "Risk 2"],
          "when_to_seek_a_solicitor": "Guidance on when professional help is needed",
          "citations": [{"title": "Legal Reference", "url": "link", "last_updated": "date"}],
          "confidence": 0.8
        }`
      },
      {
        role: 'user',
        content: question?.trim()
      }
    ];

    // Call Ollama with user's configuration
    let aiResponse;
    try {
      const rawResponse = await chat(messages, {
        temperature: 0.2,
        max_tokens: 4096,
        response_format: { type: 'json_schema' }
      });
      
      // Parse AI response
      aiResponse = JSON.parse(rawResponse);
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Fallback response if AI fails
      aiResponse = {
        jurisdiction: "England & Wales",
        short_answer: `I encountered an issue processing your question: "${question}". ${aiError?.message?.includes('connect') ? 'The local AI service (Ollama) appears to be unavailable.' : 'There was a processing error.'} Please try again or consult a legal professional.`,
        step_by_step_plan: [
          "Verify your question is clear and specific",
          "Try rephrasing your legal query",
          "Consider consulting with a qualified solicitor for complex matters"
        ],
        risks_or_deadlines: [
          "AI service temporarily unavailable - seek professional advice for urgent matters",
          "Do not rely solely on AI guidance for important legal decisions"
        ],
        when_to_seek_a_solicitor: "Given the current AI processing issue, it's recommended to consult a qualified solicitor for reliable legal guidance.",
        citations: [],
        confidence: 0.1
      };
    }

    // Structure response to match frontend expectations
    const structuredResponse = {
      answer: {
        jurisdiction: aiResponse?.jurisdiction || "England & Wales",
        short_answer: aiResponse?.short_answer || "Unable to process your legal query at this time.",
        step_by_step_plan: Array.isArray(aiResponse?.step_by_step_plan) ? aiResponse?.step_by_step_plan : [],
        risks_or_deadlines: Array.isArray(aiResponse?.risks_or_deadlines) ? aiResponse?.risks_or_deadlines : [],
        when_to_seek_a_solicitor: aiResponse?.when_to_seek_a_solicitor || "Consult a qualified solicitor for personalized legal advice.",
        citations: Array.isArray(aiResponse?.citations) ? aiResponse?.citations : [],
        confidence: aiResponse?.confidence || 0.5
      },
      metadata: {
        intent: "legal_query",
        chunks_retrieved: 0,
        qa_event_id: null,
        ai_provider: "ollama",
        model: process.env?.OLLAMA_MODEL || "llama3.1:8b"
      }
    };

    // Save QA event to database
    const { data: qaEvent, error: saveError } = await supabase?.from('qa_events')?.insert({
        user_id: req?.user?.id,
        question: question?.trim(),
        answer_json: structuredResponse?.answer,
        retrieved_chunk_ids: [],
        confidence: structuredResponse?.answer?.confidence || 0.5
      })?.select()?.single();

    if (saveError) {
      console.error('Error saving QA event:', saveError);
      // Don't fail the request if saving fails - just log it
    } else {
      structuredResponse.metadata.qa_event_id = qaEvent?.id;
    }

    res?.json(structuredResponse);

  } catch (error) {
    console.error('Error in /api/legal-queries/ask:', error);
    
    // Enhanced error handling for Ollama-specific issues
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let errorType = 'internal_error';
    
    if (error?.message?.includes('connect to Ollama server')) {
      errorMessage = 'Local AI service (Ollama) is not running. Please start Ollama and try again.';
      errorType = 'service_unavailable';
    } else if (error?.message?.includes('model') && error?.message?.includes('not found')) {
      errorMessage = 'The required AI model is not available. Please ensure the specified Ollama model is installed.';
      errorType = 'model_unavailable';
    } else if (error?.message?.includes('timed out')) {
      errorMessage = 'The AI request timed out. Please try again with a shorter question.';
      errorType = 'timeout_error';
    }
    
    res?.status(500)?.json({
      error: errorType,
      message: errorMessage
    });
  }
});

// Get legal queries (user gets their own, experts/admins get assigned or all)
router?.get('/', async (req, res, next) => {
  try {
    const {
      status,
      category,
      priority,
      search,
      page = 1,
      limit = 20
    } = req?.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const offset = (pageNum - 1) * limitNum;
    const userRole = req?.userProfile?.role;

    let query = supabase?.from('legal_queries')?.select(`
        *,
        user:user_profiles!legal_queries_user_id_fkey(full_name, email),
        assigned_user:user_profiles!legal_queries_assigned_to_fkey(full_name, email, role)
      `, { count: 'exact' })?.order('created_at', { ascending: false });

    // Filter based on user role
    if (userRole === 'user') {
      query = query?.eq('user_id', req?.user?.id);
    } else if (userRole === 'legal_expert') {
      query = query?.or(`assigned_to.eq.${req?.user?.id},status.eq.pending`);
    }
    // Admins can see all queries

    // Apply additional filters
    if (status) {
      query = query?.eq('status', status);
    }

    if (category) {
      query = query?.eq('category', category);
    }

    if (priority) {
      query = query?.eq('priority', priority);
    }

    if (search) {
      query = query?.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,resolution.ilike.%${search}%`
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
      queries: data,
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

// Get specific legal query
router?.get('/:id', async (req, res, next) => {
  try {
    const { id } = req?.params;
    const userRole = req?.userProfile?.role;

    const { data, error } = await supabase?.from('legal_queries')?.select(`
        *,
        user:user_profiles!legal_queries_user_id_fkey(full_name, email),
        assigned_user:user_profiles!legal_queries_assigned_to_fkey(full_name, email, role)
      `)?.eq('id', id)?.single();

    if (error) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'Legal query not found'
      });
    }

    // Check permissions
    const canView = 
      userRole === 'admin' ||
      data?.user_id === req?.user?.id ||
      data?.assigned_to === req?.user?.id ||
      (userRole === 'legal_expert' && data?.status === 'pending');

    if (!canView) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'You do not have permission to view this query'
      });
    }

    res?.json({
      query: data
    });
  } catch (error) {
    next(error);
  }
});

// Create legal query
router?.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority = 'medium',
      due_date
    } = req?.body;

    if (!title || !description || !category) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Title, description, and category are required'
      });
    }

    const { data, error } = await supabase?.from('legal_queries')?.insert({
        user_id: req?.user?.id,
        title,
        description,
        category,
        priority,
        due_date,
        status: 'pending'
      })?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Creation Failed',
        message: error?.message
      });
    }

    res?.status(201)?.json({
      message: 'Legal query created successfully',
      query: data
    });
  } catch (error) {
    next(error);
  }
});

// Update legal query
router?.put('/:id', async (req, res, next) => {
  try {
    const { id } = req?.params;
    const userRole = req?.userProfile?.role;

    // Get current query
    const { data: query, error: fetchError } = await supabase?.from('legal_queries')?.select('user_id, assigned_to, status')?.eq('id', id)?.single();

    if (fetchError) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'Legal query not found'
      });
    }

    // Check permissions
    const canUpdate = 
      userRole === 'admin' ||
      query?.user_id === req?.user?.id ||
      query?.assigned_to === req?.user?.id;

    if (!canUpdate) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'You do not have permission to update this query'
      });
    }

    const {
      title,
      description,
      category,
      priority,
      status,
      assigned_to,
      due_date,
      resolution
    } = req?.body;

    const updates = {};
    
    // Users can update basic info only if it's their query and still pending
    if (query?.user_id === req?.user?.id) {
      if (title !== undefined && query?.status === 'pending') updates.title = title;
      if (description !== undefined && query?.status === 'pending') updates.description = description;
      if (category !== undefined && query?.status === 'pending') updates.category = category;
      if (priority !== undefined && query?.status === 'pending') updates.priority = priority;
    }

    // Experts and admins can update more fields
    if (['admin', 'legal_expert']?.includes(userRole)) {
      if (status !== undefined) updates.status = status;
      if (due_date !== undefined) updates.due_date = due_date;
      if (resolution !== undefined) updates.resolution = resolution;
      
      // Set resolved timestamp if marking as resolved
      if (status === 'resolved' && query?.status !== 'resolved') {
        updates.resolved_at = new Date()?.toISOString();
      }
    }

    // Only admins can reassign queries
    if (userRole === 'admin' && assigned_to !== undefined) {
      updates.assigned_to = assigned_to;
    }

    if (Object.keys(updates)?.length === 0) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'No valid fields provided for update'
      });
    }

    const { data, error } = await supabase?.from('legal_queries')?.update(updates)?.eq('id', id)?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Update Failed',
        message: error?.message
      });
    }

    res?.json({
      message: 'Legal query updated successfully',
      query: data
    });
  } catch (error) {
    next(error);
  }
});

// Assign query to expert (admin only)
router?.post('/:id/assign', async (req, res, next) => {
  try {
    const { id } = req?.params;
    const { assigned_to } = req?.body;

    if (req?.userProfile?.role !== 'admin') {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'Only admins can assign queries'
      });
    }

    if (!assigned_to) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'assigned_to is required'
      });
    }

    // Verify the assigned user exists and is a legal expert
    const { data: assignee, error: assigneeError } = await supabase?.from('user_profiles')?.select('role')?.eq('id', assigned_to)?.single();

    if (assigneeError || !['admin', 'legal_expert']?.includes(assignee?.role)) {
      return res?.status(400)?.json({
        error: 'Bad Request',
        message: 'Can only assign to legal experts or admins'
      });
    }

    const { data, error } = await supabase?.from('legal_queries')?.update({ 
        assigned_to,
        status: 'in_progress'
      })?.eq('id', id)?.select()?.single();

    if (error) {
      return res?.status(400)?.json({
        error: 'Assignment Failed',
        message: error?.message
      });
    }

    res?.json({
      message: 'Query assigned successfully',
      query: data
    });
  } catch (error) {
    next(error);
  }
});

// Delete legal query (admin or query owner only)
router?.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req?.params;
    const userRole = req?.userProfile?.role;

    // Get current query
    const { data: query, error: fetchError } = await supabase?.from('legal_queries')?.select('user_id')?.eq('id', id)?.single();

    if (fetchError) {
      return res?.status(404)?.json({
        error: 'Not Found',
        message: 'Legal query not found'
      });
    }

    // Check permissions - only admin or query owner can delete
    const canDelete = 
      userRole === 'admin' ||
      query?.user_id === req?.user?.id;

    if (!canDelete) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this query'
      });
    }

    const { error } = await supabase?.from('legal_queries')?.delete()?.eq('id', id);

    if (error) {
      return res?.status(400)?.json({
        error: 'Deletion Failed',
        message: error?.message
      });
    }

    res?.json({
      message: 'Legal query deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get query statistics (admin/expert only)
router?.get('/stats/summary', async (req, res, next) => {
  try {
    const userRole = req?.userProfile?.role;

    if (!['admin', 'legal_expert']?.includes(userRole)) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'Only admins and legal experts can view query statistics'
      });
    }

    let query = supabase?.from('legal_queries')?.select('status, category, priority, assigned_to');

    // Legal experts see only their assigned queries + pending
    if (userRole === 'legal_expert') {
      query = query?.or(`assigned_to.eq.${req?.user?.id},status.eq.pending`);
    }

    const { data, error } = await query;

    if (error) {
      return res?.status(400)?.json({
        error: 'Query Failed',
        message: error?.message
      });
    }

    const stats = {
      total: data?.length,
      byStatus: {},
      byCategory: {},
      byPriority: {},
      assigned: 0,
      unassigned: 0
    };

    data?.forEach(query => {
      // Status counts
      stats.byStatus[query.status] = (stats?.byStatus?.[query?.status] || 0) + 1;
      
      // Category counts
      stats.byCategory[query.category] = (stats?.byCategory?.[query?.category] || 0) + 1;
      
      // Priority counts
      stats.byPriority[query.priority] = (stats?.byPriority?.[query?.priority] || 0) + 1;
      
      // Assignment status
      if (query?.assigned_to) {
        stats.assigned++;
      } else {
        stats.unassigned++;
      }
    });

    res?.json({
      stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;