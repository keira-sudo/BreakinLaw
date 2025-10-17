import { Ollama } from 'ollama';

// Initialize Ollama client with user's configuration
const ollama = new Ollama({ 
  host: process.env.OLLAMA_HOST || import.meta.env?.VITE_OLLAMA_HOST || 'http://127.0.0.1:11434' 
});

// Environment variables for Ollama configuration - using user's specific settings
const LLM_MODEL = process.env?.OLLAMA_MODEL || import.meta.env?.VITE_OLLAMA_MODEL || 'llama3.1:8b';
const EMBEDDINGS_MODEL = process.env?.OLLAMA_EMBEDDINGS_MODEL || import.meta.env?.VITE_OLLAMA_EMBEDDINGS_MODEL || 'nomic-embed-text';
const TIMEOUT_MS = parseInt(process.env?.OLLAMA_TIMEOUT_MS || '120000');
const TEMPERATURE = parseFloat(process.env?.LLM_TEMPERATURE || '0.2');
const MAX_TOKENS = parseInt(process.env?.LLM_MAX_TOKENS || '4096');

/**
 * Chat completion with Ollama using user's specific configuration
 * @param messages - Array of chat messages
 * @param options - Optional parameters
 * @returns JSON string response from the model
 */
export async function chat(messages, options = {}) {
  try {
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller?.abort(), TIMEOUT_MS);

    const response = await ollama?.chat({
      model: LLM_MODEL,
      messages,
      options: {
        temperature: options?.temperature || TEMPERATURE,
        num_predict: options?.max_tokens || MAX_TOKENS,
      },
      stream: false,
      format: options?.response_format?.type === 'json_schema' ? 'json' : undefined,
    });

    clearTimeout(timeoutId);
    return response?.message?.content;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Ollama request timed out after ${TIMEOUT_MS}ms`);
    }
    
    console.error('Error in Ollama chat:', error);
    
    // Enhanced error handling for common Ollama issues
    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('fetch failed')) {
      throw new Error(`Cannot connect to Ollama server at ${ollama.host || 'http://127.0.0.1:11434'}. Please ensure Ollama is running locally.`);
    }
    
    if (error?.message?.includes('model') && error?.message?.includes('not found')) {
      throw new Error(`Model "${LLM_MODEL}" not found. Please pull the model using: ollama pull ${LLM_MODEL}`);
    }
    
    throw new Error(`Ollama API Error: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Generate embeddings for text array using user's embeddings model
 * @param texts - Array of text strings
 * @returns Array of embedding vectors
 */
export async function embed(texts) {
  try {
    const embeddings = [];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller?.abort(), TIMEOUT_MS);
    
    for (const text of texts) {
      const response = await ollama?.embeddings({
        model: EMBEDDINGS_MODEL,
        prompt: text,
      });
      
      if (response?.embedding) {
        embeddings?.push(response?.embedding);
      }
    }
    
    clearTimeout(timeoutId);
    return embeddings;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Ollama embeddings request timed out after ${TIMEOUT_MS}ms`);
    }
    
    console.error('Error generating embeddings:', error);
    
    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('fetch failed')) {
      throw new Error(`Cannot connect to Ollama server at ${ollama.host || 'http://127.0.0.1:11434'}. Please ensure Ollama is running locally.`);
    }
    
    if (error?.message?.includes('model') && error?.message?.includes('not found')) {
      throw new Error(`Embeddings model "${EMBEDDINGS_MODEL}" not found. Please pull the model using: ollama pull ${EMBEDDINGS_MODEL}`);
    }
    
    throw new Error(`Ollama Embeddings Error: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Generate a single embedding for one text
 * @param text - Single text string
 * @returns Single embedding vector
 */
export async function embedSingle(text) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller?.abort(), TIMEOUT_MS);
    
    const response = await ollama?.embeddings({
      model: EMBEDDINGS_MODEL,
      prompt: text,
    });
    
    clearTimeout(timeoutId);
    return response?.embedding;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Ollama single embedding request timed out after ${TIMEOUT_MS}ms`);
    }
    
    console.error('Error generating single embedding:', error);
    
    if (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('fetch failed')) {
      throw new Error(`Cannot connect to Ollama server at ${ollama.host || 'http://127.0.0.1:11434'}. Please ensure Ollama is running locally.`);
    }
    
    if (error?.message?.includes('model') && error?.message?.includes('not found')) {
      throw new Error(`Embeddings model "${EMBEDDINGS_MODEL}" not found. Please pull the model using: ollama pull ${EMBEDDINGS_MODEL}`);
    }
    
    throw new Error(`Ollama Embeddings Error: ${error?.message || 'Unknown error'}`);
  }
}

export default { chat, embed, embedSingle };