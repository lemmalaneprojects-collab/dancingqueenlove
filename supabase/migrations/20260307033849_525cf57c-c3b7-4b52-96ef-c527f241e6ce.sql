
CREATE TABLE public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Users can see reactions on messages in their conversations
CREATE POLICY "reactions_select" ON public.message_reactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
      AND is_conversation_participant(m.conversation_id, auth.uid())
    )
  );

-- Users can add reactions to messages in their conversations
CREATE POLICY "reactions_insert" ON public.message_reactions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
      AND is_conversation_participant(m.conversation_id, auth.uid())
    )
  );

-- Users can remove their own reactions
CREATE POLICY "reactions_delete" ON public.message_reactions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
