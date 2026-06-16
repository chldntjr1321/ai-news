import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between py-4 pl-8 pr-4">
        <Link href="/" className="flex items-baseline gap-5">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">AI 뉴스</span>
          <span className="text-xs text-gray-400">GPT · Claude · Gemini 최신 소식</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="언어 변경"
            title="언어 변경 (준비 중)"
            className="cursor-pointer rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
            </svg>
          </button>

          <a
            href="https://github.com/chldntjr1321/ai-news"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 저장소"
            title="GitHub"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.72-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .31.21.67.79.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.73 18.27.5 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
