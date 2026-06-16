// 레이아웃 검토용 placeholder. 실제 종합 요약은 크롤링 시점 LLM 호출로 대체될 예정.
export default function DigestSummary() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="mb-1 text-xs font-semibold text-gray-400">오늘의 종합 요약</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        오늘 GPT, Claude, Gemini 세 곳 모두에서 새로운 소식이 있었습니다. OpenAI는 파트너
        네트워크를 새로 출범했고, Anthropic과 Google DeepMind도 각각 모델 업데이트 소식을
        전했습니다. (placeholder)
      </p>
    </div>
  )
}
