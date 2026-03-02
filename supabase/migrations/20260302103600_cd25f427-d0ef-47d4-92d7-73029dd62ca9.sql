
-- Add read_at column for read receipts
ALTER TABLE public.messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Allow participants to update read_at on messages they received
CREATE POLICY "Recipients can mark messages as read"
  ON public.messages FOR UPDATE
  USING (public.is_conversation_participant(conversation_id, auth.uid()) AND sender_id != auth.uid())
  WITH CHECK (public.is_conversation_participant(conversation_id, auth.uid()) AND sender_id != auth.uid());
