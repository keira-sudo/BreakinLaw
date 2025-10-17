import express from 'express';
import { supabase } from '../server.js';

const router = express?.Router();

// Get user dashboard analytics
router?.get('/dashboard', async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const userRole = req?.userProfile?.role;

    // Base analytics for all users
    let analytics = {
      user: {
        journalEntries: { total: 0, resolved: 0, unresolved: 0 },
        chatSessions: { total: 0, active: 0 },
        legalQueries: { total: 0, resolved: 0, pending: 0 },
        recentActivity: []
      }
    };

    // Get journal entries stats
    const { data: journalData, error: journalError } = await supabase?.from('rights_journal_entries')?.select('is_resolved')?.eq('user_id', userId);

    if (!journalError && journalData) {
      analytics.user.journalEntries = {
        total: journalData?.length,
        resolved: journalData?.filter(entry => entry?.is_resolved)?.length,
        unresolved: journalData?.filter(entry => !entry?.is_resolved)?.length
      };
    }

    // Get chat sessions stats
    const { data: chatData, error: chatError } = await supabase?.from('chat_sessions')?.select('is_active')?.eq('user_id', userId);

    if (!chatError && chatData) {
      analytics.user.chatSessions = {
        total: chatData?.length,
        active: chatData?.filter(session => session?.is_active)?.length
      };
    }

    // Get legal queries stats
    const { data: queryData, error: queryError } = await supabase?.from('legal_queries')?.select('status')?.eq('user_id', userId);

    if (!queryError && queryData) {
      analytics.user.legalQueries = {
        total: queryData?.length,
        resolved: queryData?.filter(query => query?.status === 'resolved')?.length,
        pending: queryData?.filter(query => query?.status === 'pending')?.length
      };
    }

    // Get recent activity
    const { data: activityData, error: activityError } = await supabase?.from('user_activity')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(10);

    if (!activityError && activityData) {
      analytics.user.recentActivity = activityData;
    }

    // Admin/Expert additional analytics
    if (['admin', 'legal_expert']?.includes(userRole)) {
      analytics.system = {};

      // System-wide stats for admins/experts
      const { data: allQueries, error: allQueriesError } = await supabase?.from('legal_queries')?.select('status, category, priority, created_at');

      if (!allQueriesError && allQueries) {
        analytics.system.queries = {
          total: allQueries?.length,
          byStatus: {},
          byCategory: {},
          byPriority: {},
          recent: allQueries?.slice(0, 5)
        };

        allQueries?.forEach(query => {
          analytics.system.queries.byStatus[query.status] = 
            (analytics?.system?.queries?.byStatus?.[query?.status] || 0) + 1;
          analytics.system.queries.byCategory[query.category] = 
            (analytics?.system?.queries?.byCategory?.[query?.category] || 0) + 1;
          analytics.system.queries.byPriority[query.priority] = 
            (analytics?.system?.queries?.byPriority?.[query?.priority] || 0) + 1;
        });
      }

      // User registrations (last 30 days)
      if (userRole === 'admin') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo?.setDate(thirtyDaysAgo?.getDate() - 30);

        const { data: newUsers, error: newUsersError } = await supabase?.from('user_profiles')?.select('created_at, role')?.gte('created_at', thirtyDaysAgo?.toISOString());

        if (!newUsersError && newUsers) {
          analytics.system.users = {
            newRegistrations: newUsers?.length,
            byRole: {}
          };

          newUsers?.forEach(user => {
            analytics.system.users.byRole[user.role] = 
              (analytics?.system?.users?.byRole?.[user?.role] || 0) + 1;
          });
        }

        // Popular guides
        const { data: popularGuides, error: guidesError } = await supabase?.from('rights_guides')?.select('title, view_count, category')?.eq('status', 'published')?.order('view_count', { ascending: false })?.limit(5);

        if (!guidesError && popularGuides) {
          analytics.system.guides = {
            popular: popularGuides
          };
        }
      }
    }

    res?.json({
      analytics
    });
  } catch (error) {
    next(error);
  }
});

// Get guide analytics (admin/legal_expert only)
router?.get('/guides', async (req, res, next) => {
  try {
    const userRole = req?.userProfile?.role;

    if (!['admin', 'legal_expert']?.includes(userRole)) {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'Only admins and legal experts can view guide analytics'
      });
    }

    const { data, error } = await supabase?.from('rights_guides')?.select('id, title, slug, category, status, view_count, featured, created_at, author_id')?.order('view_count', { ascending: false });

    if (error) {
      return res?.status(400)?.json({
        error: 'Query Failed',
        message: error?.message
      });
    }

    const analytics = {
      total: data?.length,
      published: data?.filter(guide => guide?.status === 'published')?.length,
      draft: data?.filter(guide => guide?.status === 'draft')?.length,
      featured: data?.filter(guide => guide?.featured)?.length,
      totalViews: data?.reduce((sum, guide) => sum + (guide?.view_count || 0), 0),
      byCategory: {},
      topGuides: data?.slice(0, 10)
    };

    // Count by category
    data?.forEach(guide => {
      analytics.byCategory[guide.category] = 
        (analytics?.byCategory?.[guide?.category] || 0) + 1;
    });

    res?.json({
      analytics
    });
  } catch (error) {
    next(error);
  }
});

// Log activity (internal use)
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

// Get activity trends (admin only)
router?.get('/trends', async (req, res, next) => {
  try {
    if (req?.userProfile?.role !== 'admin') {
      return res?.status(403)?.json({
        error: 'Forbidden',
        message: 'Only admins can view activity trends'
      });
    }

    const { 
      days = 30,
      activity_type
    } = req?.query;

    const daysAgo = new Date();
    daysAgo?.setDate(daysAgo?.getDate() - parseInt(days));

    let query = supabase?.from('user_activity')?.select('activity_type, entity_type, created_at')?.gte('created_at', daysAgo?.toISOString())?.order('created_at', { ascending: false });

    if (activity_type) {
      query = query?.eq('activity_type', activity_type);
    }

    const { data, error } = await query;

    if (error) {
      return res?.status(400)?.json({
        error: 'Query Failed',
        message: error?.message
      });
    }

    // Group by date and activity type
    const trends = {};
    const activityCounts = {};

    data?.forEach(activity => {
      const date = activity?.created_at?.split('T')?.[0]; // Get YYYY-MM-DD
      
      if (!trends?.[date]) {
        trends[date] = {};
      }
      
      trends[date][activity.activity_type] = 
        (trends?.[date]?.[activity?.activity_type] || 0) + 1;
      
      activityCounts[activity.activity_type] = 
        (activityCounts?.[activity?.activity_type] || 0) + 1;
    });

    res?.json({
      trends: {
        dailyActivity: trends,
        totalsByType: activityCounts,
        totalActivities: data?.length,
        dateRange: {
          from: daysAgo?.toISOString()?.split('T')?.[0],
          to: new Date()?.toISOString()?.split('T')?.[0]
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;