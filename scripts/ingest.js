// scripts/ingest.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { embed } from '../lib/llm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   Supabase client (SERVICE KEY)
   ========================= */

// IMPORTANT: we use the *service role* key for ingestion so RLS doesn't block inserts.
// Put this in your .env (do NOT commit):
//   VITE_SUPABASE_URL=https://<project>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

const supabaseUrl = process.env?.VITE_SUPABASE_URL?.trim();
const supabaseServiceKey = process.env?.SUPABASE_SERVICE_ROLE_KEY?.trim(); // <— use this

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    'Missing required environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n' +
    'Add them to your .env:\n' +
    '  VITE_SUPABASE_URL=https://<project>.supabase.co\n' +
    '  SUPABASE_SERVICE_ROLE_KEY=<service role key from Supabase Settings > API>'
  );
  process.exit(1);
}

// Create Supabase client with service role key (no session persistence in scripts)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

/* =========================
   Markdown parsing & chunking
   ========================= */

/**
 * Parse markdown file with JSON metadata
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} Parsed document with metadata and content
 */
function parseMarkdownFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract JSON metadata from HTML comment
    const metaMatch = content.match(/^<!--META:\s*({.*?})\s*-->/s);

    if (!metaMatch) {
      throw new Error(`No metadata found in file: ${filePath}`);
    }

    const metadata = JSON.parse(metaMatch[1]);
    const body = content.replace(/^<!--META:.*?-->\s*/s, '').trim();

    // Validate required metadata fields
    const requiredFields = ['title', 'url', 'last_updated', 'topic', 'jurisdiction', 'source'];
    const missingFields = requiredFields.filter(field => !metadata?.[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required metadata fields: ${missingFields.join(', ')} in file: ${filePath}`);
    }

    // Validate topic
    const validTopics = ['tenancy', 'consumer', 'contracts'];
    if (!validTopics.includes(metadata?.topic)) {
      throw new Error(`Invalid topic "${metadata.topic}" in file: ${filePath}. Must be one of: ${validTopics.join(', ')}`);
    }

    return {
      ...metadata,
      raw_text: body
    };
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Split text into chunks with overlap
 */
function chunkText(text, minSize = 400, maxSize = 800, overlapPercent = 15) {
  const minChars = minSize * 4; // ~4 chars per token
  const maxChars = maxSize * 4;
  const overlapChars = Math.floor(maxChars * (overlapPercent / 100));

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim() + '.';

    if (currentChunk.length + trimmedSentence.length > maxChars && currentChunk.length >= minChars) {
      chunks.push(currentChunk.trim());

      // Start new chunk with overlap from the end of current chunk
      const overlapText = currentChunk.slice(-overlapChars);
      currentChunk = overlapText + ' ' + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    }
  }

  if (currentChunk.trim().length >= minChars) {
    chunks.push(currentChunk.trim());
  } else if (chunks.length > 0) {
    chunks[chunks.length - 1] += ' ' + currentChunk.trim();
  } else if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Upsert document and its chunks
 */
async function upsertDocument(documentData) {
  try {
    // Check if document already exists
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('id')
      .eq('url', documentData.url)
      .single();

    let documentId;

    if (existingDoc) {
      const { data: updatedDoc, error: updateError } = await supabase
        .from('documents')
        .update({
          title: documentData.title,
          last_updated: documentData.last_updated,
          source: documentData.source,
          topic: documentData.topic,
          jurisdiction: documentData.jurisdiction,
          raw_text: documentData.raw_text
        })
        .eq('id', existingDoc.id)
        .select('id')
        .single();

      if (updateError) throw updateError;
      documentId = updatedDoc.id;

      // Delete existing chunks
      await supabase.from('doc_chunks').delete().eq('document_id', documentId);

      console.log(`Updated document: ${documentData.title}`);
    } else {
      const { data: newDoc, error: insertError } = await supabase
        .from('documents')
        .insert(documentData)
        .select('id')
        .single();

      if (insertError) throw insertError;
      documentId = newDoc.id;
      console.log(`Created document: ${documentData.title}`);
    }

    // Create chunks
    const chunks = chunkText(documentData.raw_text);
    console.log(`Generated ${chunks.length} chunks for ${documentData.title}`);

    if (chunks.length === 0) {
      console.warn(`No chunks generated for ${documentData.title}`);
      return;
    }

    // Generate embeddings for chunks
    console.log('Generating embeddings...');
    const embeddings = await embed(chunks);

    // Prepare chunk data
    const chunkData = chunks.map((chunk, index) => ({
      document_id: documentId,
      chunk_index: index,
      text: chunk,
      embedding: embeddings?.[index],
      metadata: {
        title: documentData.title,
        url: documentData.url,
        last_updated: documentData.last_updated,
        topic: documentData.topic,
        jurisdiction: documentData.jurisdiction,
        source: documentData.source
      }
    }));

    // Batch insert
    const batchSize = 100;
    for (let i = 0; i < chunkData.length; i += batchSize) {
      const batch = chunkData.slice(i, i + batchSize);
      const { error: chunkError } = await supabase.from('doc_chunks').insert(batch);
      if (chunkError) throw chunkError;
    }

    console.log(`✅ Successfully processed ${documentData.title} with ${chunks.length} chunks`);
  } catch (error) {
    console.error(`❌ Error processing ${documentData.title}:`, error);
    throw error;
  }
}

/**
 * Main ingestion function
 */
async function main() {
  try {
    const dataDir = path.join(__dirname, '..', 'data', 'uk-law');

    if (!fs.existsSync(dataDir)) {
      console.error(`Data directory not found: ${dataDir}`);
      console.log('Please create the data/uk-law directory and add your markdown files.');
      process.exit(1);
    }

    const files = fs
      .readdirSync(dataDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(dataDir, file));

    if (files.length === 0) {
      console.log('No markdown files found in data/uk-law directory.');
      console.log('\nExample file format:');
      console.log('<!--META: {"title":"UK Tenancy Rights","url":"https://gov.uk/tenancy","last_updated":"2025-01-10","topic":"tenancy","jurisdiction":"UK","source":"GOV.UK"}-->');
      console.log('Your UK law content goes here...');
      process.exit(0);
    }

    console.log(`Found ${files.length} markdown files to process`);

    for (const file of files) {
      console.log(`\n📄 Processing: ${path.basename(file)}`);
      try {
        const documentData = parseMarkdownFile(file);
        await upsertDocument(documentData);
      } catch (error) {
        console.error(`Failed to process ${file}:`, error?.message);
        continue;
      }
    }

    console.log('\n🎉 Ingestion completed successfully!');
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

// Run the ingestion
main();
