import type { NewsItem } from '@/types'
import { crawlOpenAI } from './openai'
import { crawlClaude } from './claude'
import { crawlGemini } from './gemini'
import { upsertNews } from '@/lib/supabase'

export async function runCrawlers(): Promise<{ saved: number; errors: string[] }> {
  const results = await Promise.allSettled([
    crawlOpenAI(),
    crawlClaude(),
    crawlGemini(),
  ])

  const errors: string[] = []
  const items: NewsItem[] = results.flatMap((r, i) => {
    if (r.status === 'fulfilled') return r.value
    const names = ['openai', 'claude', 'gemini']
    errors.push(`${names[i]}: ${String(r.reason)}`)
    return []
  })

  await upsertNews(items)

  return { saved: items.length, errors }
}
