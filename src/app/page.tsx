import { Suspense } from 'react'
import { getLastUpdated, getNews } from '@/lib/supabase'
import NewsGrid from '@/components/NewsGrid'
import ToolFilter from '@/components/ToolFilter'
import Banner from '@/components/Banner'
import DigestSummary from '@/components/DigestSummary'
import LastUpdated from '@/components/LastUpdated'
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
  const [banner, ...rest] = news

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex gap-8">
        <Suspense>
          <aside className="w-32 shrink-0">
            <ToolFilter />
          </aside>
        </Suspense>

        <div className="flex-1">
          {banner && (
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Banner item={banner} />
              </div>
              <DigestSummary />
            </div>
          )}

          {lastUpdated && <LastUpdated date={lastUpdated} />}

          <NewsGrid items={rest} />
        </div>
      </div>
    </main>
  )
}
