import { bisector } from 'd3-array'
const bisectDate = bisector(d => d.date).left
const closestDate = (data, date) => {
  const index = bisectDate(data, date)
  const left = Math.abs(data[index - 1] - date)
  const right = Math.abs(data[index] - date)
  return left < right ? data[index - 1] : data[index]
}
const clampMin = min => num => Math.max(num, min)
const clampBelowZero = clampMin(0)
const lerp = (data, xScale, yScale, xVal) => {
  const date = xScale.invert(xVal)
  const index = bisectDate(data, date)
  const left = data[clampBelowZero(index - 1, 0)]
  const right = data[index]
  const y0 = yScale(left.value)
  const y1 = yScale(right.value)
  const x0 = xScale(left.date)
  const x1 = xScale(right.date)
  const height =
    y0 * (1 - (xVal - x0) / (x1 - x0)) + y1 * ((xVal - x0) / (x1 - x0))
  return height
}
export { closestDate, lerp }
