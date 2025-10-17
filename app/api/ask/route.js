import { supabase } from '../../../src/lib/supabase';
import { chat } from '../../../lib/llm';
import { SYSTEM_PROMPT, userPrompt } from '../../../lib/prompts';
import { validateLegalResponse } from '../../../lib/schema';
import { ragPipeline } from '../../../lib/rag';

export async function POST(request) {
  try {
    // Enhanced request parsing with better error handling
    let requestBody;
    try {
      requestBody = await request?.json();
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'invalid_request', 
          message: 'Invalid JSON in request body' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { question } = requestBody;
    
    if (!question || typeof question !== 'string' || question?.trim()?.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'missing_question', 
          message: 'Question is required and must be a non-empty string' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Enhanced authentication check with better error handling
    let user;
    try {
      const { data: { user: authUser }, error: authError } = await supabase?.auth?.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        return new Response(
          JSON.stringify({ 
            error: 'auth_error', 
            message: 'Authentication failed. Please log in again.' 
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (!authUser) {
        return new Response(
          JSON.stringify({ 
            error: 'unauthorized', 
            message: 'Authentication required. Please log in.' 
          }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      user = authUser;
    } catch (authCheckError) {
      console.error('Error checking authentication:', authCheckError);
      return new Response(
        JSON.stringify({ 
          error: 'auth_check_failed', 
          message: 'Unable to verify authentication. Please try again.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Step 1: Run RAG pipeline with error handling
    let ragResult;
    try {
      ragResult = await ragPipeline(question);
    } catch (ragError) {
      console.error('RAG pipeline error:', ragError);
      return new Response(
        JSON.stringify({ 
          error: 'rag_error', 
          message: 'Unable to process your question. Please try rephrasing it.' 
        }),
        { 
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { intent, evidencePack, chunks } = ragResult;
    
    // Step 2: Generate LLM response with structured output
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt(question, evidencePack) }
    ];

    const responseOptions = {
      temperature: 0.3, // Lower temperature for more consistent legal advice
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'uk_legal_response',
          schema: {
            type: 'object',
            properties: {
              jurisdiction: { type: 'string' },
              short_answer: { type: 'string' },
              step_by_step_plan: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              risks_or_deadlines: { 
                type: 'array', 
                items: { type: 'string' } 
              },
              when_to_seek_a_solicitor: { type: 'string' },
              citations: { 
                type: 'array', 
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    url: { type: 'string' },
                    last_updated: { type: 'string' }
                  },
                  required: ['title', 'url', 'last_updated']
                }
              },
              confidence: { type: 'number', minimum: 0, maximum: 1 }
            },
            required: [
              'jurisdiction', 'short_answer', 'step_by_step_plan', 
              'risks_or_deadlines', 'when_to_seek_a_solicitor', 
              'citations', 'confidence'
            ],
            additionalProperties: false
          }
        }
      }
    };

    let llmResponse;
    let parsedResponse;

    try {
      llmResponse = await chat(messages, responseOptions);
    } catch (llmError) {
      console.error('LLM chat error:', llmError);
      return new Response(
        JSON.stringify({ 
          error: 'llm_error', 
          message: 'Unable to generate response. Please try again.' 
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      parsedResponse = JSON.parse(llmResponse);
    } catch (parseError) {
      console.error('Initial JSON parse failed:', parseError);
      console.error('LLM Response that failed to parse:', llmResponse);
      
      // Attempt to repair the response once
      const repairMessages = [
        { role: 'system', content: SYSTEM_PROMPT + '\n\nThe previous response was not valid JSON. Please provide a valid JSON response that matches the schema exactly.' },
        { role: 'user', content: userPrompt(question, evidencePack) },
        { role: 'assistant', content: llmResponse },
        { role: 'user', content: `The above response is not valid JSON. Please provide the same information but in valid JSON format matching the required schema.` }
      ];

      try {
        llmResponse = await chat(repairMessages, responseOptions);
        parsedResponse = JSON.parse(llmResponse);
      } catch (repairError) {
        console.error('JSON repair failed:', repairError);
        return new Response(
          JSON.stringify({ 
            error: 'json_parse_error', 
            message: 'Unable to generate valid structured response. Please try again.' 
          }),
          { 
            status: 422,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Step 3: Validate against Zod schema
    let validationResult;
    try {
      validationResult = validateLegalResponse(parsedResponse);
    } catch (validationError) {
      console.error('Validation function error:', validationError);
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Unable to validate response structure. Please try again.' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!validationResult?.success) {
      console.error('Schema validation failed:', validationResult?.error);
      
      // Attempt one repair with validation feedback
      const validationMessages = [
        { role: 'system', content: SYSTEM_PROMPT + `\n\nValidation Error: ${JSON.stringify(validationResult?.error)}. Please correct these issues and provide a valid response.` },
        { role: 'user', content: userPrompt(question, evidencePack) }
      ];

      try {
        llmResponse = await chat(validationMessages, responseOptions);
        parsedResponse = JSON.parse(llmResponse);
        const secondValidation = validateLegalResponse(parsedResponse);
        
        if (!secondValidation?.success) {
          return new Response(
            JSON.stringify({ 
              error: 'validation_failed', 
              message: 'Response validation failed after repair attempt. Please try again.' 
            }),
            { 
              status: 422,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        
        parsedResponse = secondValidation?.data;
      } catch (validationRepairError) {
        console.error('Validation repair failed:', validationRepairError);
        return new Response(
          JSON.stringify({ 
            error: 'validation_repair_failed', 
            message: 'Unable to generate valid response after validation repair. Please try again.' 
          }),
          { 
            status: 422,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      parsedResponse = validationResult?.data;
    }

    // Step 4: Save QA event to database with error handling
    const retrievedChunkIds = chunks?.map(chunk => chunk?.id)?.filter(Boolean);
    let qaEvent = null;
    
    try {
      const { data: savedEvent, error: saveError } = await supabase?.from('qa_events')?.insert({
        user_id: user?.id,
        question: question?.trim(),
        answer_json: parsedResponse,
        retrieved_chunk_ids: retrievedChunkIds,
        confidence: parsedResponse?.confidence || 0.5
      })?.select()?.single();

      if (saveError) {
        console.error('Error saving QA event:', saveError);
        // Don't fail the request if saving fails - just log it
      } else {
        qaEvent = savedEvent;
      }
    } catch (saveException) {
      console.error('Exception saving QA event:', saveException);
      // Continue without failing the request
    }

    // Step 5: Return successful response with proper headers
    return new Response(
      JSON.stringify({ 
        answer: parsedResponse,
        metadata: {
          intent,
          chunks_retrieved: chunks?.length || 0,
          qa_event_id: qaEvent?.id || null
        }
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

  } catch (error) {
    console.error('Unexpected error in /api/ask:', error);
    return new Response(
      JSON.stringify({ 
        error: 'internal_server_error',
        message: 'An unexpected error occurred. Please try again.'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
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
      'Content-Type': 'application/json',
    },
  });
}