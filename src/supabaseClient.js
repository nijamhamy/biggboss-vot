import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yhdgzxgfwiremmicofpz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_szf4KBKWx_Vfr9JSIPquDw_v42BSg2d'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)