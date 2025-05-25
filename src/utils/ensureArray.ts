const ensureArray = <T>(arr: T | T[]): T[] => {
  return Array.isArray(arr) ? arr : []
}
export default ensureArray
