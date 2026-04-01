import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

export type Activity = {
  id: string
  type: string
  title: string
  description: string | null
  ministry: string | null
  date: string
  priority: string
  source_url: string | null
  image_url: string | null
  related_bill_id: string | null
  created_at: string
}

export async function fetchRecentActivities(limit = 20): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('fetchRecentActivities:', error)
    return []
  }
  return (data as Activity[]) ?? []
}

export async function fetchNewsArticles(limit = 20, offset = 0): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('type', 'news')
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) {
    console.error('fetchNewsArticles:', error)
    return []
  }
  return (data as Activity[]) ?? []
}
