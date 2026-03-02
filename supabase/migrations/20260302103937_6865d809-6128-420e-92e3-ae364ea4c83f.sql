
-- Recreate all policies as PERMISSIVE (drop restrictive ones)

-- conversation_participants
DROP POLICY IF EXISTS "Participants can view participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to their conversations" ON public.conversation_participants;

CREATE POLICY "Participants can view participants"
  ON public.conversation_participants FOR SELECT
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "Users can add participants to their conversations"
  ON public.conversation_participants FOR INSERT
  WITH CHECK ((user_id = auth.uid()) OR public.is_conversation_participant(conversation_id, auth.uid()));

-- conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;

CREATE POLICY "Users can view their conversations"
  ON public.conversations FOR SELECT
  USING (public.is_conversation_participant(id, auth.uid()));

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- messages
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Recipients can mark messages as read" ON public.messages;

CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK ((auth.uid() = sender_id) AND public.is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "Recipients can mark messages as read"
  ON public.messages FOR UPDATE
  USING (public.is_conversation_participant(conversation_id, auth.uid()) AND sender_id != auth.uid())
  WITH CHECK (public.is_conversation_participant(conversation_id, auth.uid()) AND sender_id != auth.uid());

-- profiles
DROP POLICY IF EXISTS "Anyone authenticated can view directory profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Anyone authenticated can view directory profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);
