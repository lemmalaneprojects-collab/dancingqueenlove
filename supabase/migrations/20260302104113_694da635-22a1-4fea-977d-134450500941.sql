
-- Grant table permissions to authenticated users
GRANT SELECT, INSERT ON public.conversations TO authenticated;
GRANT SELECT, INSERT ON public.conversation_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Also grant to anon for profile viewing
GRANT SELECT ON public.profiles TO anon;
