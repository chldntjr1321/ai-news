// @ts-check
'use strict'

const Parser = require('rss-parser')
const cheerio = require('cheerio')
const { createClient } = require('@supabase/supabase-js')

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const parser = new Parser()

async function crawlOpenAI() {
  try {
    const feed = await parser.parseURL('https://openai.com/news/rss.xml')
    return feed.items
      .map((item) => ({
        tool: 'gpt',
        title: item.title ?? '',
        summary: item.contentSnippet ?? null,
        url: item.link ?? '',
        published_at: new Date(item.pubDate ?? '').toISOString(),
      }))
      .filter((item) => item.title && item.url && item.published_at >= '2025-01-01')
  } catch (e) {
    console.error('openai 크롤링 실패:', e.message)
    return []
  }
}

async function crawlClaude() {
  try {
    const res = await fetch('https://www.anthropic.com/news', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)
    const items = []
    const seen = new Set()

    $('a[href^="/news/"][class*="PostList_listItem"]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return

      const url = `https://www.anthropic.com${href}`
      if (seen.has(url)) return
      seen.add(url)

      const timeEl = $(el).find('time')
      const publishedAt = timeEl.attr('datetime') ?? timeEl.text().trim()
      const spans = $(el).find('span')
      const title = spans.last().text().trim()

      if (!title || !url) return

      let isoDate
      try {
        isoDate = new Date(publishedAt).toISOString()
        if (isoDate === 'Invalid Date') throw new Error()
      } catch {
        isoDate = new Date().toISOString()
      }

      items.push({ tool: 'claude', title, summary: null, url, published_at: isoDate })
    })

    return items
  } catch (e) {
    console.error('claude 크롤링 실패:', e.message)
    return []
  }
}

async function crawlGemini() {
  try {
    const feed = await parser.parseURL(
      'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/rss/',
    )
    return feed.items
      .map((item) => ({
        tool: 'gemini',
        title: item.title ?? '',
        summary: item.contentSnippet ?? null,
        url: item.link ?? '',
        published_at: new Date(item.pubDate ?? '').toISOString(),
      }))
      .filter((item) => item.title && item.url)
  } catch (e) {
    console.error('gemini 크롤링 실패:', e.message)
    return []
  }
}

async function main() {
  console.log('크롤링 시작...')

  const results = await Promise.allSettled([crawlOpenAI(), crawlClaude(), crawlGemini()])
  const names = ['openai', 'claude', 'gemini']

  const items = results.flatMap((r, i) => {
    if (r.status === 'fulfilled') return r.value
    console.error(`${names[i]} 실패:`, r.reason)
    return []
  })

  console.log(`수집된 기사: ${items.length}건`)

  if (items.length === 0) {
    console.log('저장할 기사 없음')
    return
  }

  const { error } = await supabaseAdmin
    .from('news')
    .upsert(items, { onConflict: 'url', ignoreDuplicates: true })

  if (error) {
    console.error('DB 저장 실패:', error.message)
    process.exit(1)
  }

  console.log(`저장 완료: ${items.length}건`)
}

main()
