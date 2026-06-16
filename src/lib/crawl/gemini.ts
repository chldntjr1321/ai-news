import Parser from 'rss-parser'
import type { NewsItem } from '@/types'

const parser = new Parser()

export async function crawlGemini(): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL('https://blog.google/innovation-and-ai/models-and-research/google-deepmind/rss/')
    return feed.items
      .map((item) => ({
        tool: 'gemini' as const,
        title: item.title ?? '',
        summary: item.contentSnippet ?? null,
        url: item.link ?? '',
        published_at: new Date(item.pubDate ?? '').toISOString(),
      }))
      .filter((item) => item.title && item.url)
  } catch {
    return []
  }
}
