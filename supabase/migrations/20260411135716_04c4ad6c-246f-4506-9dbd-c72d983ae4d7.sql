
CREATE TABLE public.message_read_receipts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_receipts_select" ON public.message_read_receipts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM messages m
    WHERE m.id = message_read_receipts.message_id
    AND is_conversation_participant(m.conversation_id, auth.uid())
  )
);

CREATE POLICY "read_receipts_insert" ON public.message_read_receipts
FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM messages m
    WHERE m.id = message_read_receipts.message_id
    AND is_conversation_participant(m.conversation_id, auth.uid())
  )
);

CREATE INDEX idx_read_receipts_message ON public.message_read_receipts(message_id);
CREATE INDEX idx_read_receipts_user ON public.message_read_receipts(user_id);
