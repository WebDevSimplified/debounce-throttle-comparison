export function debounce(cb, delay) {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      cb.apply(this, args)
    }, delay)
  }
}
