import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xslkkmsqeutwpmcfiyxc.supabase.co'      // ganti
const supabaseKey = 'sb_publishable_ZaB2cFK4oDG0zKxN9hxKpA_IXnms-sI' // ganti            

export const supabase = createClient(supabaseUrl, supabaseKey)