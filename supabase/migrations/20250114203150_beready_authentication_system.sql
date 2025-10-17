-- Schema Analysis: BeReady Legal Guidance System - Authentication Module FIXED
-- Integration Type: Authentication system enhancement 
-- Dependencies: Uses existing user_role type from previous migration
-- Fix: Removed duplicate type creation that caused "type already exists" error

-- 1. Create account_status type only (user_role already exists from previous migration)
DO $$ BEGIN
    CREATE TYPE public.account_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Check if user_profiles table exists and enhance it if needed
DO $$
BEGIN
    -- Add columns that might be missing from the existing user_profiles table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'status') THEN
            ALTER TABLE public.user_profiles ADD COLUMN status public.account_status DEFAULT 'active'::public.account_status;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'avatar_url') THEN
            ALTER TABLE public.user_profiles ADD COLUMN avatar_url TEXT;
        END IF;
        
        RAISE NOTICE 'Enhanced existing user_profiles table with additional columns';
    ELSE
        -- Create the user_profiles table if it doesn't exist
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            role public.user_role DEFAULT 'user'::public.user_role,
            status public.account_status DEFAULT 'active'::public.account_status,
            avatar_url TEXT,
            phone TEXT,
            date_of_birth DATE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
        
        RAISE NOTICE 'Created new user_profiles table';
    END IF;
END $$;

-- 3. Essential indexes for performance (create only if they don't exist)
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
    CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
    CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);
END $$;

-- 4. Functions for automatic profile creation and management (CREATE OR REPLACE to handle existing)
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
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_profile_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- 5. Triggers (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_user_profile_updated ON public.user_profiles;
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_profile_timestamp();

-- 6. Enable RLS (safe to run multiple times)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin access policy using Pattern 6A (auth.users metadata)
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

DROP POLICY IF EXISTS "admin_full_access_user_profiles" ON public.user_profiles;
CREATE POLICY "admin_full_access_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- 8. Mock Data for testing authentication (safe upsert approach)
DO $$
DECLARE
    admin_uuid UUID;
    user_uuid UUID;
    expert_uuid UUID;
BEGIN
    -- Generate UUIDs for consistency
    admin_uuid := gen_random_uuid();
    user_uuid := gen_random_uuid();
    expert_uuid := gen_random_uuid();
    
    -- Create auth users only if they don't exist
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) 
    SELECT 
        admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'admin@beready.uk', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
        '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
        false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@beready.uk');
    
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) 
    SELECT 
        user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'user@beready.uk', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
        '{"full_name": "Regular User", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
        false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@beready.uk');
    
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) 
    SELECT 
        expert_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'expert@beready.uk', crypt('expert123', gen_salt('bf', 10)), now(), now(), now(),
        '{"full_name": "Legal Expert", "role": "legal_expert"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
        false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'expert@beready.uk');

    RAISE NOTICE 'Authentication mock data setup completed';

EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Mock users already exist, skipping insertion';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating mock users: %', SQLERRM;
END $$;

-- 9. Cleanup function for development (enhanced to handle existing data)
CREATE OR REPLACE FUNCTION public.cleanup_mock_auth_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    mock_user_ids UUID[];
BEGIN
    -- Get mock user IDs
    SELECT ARRAY_AGG(id) INTO mock_user_ids
    FROM auth.users
    WHERE email IN ('admin@beready.uk', 'user@beready.uk', 'expert@beready.uk');

    IF array_length(mock_user_ids, 1) > 0 THEN
        -- Delete in proper order (profiles first, then auth.users)
        DELETE FROM public.user_profiles WHERE id = ANY(mock_user_ids);
        DELETE FROM auth.users WHERE id = ANY(mock_user_ids);
        
        RAISE NOTICE 'Mock authentication data cleaned up successfully - % users removed', array_length(mock_user_ids, 1);
    ELSE
        RAISE NOTICE 'No mock authentication data found to clean up';
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;

-- 10. Migration completion notice
DO $$
BEGIN
    RAISE NOTICE '=== Authentication System Migration Completed Successfully ===';
    RAISE NOTICE 'Fixed: Removed duplicate user_role type creation';
    RAISE NOTICE 'Enhanced: Added account_status type and additional user_profiles columns';
    RAISE NOTICE 'Safe: Used conditional creation to avoid conflicts with existing schema';
END $$;