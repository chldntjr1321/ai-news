import { createClient } from '@supabase/supabase-js';
import type { NewsItem, Tool } from '@/types';

// 프론트엔드 전용 — anon key, 함수 호출 시점에 생성
export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// 크롤러 전용 — service_role key, RLS 우회
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function upsertNews(items: NewsItem[]): Promise<void> {
  if (items.length === 0) return;

  const { error } = await getSupabaseAdmin()
    .from('news')
    .upsert(items, { onConflict: 'url', ignoreDuplicates: true });

  if (error) throw new Error(`upsertNews failed: ${error.message}`);
}

export async function getLastUpdated(): Promise<string | null> {
  const { data, error } = await getSupabaseClient()
    .from('news')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`getLastUpdated failed: ${error.message}`);

  return data?.created_at ?? null;
}

export async function getNews(tool?: Tool): Promise<NewsItem[]> {
  let query = getSupabaseClient()
    .from('news')
    .select('tool, title, summary, url, published_at')
    .gte('published_at', '2025-01-01T00:00:00Z')
    .order('published_at', { ascending: false })
    .limit(100);

  if (tool) {
    query = query.eq('tool', tool);
  }

  const { data, error } = await query;

  if (error) throw new Error(`getNews failed: ${error.message}`);

  return (data ?? []) as NewsItem[];
}
