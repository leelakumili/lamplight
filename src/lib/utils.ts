export function getGreeting(): { label: string; time: string } {
  const now = new Date()
  const hour = now.getHours()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const day = days[now.getDay()]
  const date = now.getDate()
  const month = months[now.getMonth()]

  let greeting: string
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning.'
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon.'
  } else {
    greeting = 'Good evening.'
  }

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return {
    label: `${day}, ${month} ${date} · ${timeStr}`,
    time: greeting,
  }
}

export function paginateStory(content: string, wordsPerPage = 300): string[] {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0)
  const pages: string[] = []
  let currentPage: string[] = []
  let wordCount = 0

  for (const para of paragraphs) {
    const paraWords = para.trim().split(/\s+/).length
    if (wordCount + paraWords > wordsPerPage && currentPage.length > 0) {
      pages.push(currentPage.join('\n\n'))
      currentPage = [para.trim()]
      wordCount = paraWords
    } else {
      currentPage.push(para.trim())
      wordCount += paraWords
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage.join('\n\n'))
  }

  return pages.length > 0 ? pages : [content]
}

export function formatStoryAge(generatedAt: number): string {
  const now = Date.now()
  const diff = now - generatedAt
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
