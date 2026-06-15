import { createClient } from '@supabase/supabase-js';
import type { NewsItem, Tool } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 크롤러 전용: service_role key 사용 (RLS 우회)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function upsertNews(items: NewsItem[]): Promise<void> {
  if (items.length === 0) return;

  const { error } = await supabaseAdmin
    .from('news')
    .upsert(items, { onConflict: 'url', ignoreDuplicates: true });

  if (error) throw new Error(`upsertNews failed: ${error.message}`);
}

export async function getNews(tool?: Tool): Promise<NewsItem[]> {
  let query = supabase
    .from('news')
    .select('tool, title, summary, url, published_at')
    .order('published_at', { ascending: false })
    .limit(100);

  if (tool) {
    query = query.eq('tool', tool);
  }

  const { data, error } = await query;

  if (error) throw new Error(`getNews failed: ${error.message}`);

  return (data ?? []) as NewsItem[];
}
