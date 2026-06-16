export default function LastUpdated({ date }: { date: string }) {
  return (
    <p className="mb-4 text-right text-xs text-gray-400">
      마지막 업데이트{' '}
      {new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </p>
  )
}
