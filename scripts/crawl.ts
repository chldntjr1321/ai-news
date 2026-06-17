import { runCrawlers } from '@/lib/crawl'

async function main() {
  const { saved, errors } = await runCrawlers()

  errors.forEach((e) => console.error(e))
  console.log(`저장 완료: ${saved}건`)

  if (saved === 0 && errors.length > 0) process.exit(1)
}

main()
