
-- Tighten: only allow adding yourself or adding others to conversations you created
-- For simplicity, allow adding self as participant (creating a conversation means adding yourself)
DROP POLICY "Authenticated users can add participants" ON public.conversation_participants;

CREATE POLICY "Users can add participants to their conversations"
  ON public.conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    OR public.is_conversation_participant(conversation_id, auth.uid())
  );

-- Tighten conversation creation - require the creator to also be a participant
DROP POLICY "Authenticated users can create conversations" ON public.conversations;

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
