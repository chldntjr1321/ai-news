import { Suspense } from 'react'
import { getLastUpdated, getNews } from '@/lib/supabase'
import NewsGrid from '@/components/NewsGrid'
import ToolFilter from '@/components/ToolFilter'
import type { Tool } from '@/types'

interface PageProps {
  searchParams: Promise<{ tool?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const tool = (['gpt', 'claude', 'gemini'] as Tool[]).includes(params.tool as Tool)
    ? (params.tool as Tool)
    : undefined

  const [news, lastUpdated] = await Promise.all([getNews(tool), getLastUpdated()])

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI 뉴스</h1>
        <p className="mt-1 text-sm text-gray-500">GPT · Claude · Gemini 최신 소식</p>
      </header>

      <Suspense>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <ToolFilter />
          {lastUpdated && (
            <p className="text-xs text-gray-400">
              마지막 업데이트{' '}
              {new Date(lastUpdated).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </Suspense>

      <NewsGrid items={news} />
    </main>
  )
}
