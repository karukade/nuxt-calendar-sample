export const toNonReactive = <T>(target: T): T => {
  const entries = Object.entries(target).map(([key, value]) => {
    return [
      key,
      {
        configurable: false,
        value
      }
    ]
  })
  return Object.defineProperties({}, Object.fromEntries(entries))
}
