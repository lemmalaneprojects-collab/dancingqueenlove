
-- Add file columns to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS file_type text;

-- Add group chat columns to conversations
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS is_group boolean NOT NULL DEFAULT false;

-- Create chat-attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');

-- Storage RLS: anyone can view (public bucket)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'chat-attachments');

-- Storage RLS: users can delete own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'chat-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Fix ALL RLS policies to be PERMISSIVE (they are currently RESTRICTIVE)
-- Profiles
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Conversations
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations FOR SELECT USING (is_conversation_participant(id, auth.uid()));
CREATE POLICY "conversations_insert" ON public.conversations FOR INSERT WITH CHECK (true);
-- Allow updating conversation name for group chats
CREATE POLICY "conversations_update" ON public.conversations FOR UPDATE USING (is_conversation_participant(id, auth.uid()));

-- Conversation participants
DROP POLICY IF EXISTS "cp_select" ON public.conversation_participants;
DROP POLICY IF EXISTS "cp_insert" ON public.conversation_participants;
CREATE POLICY "cp_select" ON public.conversation_participants FOR SELECT USING (is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "cp_insert" ON public.conversation_participants FOR INSERT WITH CHECK (true);

-- Messages
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "messages_update" ON public.messages;
DROP POLICY IF EXISTS "messages_delete" ON public.messages;
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "messages_update" ON public.messages FOR UPDATE USING (is_conversation_participant(conversation_id, auth.uid()) AND sender_id <> auth.uid());
CREATE POLICY "messages_delete" ON public.messages FOR DELETE USING (auth.uid() = sender_id);

-- Reactions
DROP POLICY IF EXISTS "reactions_select" ON public.message_reactions;
DROP POLICY IF EXISTS "reactions_insert" ON public.message_reactions;
DROP POLICY IF EXISTS "reactions_delete" ON public.message_reactions;
CREATE POLICY "reactions_select" ON public.message_reactions FOR SELECT USING (EXISTS (SELECT 1 FROM messages m WHERE m.id = message_reactions.message_id AND is_conversation_participant(m.conversation_id, auth.uid())));
CREATE POLICY "reactions_insert" ON public.message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM messages m WHERE m.id = message_reactions.message_id AND is_conversation_participant(m.conversation_id, auth.uid())));
CREATE POLICY "reactions_delete" ON public.message_reactions FOR DELETE USING (auth.uid() = user_id);
