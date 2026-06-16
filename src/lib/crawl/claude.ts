import * as cheerio from 'cheerio'
import type { NewsItem } from '@/types'

const BASE_URL = 'https://www.anthropic.com'

export async function crawlClaude(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/news`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items: NewsItem[] = []

    $('a[href^="/news/"][class*="listItem"]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return

      const url = `${BASE_URL}${href}`
      const timeEl = $(el).find('time')
      const publishedAt = timeEl.attr('datetime') ?? timeEl.text().trim()
      const spans = $(el).find('span')
      const title = spans.last().text().trim()

      if (!title || !url) return

      let isoDate: string
      try {
        isoDate = new Date(publishedAt).toISOString()
        if (isoDate === 'Invalid Date') throw new Error()
      } catch {
        isoDate = new Date().toISOString()
      }

      items.push({
        tool: 'claude',
        title,
        summary: null,
        url,
        published_at: isoDate,
      })
    })

    // 중복 URL 제거
    const seen = new Set<string>()
    return items.filter((item) => {
      if (seen.has(item.url)) return false
      seen.add(item.url)
      return true
    })
  } catch {
    return []
  }
}
