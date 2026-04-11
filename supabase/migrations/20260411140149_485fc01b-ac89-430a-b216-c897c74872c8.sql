
DROP POLICY "messages_update" ON public.messages;

CREATE POLICY "messages_update" ON public.messages
FOR UPDATE USING (
  is_conversation_participant(conversation_id, auth.uid())
  AND (
    auth.uid() = sender_id
    OR sender_id <> auth.uid()
  )
);
