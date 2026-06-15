import Parser from 'rss-parser'
import type { NewsItem } from '@/types'

const parser = new Parser()

export async function crawlOpenAI(): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL('https://openai.com/news/rss.xml')
    return feed.items
      .map((item) => ({
        tool: 'gpt' as const,
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
