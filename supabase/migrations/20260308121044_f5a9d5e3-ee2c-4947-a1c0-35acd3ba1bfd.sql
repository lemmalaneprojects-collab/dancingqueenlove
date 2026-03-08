
-- Drop ALL existing restrictive policies and recreate as PERMISSIVE

-- profiles
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- conversations
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;

CREATE POLICY "conversations_select" ON public.conversations FOR SELECT TO authenticated USING (is_conversation_participant(id, auth.uid()));
CREATE POLICY "conversations_insert" ON public.conversations FOR INSERT TO authenticated WITH CHECK (true);

-- conversation_participants
DROP POLICY IF EXISTS "cp_select" ON public.conversation_participants;
DROP POLICY IF EXISTS "cp_insert" ON public.conversation_participants;

CREATE POLICY "cp_select" ON public.conversation_participants FOR SELECT TO authenticated USING (is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "cp_insert" ON public.conversation_participants FOR INSERT TO authenticated WITH CHECK (true);

-- messages
DROP POLICY IF EXISTS "messages_select" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
DROP POLICY IF EXISTS "messages_update" ON public.messages;
DROP POLICY IF EXISTS "messages_delete" ON public.messages;

CREATE POLICY "messages_select" ON public.messages FOR SELECT TO authenticated USING (is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "messages_insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND is_conversation_participant(conversation_id, auth.uid()));
CREATE POLICY "messages_update" ON public.messages FOR UPDATE TO authenticated USING (is_conversation_participant(conversation_id, auth.uid()) AND sender_id <> auth.uid());
CREATE POLICY "messages_delete" ON public.messages FOR DELETE TO authenticated USING (auth.uid() = sender_id);

-- message_reactions
DROP POLICY IF EXISTS "reactions_select" ON public.message_reactions;
DROP POLICY IF EXISTS "reactions_insert" ON public.message_reactions;
DROP POLICY IF EXISTS "reactions_delete" ON public.message_reactions;

CREATE POLICY "reactions_select" ON public.message_reactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.messages m WHERE m.id = message_id AND is_conversation_participant(m.conversation_id, auth.uid()))
);
CREATE POLICY "reactions_insert" ON public.message_reactions FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.messages m WHERE m.id = message_id AND is_conversation_participant(m.conversation_id, auth.uid()))
);
CREATE POLICY "reactions_delete" ON public.message_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);
