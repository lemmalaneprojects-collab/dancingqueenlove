
-- Grant all necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT ALL ON public.conversations TO authenticated;
GRANT ALL ON public.conversation_participants TO authenticated;
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
