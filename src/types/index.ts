export type Tool = 'gpt' | 'claude' | 'gemini'

export interface NewsItem {
  tool: Tool
  title: string
  summary: string | null
  url: string
  published_at: string // ISO 8601
}
