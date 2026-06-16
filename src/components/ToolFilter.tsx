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
    <nav className="flex flex-col gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium transition ${
            current === tab.value
              ? 'border-l-2 border-gray-900 bg-gray-100 text-gray-900'
              : 'border-l-2 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
