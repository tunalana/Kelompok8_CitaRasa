import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yappneutlasvdybkhgyf.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhcHBuZXV0bGFzdmR5YmtoZ3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjQ2MzMsImV4cCI6MjA2NDEwMDYzM30.-YVigA8l2mA4nFrtWWzfq-zqMdtg0pQZLJqi8hy_BIo'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
