import type { NewsItem } from '@/types'

const BADGE: Record<string, { label: string; className: string }> = {
  gpt: { label: 'GPT', className: 'bg-green-100 text-green-800' },
  claude: { label: 'Claude', className: 'bg-orange-100 text-orange-800' },
  gemini: { label: 'Gemini', className: 'bg-blue-100 text-blue-800' },
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const badge = BADGE[item.tool]
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
      className="flex h-full min-h-[200px] flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
          {badge.label}
        </span>
        <time className="text-xs text-gray-400">{date}</time>
      </div>
      <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 leading-snug">
        {item.title}
      </h2>
      {item.summary && (
        <p className="line-clamp-3 text-xs text-gray-500 leading-relaxed">{item.summary}</p>
      )}
    </a>
  )
}
