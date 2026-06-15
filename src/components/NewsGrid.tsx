import type { NewsItem } from '@/types'
import NewsCard from './NewsCard'

export default function NewsGrid({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-gray-400">
        뉴스가 없습니다. 크롤링을 먼저 실행해주세요.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <NewsCard key={item.url} item={item} />
      ))}
    </div>
  )
}
