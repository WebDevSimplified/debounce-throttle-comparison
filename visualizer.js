export class Visualizer {
  constructor(delay, { throttleMethod = "normal" } = {}) {
    this.wrapper = document.createElement("div")
    this.wrapper.classList.add("visualizer-wrapper")
    this.normal = createContainer(this.wrapper, "Normal")
    this.debounce = createContainer(this.wrapper, "Debounce")
    this.throttle = createContainer(this.wrapper, "Throttle")
    document.body.prepend(this.wrapper)

    this.delay = delay
    this.throttleMethod = throttleMethod

    let lastExecution = 0
    const firstExecution = performance.now()
    function animationFrame(time) {
      if (time - lastExecution >= 1000) {
        lastExecution = time
        this.addTimeLine(Math.round((time - firstExecution) / 1000))
      }
      requestAnimationFrame(animationFrame.bind(this))
    }

    requestAnimationFrame(animationFrame.bind(this))
  }

  addTimeLine(time) {
    this.normal.appendChild(createTimeLine(time))
    this.debounce.appendChild(createTimeLine(time))
    this.throttle.appendChild(createTimeLine(time))
  }

  addEvent() {
    this.normal.appendChild(createEvent("active"))

    if (this.debounceInfo) {
      clearTimeout(this.debounceInfo.timeout)
      this.debounceInfo.event.dataset.status = "skipped"
    }
    const debounceEvent = createEvent("waiting")
    const debounceTimeout = setTimeout(() => {
      debounceEvent.dataset.status = "active"
      this.debounceInfo = null
    }, this.delay)
    this.debounceInfo = {
      timeout: debounceTimeout,
      event: debounceEvent,
    }
    this.debounce.appendChild(debounceEvent)

    if (this.throttleQueue && this.throttleMethod === "trailing") {
      if (this.throttleQueue[0]) {
        this.throttleQueue[0].dataset.status = "skipped"
      }
    }

    if (this.isThrottled) {
      const throttleEvent = createEvent(
        this.withTrailing ? "waiting" : "skipped"
      )
      this.throttle.appendChild(throttleEvent)
      if (this.throttleMethod === "queue") {
        this.throttleQueue = [...(this.throttleQueue || []), throttleEvent]
      }

      if (this.throttleMethod === "trailing") {
        this.throttleQueue = [throttleEvent]
      }
    } else {
      this.throttle.appendChild(createEvent("active"))
      this.isThrottled = true

      const resetThrottle = () => {
        if (this.throttleQueue) {
          const item = this.throttleQueue.shift()
          item.dataset.status = "active"
          if (this.throttleQueue.length === 0) {
            this.throttleQueue = null
          }
          setTimeout(resetThrottle, this.delay)
        } else {
          this.isThrottled = false
        }
      }
      setTimeout(resetThrottle, this.delay)
    }
  }
}

function createEvent(status) {
  const event = document.createElement("div")
  event.classList.add("visualizer__event")
  event.dataset.status = status
  event.addEventListener("animationend", () => {
    event.remove()
  })
  return event
}

function createTimeLine(time) {
  const timeLine = document.createElement("div")
  timeLine.classList.add("visualizer__time")
  timeLine.innerText = time
  timeLine.addEventListener("animationend", () => {
    timeLine.remove()
  })
  return timeLine
}

function createContainer(wrapper, name) {
  const container = document.createElement("div")
  container.dataset.name = name
  container.classList.add("visualizer")
  wrapper.appendChild(container)
  return container
}
