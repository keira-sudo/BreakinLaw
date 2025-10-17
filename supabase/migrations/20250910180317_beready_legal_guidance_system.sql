-- BeReady UK Legal Guidance System
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete new system
-- Dependencies: None - creating complete schema

-- 1. Custom Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'legal_expert', 'user');
CREATE TYPE public.journal_category AS ENUM ('housing', 'consumer', 'employment', 'benefits', 'family', 'immigration', 'other');
CREATE TYPE public.guide_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.query_status AS ENUM ('pending', 'in_progress', 'resolved', 'archived');
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- 2. Core Authentication Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    date_of_birth DATE,
    location TEXT,
    phone TEXT,
    preferred_language TEXT DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rights Guides System
CREATE TABLE public.rights_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category public.journal_category NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    summary TEXT,
    keywords TEXT[],
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status public.guide_status DEFAULT 'draft'::public.guide_status,
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rights Journal System
CREATE TABLE public.rights_journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category public.journal_category NOT NULL,
    description TEXT,
    incident_date DATE,
    location TEXT,
    people_involved TEXT[],
    evidence_notes TEXT,
    follow_up_actions TEXT,
    tags TEXT[],
    is_resolved BOOLEAN DEFAULT false,
    private_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Chat System
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT,
    category public.journal_category DEFAULT 'other'::public.journal_category,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_from_ai BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Legal Queries System
CREATE TABLE public.legal_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category public.journal_category NOT NULL,
    status public.query_status DEFAULT 'pending'::public.query_status,
    priority public.priority_level DEFAULT 'medium'::public.priority_level,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    due_date DATE,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. User Activity & Analytics
CREATE TABLE public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_rights_guides_category ON public.rights_guides(category);
CREATE INDEX idx_rights_guides_status ON public.rights_guides(status);
CREATE INDEX idx_rights_guides_slug ON public.rights_guides(slug);
CREATE INDEX idx_rights_guides_featured ON public.rights_guides(featured);
CREATE INDEX idx_journal_entries_user_id ON public.rights_journal_entries(user_id);
CREATE INDEX idx_journal_entries_category ON public.rights_journal_entries(category);
CREATE INDEX idx_journal_entries_created_at ON public.rights_journal_entries(created_at);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_legal_queries_user_id ON public.legal_queries(user_id);
CREATE INDEX idx_legal_queries_status ON public.legal_queries(status);
CREATE INDEX idx_legal_queries_category ON public.legal_queries(category);
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at);

-- 9. Helper Functions (before RLS policies)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- 10. Automatic Profile Creation Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- 11. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rights_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rights_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- 12. RLS Policies
-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read for guides, private write
CREATE POLICY "public_can_read_published_guides"
ON public.rights_guides
FOR SELECT
TO public
USING (status = 'published'::public.guide_status);

CREATE POLICY "authors_manage_own_guides"
ON public.rights_guides
FOR ALL
TO authenticated
USING (author_id = auth.uid() OR public.is_admin_from_auth())
WITH CHECK (author_id = auth.uid() OR public.is_admin_from_auth());

-- Pattern 2: Simple user ownership
CREATE POLICY "users_manage_own_journal_entries"
ON public.rights_journal_entries
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_chat_sessions"
ON public.chat_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_chat_messages"
ON public.chat_messages
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_legal_queries"
ON public.legal_queries
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR assigned_to = auth.uid() OR public.is_admin_from_auth())
WITH CHECK (user_id = auth.uid() OR public.is_admin_from_auth());

CREATE POLICY "users_manage_own_activity"
ON public.user_activity
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_from_auth())
WITH CHECK (user_id = auth.uid() OR public.is_admin_from_auth());

-- 13. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_rights_guides
    BEFORE UPDATE ON public.rights_guides
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_journal_entries
    BEFORE UPDATE ON public.rights_journal_entries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_chat_sessions
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_legal_queries
    BEFORE UPDATE ON public.legal_queries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 14. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    expert_uuid UUID := gen_random_uuid();
    guide_uuid UUID := gen_random_uuid();
    journal_uuid UUID := gen_random_uuid();
    chat_session_uuid UUID := gen_random_uuid();
    query_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@beready.uk', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@beready.uk', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Smith", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (expert_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'expert@beready.uk', crypt('expert123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Legal Expert", "role": "legal_expert"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Sample Rights Guides
    INSERT INTO public.rights_guides (id, title, slug, category, description, content, summary, author_id, status, featured) VALUES
        (guide_uuid, 'Understanding Housing Rights in the UK', 'housing-rights-uk', 'housing', 'Complete guide to housing rights and tenant protections', 'This comprehensive guide covers all aspects of housing rights in the UK including tenant rights, landlord obligations, eviction procedures, and how to report housing issues to local councils.', 'Essential housing rights every UK resident should know', expert_uuid, 'published', true);

    -- Sample Journal Entry
    INSERT INTO public.rights_journal_entries (id, user_id, title, category, description, incident_date, location, evidence_notes) VALUES
        (journal_uuid, user_uuid, 'Landlord Refusing Repairs', 'housing', 'My landlord has been ignoring requests to fix the broken heating system for over two weeks', CURRENT_DATE - INTERVAL '2 weeks', 'Manchester, UK', 'Sent 3 emails with photos of the broken boiler');

    -- Sample Chat Session
    INSERT INTO public.chat_sessions (id, user_id, title, category) VALUES
        (chat_session_uuid, user_uuid, 'Housing Rights Consultation', 'housing');

    INSERT INTO public.chat_messages (session_id, user_id, message, is_from_ai) VALUES
        (chat_session_uuid, user_uuid, 'My landlord is trying to evict me without proper notice. What are my rights?', false),
        (chat_session_uuid, user_uuid, 'In the UK, landlords must provide proper notice for eviction. For assured shorthold tenancies, this is typically 2 months notice using a Section 21 notice. Let me help you understand your specific situation and rights.', true);

    -- Sample Legal Query
    INSERT INTO public.legal_queries (id, user_id, title, description, category, priority, assigned_to) VALUES
        (query_uuid, user_uuid, 'Unfair Dismissal from Work', 'I believe I was unfairly dismissed from my job after raising concerns about workplace safety', 'employment', 'high', expert_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 15. Cleanup Function for Testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs that match test data
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@beready.uk';

    -- Delete in dependency order
    DELETE FROM public.chat_messages WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.chat_sessions WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.legal_queries WHERE user_id = ANY(auth_user_ids_to_delete) OR assigned_to = ANY(auth_user_ids_to_delete);
    DELETE FROM public.rights_journal_entries WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.rights_guides WHERE author_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_activity WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    
    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
    
    RAISE NOTICE 'Test data cleanup completed';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;