export const CAPTION_MAX_LENGTH = 1200
export const GREETING_MAX_LENGTH = 120

export function excerptText(text: string, maxLines = 3, maxChars = 160): string {
  const trimmed = text.trim()
  if (!trimmed) return ''

  const lines = trimmed.split('\n').slice(0, maxLines)
  let result = lines.join('\n')

  if (result.length > maxChars) {
    result = `${result.slice(0, maxChars).trimEnd()}…`
  } else if (trimmed.split('\n').length > maxLines) {
    result = `${result.trimEnd()}…`
  }

  return result
}
