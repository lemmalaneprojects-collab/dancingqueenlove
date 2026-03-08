
-- Grant permissions to authenticated and anon roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

GRANT SELECT, INSERT ON public.conversations TO authenticated;
GRANT UPDATE ON public.conversations TO authenticated;

GRANT SELECT, INSERT ON public.conversation_participants TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;

GRANT SELECT, INSERT, DELETE ON public.message_reactions TO authenticated;
