import { debounce } from "./debounce.js"
import { basicThrottle, queueThrottle, trailingThrottle } from "./throttle.js"
import { Visualizer } from "./visualizer.js"

const normalText = document.querySelector("[data-normal]")
const debounceText = document.querySelector("[data-debounce]")
const throttleText = document.querySelector("[data-throttle]")

const visualizer = new Visualizer(1000, { throttleMethod: "basic" })

document.addEventListener("click", () => {
  visualizer.addEvent()
  incrementText(normalText)
  debounceIncrement(debounceText)
  throttleIncrement(throttleText)
})

const debounceIncrement = debounce(incrementText, 1000)
const throttleIncrement = basicThrottle(incrementText, 1000)

function incrementText(text) {
  const currentCount = parseInt(text.innerText) || 0
  text.innerText = currentCount + 1
}
