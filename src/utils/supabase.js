// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://upqcpapehcoykqzwavpa.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Match the name from your .env file
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase