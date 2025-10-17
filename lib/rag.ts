import { supabase } from '../src/lib/supabase';
import { embedSingle } from './llm';

/**
 * Classify user intent based on question content
 * @param question - User's question
 * @returns Topic classification for filtering
 */
export function classifyIntent(question) {
  const lowerQuestion = question?.toLowerCase();
  
  // Tenancy keywords
  if (lowerQuestion?.includes('rent') || 
      lowerQuestion?.includes('landlord') || 
      lowerQuestion?.includes('tenant') || 
      lowerQuestion?.includes('deposit') || 
      lowerQuestion?.includes('eviction') || 
      lowerQuestion?.includes('section 21') ||
      lowerQuestion?.includes('heating') ||
      lowerQuestion?.includes('repair')) {
    return 'tenancy';
  }
  
  // Consumer rights keywords
  if (lowerQuestion?.includes('refund') || 
      lowerQuestion?.includes('faulty') || 
      lowerQuestion?.includes('return') || 
      lowerQuestion?.includes('consumer') || 
      lowerQuestion?.includes('purchase') || 
      lowerQuestion?.includes('product') ||
      lowerQuestion?.includes('shop') ||
      lowerQuestion?.includes('buy')) {
    return 'consumer';
  }
  
  // Contract keywords
  if (lowerQuestion?.includes('contract') || 
      lowerQuestion?.includes('agreement') || 
      lowerQuestion?.includes('cancel') || 
      lowerQuestion?.includes('terms') || 
      lowerQuestion?.includes('cooling off') ||
      lowerQuestion?.includes('binding')) {
    return 'contracts';
  }
  
  // Default to tenancy as it's most common
  return 'tenancy';
}

/**
 * Retrieve relevant documents using semantic search
 * @param queryEmbedding - Embedding vector of the user's question
 * @param intent - Classified intent for filtering
 * @returns Evidence pack and chunk information
 */
export async function retrieve(queryEmbedding, intent) {
  try {
    // Get relevant chunks using vector similarity search
    const { data: chunks, error } = await supabase?.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      topic_filter: intent
    });
    
    if (error) {
      console.error('Error retrieving chunks:', error);
      // Fallback: Get chunks without vector search
      const { data: fallbackChunks } = await supabase?.from('doc_chunks')?.select(`
          *,
          documents:document_id (
            title,
            url,
            last_updated,
            topic,
            jurisdiction
          )
        `)?.eq('documents.topic', intent)?.eq('documents.jurisdiction', 'UK')?.limit(5);
        
      if (fallbackChunks) {
        return formatRetrievalResults(fallbackChunks);
      }
    }
    
    if (chunks && chunks?.length > 0) {
      return formatRetrievalResults(chunks);
    }
    
    // No chunks found
    return {
      evidencePack: `No specific UK legal guidance found for "${intent}" topic. Please consult official UK government resources or seek professional legal advice.`,
      chunks: []
    };
    
  } catch (error) {
    console.error('Error in retrieve function:', error);
    return {
      evidencePack: 'Error retrieving legal information. Please try again or consult official UK government resources.',
      chunks: []
    };
  }
}

/**
 * Format retrieved chunks into evidence pack
 * @param chunks - Retrieved document chunks
 * @returns Formatted evidence pack and chunk data
 */
function formatRetrievalResults(chunks) {
  if (!chunks || chunks?.length === 0) {
    return {
      evidencePack: 'No relevant UK legal information found for this query.',
      chunks: []
    };
  }
  
  // Format evidence pack
  let evidencePack = 'UK LEGAL GUIDANCE CONTEXT:\n\n';
  
  chunks?.forEach((chunk, index) => {
    const doc = chunk?.documents || chunk?.metadata;
    evidencePack += `Source ${index + 1}: ${doc?.title || 'Unknown Title'}\n`;
    evidencePack += `URL: ${doc?.url || 'No URL'}\n`;
    evidencePack += `Last Updated: ${doc?.last_updated || 'Unknown date'}\n`;
    evidencePack += `Topic: ${doc?.topic || 'Unknown topic'}\n`;
    evidencePack += `Jurisdiction: ${doc?.jurisdiction || 'UK'}\n`;
    evidencePack += `Content: ${chunk?.text}\n\n`;
  });
  
  return {
    evidencePack,
    chunks: chunks?.map(chunk => ({
      id: chunk?.id,
      text: chunk?.text,
      metadata: chunk?.documents || chunk?.metadata
    }))
  };
}

/**
 * Full RAG pipeline: classify, embed, retrieve
 * @param question - User's legal question
 * @returns Evidence pack and retrieved chunks
 */
export async function ragPipeline(question) {
  try {
    // 1. Classify intent
    const intent = classifyIntent(question);
    console.log('Classified intent:', intent);
    
    // 2. Generate embedding
    const queryEmbedding = await embedSingle(question);
    
    // 3. Retrieve relevant documents
    const { evidencePack, chunks } = await retrieve(queryEmbedding, intent);
    
    return {
      intent,
      evidencePack,
      chunks,
      queryEmbedding
    };
  } catch (error) {
    console.error('Error in RAG pipeline:', error);
    return {
      intent: 'unknown',
      evidencePack: 'Error retrieving legal information. Please ensure you have an internet connection and try again.',
      chunks: [],
      queryEmbedding: null
    };
  }
}

export default {
  classifyIntent,
  retrieve,
  ragPipeline,
};