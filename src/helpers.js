import { bisector } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import { format } from 'd3-format'
const formatDate = timeFormat('%b %d')
const formatPrice = format('$,.2f')
const bisectDate = bisector(d => d.date).left
const closestDatum = (data, date) => {
  const index = bisectDate(data, date)
  const clampIndex = clamp({ min: 0, max: data.length - 1 })
  const left = Math.abs(data[clampIndex(index - 1)] - date)
  const right = Math.abs(data[clampIndex(index)] - date)
  return left < right ? data[clampIndex(index - 1)] : data[clampIndex(index)]
}
const clamp = ({
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY
} = {}) => num => Math.max(min, Math.min(num, max))
const lerp = (data, xScale, yScale, xVal) => {
  const clampIndex = clamp({ min: 0, max: data.length - 1 })
  const date = xScale.invert(xVal)
  const index = bisectDate(data, date)
  const left = data[clampIndex(index - 1)]
  const right = data[clampIndex(index)]
  if (left === right) {
    return yScale(left.value)
  }
  const y0 = yScale(left.value)
  const y1 = yScale(right.value)
  const x0 = xScale(left.date)
  const x1 = xScale(right.date)
  const height =
    y0 * (1 - (xVal - x0) / (x1 - x0)) + y1 * ((xVal - x0) / (x1 - x0))
  return height
}
export { closestDatum, lerp, formatDate, formatPrice }
