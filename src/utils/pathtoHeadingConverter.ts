export function convertString(input: string) {
  const trimmedInput = input.startsWith('-') ? input.slice(1) : input
  const words = trimmedInput.split('-')
  const capitalizedReversedWords = words.reverse().map((word) => word.toUpperCase())
  const result = capitalizedReversedWords.join(' ')
  return result
}
