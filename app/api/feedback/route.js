import { supabase } from '../../../src/lib/supabase';

export async function POST(request) {
  try {
    // Parse request body
    const { eventId, rating, note, editedAnswerJson } = await request?.json();
    
    // Validate required fields
    if (!eventId || !rating) {
      return Response.json(
        { error: 'eventId and rating are required' },
        { status: 400 }
      );
    }

    if (!['up', 'down']?.includes(rating)) {
      return Response.json(
        { error: 'rating must be "up" or "down"' },
        { status: 400 }
      );
    }

    // Get user session
    const { data: { user }, error: authError } = await supabase?.auth?.getUser();
    if (authError || !user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify the QA event belongs to the user
    const { data: qaEvent, error: qaError } = await supabase?.from('qa_events')?.select('id, user_id')?.eq('id', eventId)?.single();

    if (qaError || !qaEvent) {
      return Response.json(
        { error: 'QA event not found' },
        { status: 404 }
      );
    }

    if (qaEvent?.user_id !== user?.id) {
      return Response.json(
        { error: 'Unauthorized to provide feedback on this event' },
        { status: 403 }
      );
    }

    // Check if feedback already exists for this event
    const { data: existingFeedback } = await supabase?.from('feedback')?.select('id')?.eq('qa_event_id', eventId)?.single();

    let result;

    if (existingFeedback) {
      // Update existing feedback
      const { data, error } = await supabase?.from('feedback')?.update({
          rating,
          note: note || null,
          edited_answer_json: editedAnswerJson || null,
        })?.eq('id', existingFeedback?.id)?.select()?.single();

      if (error) {
        console.error('Error updating feedback:', error);
        return Response.json(
          { error: 'Failed to update feedback' },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new feedback
      const { data, error } = await supabase?.from('feedback')?.insert({
          qa_event_id: eventId,
          rating,
          note: note || null,
          edited_answer_json: editedAnswerJson || null,
        })?.select()?.single();

      if (error) {
        console.error('Error creating feedback:', error);
        return Response.json(
          { error: 'Failed to create feedback' },
          { status: 500 }
        );
      }

      result = data;
    }

    return Response.json({
      message: 'Feedback saved successfully',
      feedback: result
    });

  } catch (error) {
    console.error('Error in /api/feedback:', error);
    return Response.json(
      { 
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}