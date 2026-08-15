export function pickGreeting(greetings: string[], lastGreeting: string | null): string | null {
  const valid = greetings.map((g) => g.trim()).filter(Boolean)
  if (valid.length === 0) return null
  if (valid.length === 1) return valid[0]

  const pool = lastGreeting ? valid.filter((g) => g !== lastGreeting) : valid
  const choices = pool.length > 0 ? pool : valid
  const index = Math.floor(Math.random() * choices.length)
  return choices[index] ?? null
}
