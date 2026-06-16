import type { Metadata } from 'next'
import Header from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 뉴스',
  description: 'GPT, Claude, Gemini 최신 뉴스 모음',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 antialiased">
        <Header />
        {children}
      </body>
    </html>
  )
}
