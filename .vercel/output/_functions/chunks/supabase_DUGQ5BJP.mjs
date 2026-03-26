import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://nyiturqeotdxucfdurzu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aXR1cnFlb3RkeHVjZmR1cnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzI0ODgsImV4cCI6MjA4NzcwODQ4OH0.CvYju6UTaCGD_Zd-8FVTcB-yW9YVG_jQtwkd0l7mIV0",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce"
    }
  }
);

export { supabase as s };
