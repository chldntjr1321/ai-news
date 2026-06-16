import type { NewsItem } from '@/types'
import { TOOL_BADGE } from '@/lib/badge'

export default function Banner({ item }: { item: NewsItem }) {
  const badge = TOOL_BADGE[item.tool]
  const date = new Date(item.published_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col justify-end gap-3 rounded-2xl bg-gray-900 p-8 text-white shadow-sm transition hover:shadow-md sm:p-10 min-h-[420px]"
    >
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
          {badge.label}
        </span>
        <time className="text-xs text-gray-300">{date}</time>
      </div>
      <h2 className="text-2xl font-bold leading-snug sm:text-3xl">{item.title}</h2>
      {item.summary && (
        <p className="line-clamp-2 max-w-3xl text-sm text-gray-300 leading-relaxed">
          {item.summary}
        </p>
      )}
    </a>
  )
}
