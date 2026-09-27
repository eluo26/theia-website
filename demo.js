const SAMPLE = "find my airpods"

const ask = document.querySelector("#ask")
const run = document.querySelector("#run")
const form = document.querySelector("#form")
const query = document.querySelector("#query")
const find = document.querySelector("#find")
const mic = document.querySelector("#mic")
const hint = document.querySelector("#hint")
const note = document.querySelector("#note")
const echo = document.querySelector("#echo")
const stageText = document.querySelector("#stage-text")
const result = document.querySelector("#result")
const stages = [...document.querySelectorAll("#stages li")]
const again = document.querySelector("#again")

let timer = 0

const beats = [
  ["scanning", "Capturing photo 1 of 7…"],
  ["scanning", "Capturing photo 4 of 7…"],
  ["scanning", "Capturing photo 7 of 7…"],
  ["searching", "Looking at the photos…"],
  ["pointing", "Pointing… 66 px away"],
  ["on_target", "Found white earbud case."],
]

function accepts(text) {
  const words = text.toLowerCase()
  return words.includes("airpod") || words.includes("earbud")
}

function setStage(name) {
  const order = ["scanning", "searching", "pointing", "on_target"]
  const current = order.indexOf(name)
  stages.forEach((item, index) => {
    item.classList.toggle("done", index < current || name === "on_target")
    item.classList.toggle("active", index === current && name !== "on_target")
  })
}

function reset() {
  window.clearInterval(timer)
  ask.hidden = false
  run.hidden = true
  result.hidden = true
  note.textContent = ""
  mic.classList.remove("listening")
  hint.textContent = "Tap the mic, or type the sample and press Find it"
}

function play(text) {
  ask.hidden = true
  run.hidden = false
  result.hidden = true
  echo.textContent = `Looking for: ${text}`
  let step = 0
  const tick = () => {
    const [stage, label] = beats[step]
    setStage(stage)
    stageText.textContent = label
    if (stage === "on_target") {
      result.hidden = false
      window.clearInterval(timer)
    }
    step += 1
  }
  tick()
  timer = window.setInterval(() => {
    if (step >= beats.length) {
      window.clearInterval(timer)
      return
    }
    tick()
  }, 700)
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = query.value.trim()
  if (!text) return
  if (!accepts(text)) {
    note.textContent = "This preview only has the airpods scan. Try “find my airpods.”"
    return
  }
  note.textContent = ""
  play(text)
})

mic.addEventListener("click", () => {
  query.value = SAMPLE
  hint.textContent = "Listening… find my airpods"
  mic.classList.add("listening")
  window.setTimeout(() => play(SAMPLE), 900)
})

again.addEventListener("click", reset)

query.addEventListener("input", () => {
  find.disabled = !query.value.trim()
})
find.disabled = true
