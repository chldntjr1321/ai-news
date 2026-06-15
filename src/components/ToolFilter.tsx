'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Tool } from '@/types'

const TABS: { label: string; value: Tool | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: 'GPT', value: 'gpt' },
  { label: 'Claude', value: 'claude' },
  { label: 'Gemini', value: 'gemini' },
]

export default function ToolFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = (searchParams.get('tool') ?? 'all') as Tool | 'all'

  function handleClick(value: Tool | 'all') {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('tool')
    } else {
      params.set('tool', value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            current === tab.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
