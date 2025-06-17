export function basicThrottle(cb, delay) {
  let isThrottled = false

  return (...args) => {
    if (isThrottled) return

    cb.apply(this, args)
    isThrottled = true

    setTimeout(() => {
      isThrottled = false
    }, delay)
  }
}

export function trailingThrottle(cb, delay) {
  let isThrottled = false
  let lastEvent

  function resetThrottle() {
    if (lastEvent) {
      cb.apply(lastEvent.context, lastEvent.args)
      lastEvent = null
      setTimeout(resetThrottle, delay)
    } else {
      isThrottled = false
    }
  }

  return (...args) => {
    if (isThrottled) {
      lastEvent = {
        args,
        context: this,
      }
      return
    }

    cb.apply(this, args)
    isThrottled = true

    setTimeout(resetThrottle, delay)
  }
}

export function queueThrottle(cb, delay) {
  let isThrottled = false
  const queue = []

  function processQueue() {
    if (queue.length === 0) {
      isThrottled = false
      return
    }

    const { args, context } = queue.shift()
    cb.apply(context, args)
    setTimeout(processQueue, delay)
  }

  return (...args) => {
    if (isThrottled) {
      queue.push({ args, context: this })
      return
    }

    cb.apply(this, args)
    isThrottled = true

    setTimeout(processQueue, delay)
  }
}
