-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USER PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'product_manager',
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PROJECTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    domain TEXT NOT NULL DEFAULT 'other',
    has_ai_features BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id) WHERE deleted_at IS NULL;

-- =====================================================
-- 3. PRD DOCUMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.prd_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    current_version INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    outline JSONB NOT NULL DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

CREATE INDEX IF NOT EXISTS idx_prd_project ON public.prd_documents(project_id);

-- =====================================================
-- 4. PRD SECTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.prd_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prd_id UUID NOT NULL REFERENCES public.prd_documents(id) ON DELETE CASCADE,
    section_number TEXT NOT NULL,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL DEFAULT '',
    summary TEXT,
    status TEXT DEFAULT 'draft',
    ai_generated BOOLEAN DEFAULT TRUE,
    token_count INTEGER,
    last_generated_at TIMESTAMPTZ,
    last_edited_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(prd_id, section_number)
);

CREATE INDEX IF NOT EXISTS idx_sections_prd ON public.prd_sections(prd_id);

-- =====================================================
-- 5. CONVERSATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT,
    context_summary TEXT,
    token_usage_total INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_project ON public.conversations(project_id);

-- =====================================================
-- 6. MESSAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    action_type TEXT,
    payload JSONB,
    token_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.conversation_messages(conversation_id, created_at);

-- =====================================================
-- 7. AI GENERATIONS (cost tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    prd_id UUID REFERENCES public.prd_documents(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt_type TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cost_usd NUMERIC(10, 6),
    latency_ms INTEGER,
    status TEXT DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUTO-UPDATE TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_prd_documents_updated_at ON public.prd_documents;
DROP TRIGGER IF EXISTS update_sections_updated_at ON public.prd_sections;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prd_documents_updated_at BEFORE UPDATE ON public.prd_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.prd_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prd_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prd_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can CRUD own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can access PRD of own projects" ON public.prd_documents;
DROP POLICY IF EXISTS "Users can access sections of own projects" ON public.prd_sections;
DROP POLICY IF EXISTS "Users can access conversations of own projects" ON public.conversations;
DROP POLICY IF EXISTS "Users can access messages of own conversations" ON public.conversation_messages;
DROP POLICY IF EXISTS "Users can view own generations" ON public.ai_generations;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects
CREATE POLICY "Users can CRUD own projects" ON public.projects FOR ALL USING (auth.uid() = owner_id);

-- PRD Documents
CREATE POLICY "Users can access PRD of own projects" ON public.prd_documents
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = prd_documents.project_id AND projects.owner_id = auth.uid())
    );

-- Sections
CREATE POLICY "Users can access sections of own projects" ON public.prd_sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.prd_documents pd
            JOIN public.projects p ON p.id = pd.project_id
            WHERE pd.id = prd_sections.prd_id AND p.owner_id = auth.uid()
        )
    );

-- Conversations
CREATE POLICY "Users can access conversations of own projects" ON public.conversations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = conversations.project_id AND projects.owner_id = auth.uid())
    );

-- Messages
CREATE POLICY "Users can access messages of own conversations" ON public.conversation_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            JOIN public.projects p ON p.id = c.project_id
            WHERE c.id = conversation_messages.conversation_id AND p.owner_id = auth.uid()
        )
    );

-- AI Generations
CREATE POLICY "Users can view own generations" ON public.ai_generations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = ai_generations.project_id AND projects.owner_id = auth.uid())
    );
