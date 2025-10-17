-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  topic_filter text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_index int,
  text text,
  embedding vector(1536),
  metadata jsonb,
  similarity float,
  documents jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.text,
    dc.embedding,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity,
    to_jsonb(d.*) AS documents
  FROM public.doc_chunks dc
  JOIN public.documents d ON dc.document_id = d.id
  WHERE 
    1 - (dc.embedding <=> query_embedding) > match_threshold
    AND (topic_filter IS NULL OR d.topic = topic_filter::public.topic_classification)
    AND d.jurisdiction = 'UK'
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION match_documents TO authenticated;
GRANT EXECUTE ON FUNCTION match_documents TO anon;