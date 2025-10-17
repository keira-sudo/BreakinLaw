-- Location: supabase/migrations/20250110181820_beready_llm_rag_system.sql
-- Schema Analysis: Existing legal guidance system with user_profiles, chat_sessions, chat_messages, legal_queries
-- Integration Type: Addition - RAG + LLM system for UK legal guidance
-- Dependencies: Existing user_profiles table

-- Enable vector extension for pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create feedback rating enum
CREATE TYPE public.feedback_rating AS ENUM ('up', 'down');

-- Create topic classification enum for RAG
CREATE TYPE public.topic_classification AS ENUM ('tenancy', 'consumer', 'contracts');

-- 1. Document storage for UK legal content
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    last_updated DATE NOT NULL,
    source TEXT NOT NULL,
    topic public.topic_classification NOT NULL,
    jurisdiction TEXT NOT NULL DEFAULT 'UK',
    raw_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Document chunks with vector embeddings
CREATE TABLE public.doc_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    text TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Q&A events for tracking AI interactions
CREATE TABLE public.qa_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer_json JSONB NOT NULL,
    retrieved_chunk_ids JSONB NOT NULL,
    confidence FLOAT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Feedback on AI responses
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qa_event_id UUID REFERENCES public.qa_events(id) ON DELETE CASCADE,
    rating public.feedback_rating NOT NULL,
    note TEXT,
    edited_answer_json JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Essential indexes for performance
CREATE INDEX idx_documents_topic_jurisdiction ON public.documents(topic, jurisdiction);
CREATE INDEX idx_doc_chunks_document_id ON public.doc_chunks(document_id);
CREATE INDEX idx_doc_chunks_embedding_cosine ON public.doc_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_qa_events_user_id ON public.qa_events(user_id);
CREATE INDEX idx_qa_events_created_at ON public.qa_events(created_at);
CREATE INDEX idx_feedback_qa_event_id ON public.feedback(qa_event_id);

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doc_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Documents - Public read access (UK legal content is public)
CREATE POLICY "public_can_read_documents"
ON public.documents
FOR SELECT
TO public
USING (true);

-- Doc chunks - Public read access for RAG retrieval
CREATE POLICY "public_can_read_doc_chunks"
ON public.doc_chunks
FOR SELECT
TO public
USING (true);

-- QA events - Users can manage their own query history
CREATE POLICY "users_manage_own_qa_events"
ON public.qa_events
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Feedback - Users can manage their own feedback
CREATE POLICY "users_manage_own_feedback"
ON public.feedback
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.qa_events qe
        WHERE qe.id = qa_event_id AND qe.user_id = auth.uid()
    )
);

-- Admin functions for content management
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

-- Admin policies for content management
CREATE POLICY "admin_can_manage_documents"
ON public.documents
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "admin_can_manage_doc_chunks"
ON public.doc_chunks
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Apply updated timestamp triggers
CREATE TRIGGER handle_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Sample UK legal documents for demonstration
DO $$
DECLARE
    tenancy_doc_id UUID := gen_random_uuid();
    consumer_doc_id UUID := gen_random_uuid();
    contracts_doc_id UUID := gen_random_uuid();
BEGIN
    -- Insert sample UK legal documents
    INSERT INTO public.documents (id, title, url, last_updated, source, topic, jurisdiction, raw_text) VALUES
    (tenancy_doc_id, 'UK Tenancy Rights Guide', 'https://gov.uk/tenancy-rights', CURRENT_DATE, 'GOV.UK', 'tenancy', 'UK', 
     'Your rights as a tenant in the UK depend on the type of tenancy you have. Most private tenants have an assured shorthold tenancy. Your landlord must protect your deposit in a government-approved scheme within 30 days. You have the right to live in a property that is safe and in good repair. Your landlord cannot increase rent during a fixed-term tenancy unless specified in your agreement. Section 21 notices require at least 2 months notice and must meet strict legal requirements.'),
    
    (consumer_doc_id, 'UK Consumer Rights Act 2015', 'https://gov.uk/consumer-rights', CURRENT_DATE, 'GOV.UK', 'consumer', 'UK',
     'Under the Consumer Rights Act 2015, you have the right to return faulty goods for a full refund within 30 days of purchase. After 30 days, you can request repair or replacement. If repair or replacement fails, you can then request a refund. Goods must be of satisfactory quality, fit for purpose, and as described. For digital content, you have the right to a refund if the content is faulty and cannot be fixed.'),
    
    (contracts_doc_id, 'UK Contract Law Basics', 'https://gov.uk/contract-law', CURRENT_DATE, 'Legal Guidance', 'contracts', 'UK',
     'A contract is legally binding when there is offer, acceptance, and consideration. You may have cooling-off periods for certain contracts, especially those made at distance or off-premises. Consumer contracts often have 14-day cooling-off periods. Unfair terms in consumer contracts may not be enforceable. You cannot be bound by terms you have not seen or had a reasonable opportunity to read.');

    -- Create sample chunks with mock embeddings (in production, these would be generated by text-embedding-3-small)
    INSERT INTO public.doc_chunks (document_id, chunk_index, text, embedding, metadata) VALUES
    (tenancy_doc_id, 1, 'Your landlord must protect your deposit in a government-approved scheme within 30 days.', 
     '[0.1, 0.2, 0.3]'::vector, '{"title": "UK Tenancy Rights Guide", "url": "https://gov.uk/tenancy-rights", "last_updated": "2025-01-10", "topic": "tenancy", "jurisdiction": "UK"}'),
    
    (consumer_doc_id, 1, 'Under the Consumer Rights Act 2015, you have the right to return faulty goods for a full refund within 30 days of purchase.',
     '[0.2, 0.3, 0.4]'::vector, '{"title": "UK Consumer Rights Act 2015", "url": "https://gov.uk/consumer-rights", "last_updated": "2025-01-10", "topic": "consumer", "jurisdiction": "UK"}'),
     
    (contracts_doc_id, 1, 'Consumer contracts often have 14-day cooling-off periods for distance sales and doorstep sales.',
     '[0.3, 0.4, 0.5]'::vector, '{"title": "UK Contract Law Basics", "url": "https://gov.uk/contract-law", "last_updated": "2025-01-10", "topic": "contracts", "jurisdiction": "UK"}');

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting sample data: %', SQLERRM;
END $$;

-- Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_rag_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.feedback WHERE created_at > CURRENT_DATE - INTERVAL '1 day';
    DELETE FROM public.qa_events WHERE created_at > CURRENT_DATE - INTERVAL '1 day';
    DELETE FROM public.doc_chunks WHERE created_at > CURRENT_DATE - INTERVAL '1 day';
    DELETE FROM public.documents WHERE created_at > CURRENT_DATE - INTERVAL '1 day';
    
    RAISE NOTICE 'Cleaned up RAG test data successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;