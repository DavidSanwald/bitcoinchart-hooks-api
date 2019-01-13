import React, { useReducer, useRef } from 'react'
import { Group } from '@vx/group'
import { AxisBottom } from '@vx/axis'
import { scaleTime, scaleLinear } from 'd3-scale'
import { extent, max, min } from 'd3-array'
import Tooltip from './Tooltip'
import HoverLine from './HoverLine'
import { line, curveCardinal } from 'd3-shape'
import { GlyphDot } from '@vx/glyph'
import { localPoint, touchPoint } from '@vx/event'
import { closestDatum, lerp, formatDate, formatPrice } from './helpers'
import 'styled-components/macro'
import { useSpring, animated } from 'react-spring/hooks'
const primary = '#b33b4c'

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const x = d => d.date
const y = d => d.value

const lineStyles = { fill: 'none', stroke: primary }

const initState = { isHovered: false, position: { x: 0, y: 0 } }
function reducer(state, action) {
  const { type } = action
  switch (type) {
    case 'move':
      return { ...state, position: action.payload }
    case 'toggle':
      return { ...state, isHovered: action.payload }
    default:
      return state
  }
}

function Chart({ width = 600, height = 400, margin, data }) {
  const svgRef = useRef(null)
  const tipRef = useRef(null)
  const [state, dispatch] = useReducer(reducer, initState)
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom
  const [minPrice, maxPrice] = extent(data, y)
  const xScale = scaleTime()
    .range([0, plotWidth])
    .domain(extent(data, x))
  const yScale = scaleLinear()
    .range([plotHeight, 0])
    .domain([minPrice * 0.99, maxPrice])
  const { date: selectedDate, value: selectedValue } = closestDatum(
    data,
    xScale.invert(state.position.x)
  )
  const tooltipProps = useSpring({
    top: state.position.y - 15,
    left: state.position.x
  })
  const circleProps = useSpring({
    cx: xScale(selectedDate)
  })

  const xAcc = compose(
    xScale,
    x
  )
  const yAcc = compose(
    yScale,
    y
  )
  const lineGen = line()
    .x(xAcc)
    .y(yAcc)
    .curve(curveCardinal)
  const toolTipWidth = state.isHovered
    ? tipRef.current.getBoundingClientRect().width
    : 0
  return (
    <div css="position: relative">
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left} pointerEvents="none">
          <rect
            ref={svgRef}
            x="0"
            y="0"
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onMouseLeave={() => dispatch({ type: 'toggle', payload: false })}
            onTouchEnd={() => dispatch({ type: 'toggle', payload: false })}
            onMouseEnter={() => dispatch({ type: 'toggle', payload: true })}
            onTouchStart={() => dispatch({ type: 'toggle', payload: true })}
            onMouseMove={event =>
              dispatch({
                type: 'move',
                payload: localPoint(svgRef.current, event)
              })
            }
            onTouchMove={event =>
              dispatch({
                type: 'move',
                payload: touchPoint(svgRef.current, event)
              })
            }
            pointerEvents="all"
          />
          <AxisBottom
            data={data}
            scale={xScale}
            x={x}
            top={plotHeight}
            numTicks={8}
            hideAxisLine
            labelProps={{
              fontFamily: 'Space Mono'
            }}
            tickLabelProps={(value, index) => ({
              fontFamily: 'Space Mono',
              fontSize: 11,
              textAnchor: 'middle'
            })}
            tickLabelComponent={
              <text
                fill="#ffffff"
                dy=".33em"
                fillOpacity={0.3}
                fontSize={11}
                frontFamily={'Space Mono'}
                textAnchor="middle"
              />
            }
          />
          <path d={lineGen(data)} {...lineStyles} />
          {data.map((d, i) => {
            const cx = xAcc(d)
            const cy = yAcc(d)
            return (
              <g key={`line-point-${i}`}>
                <GlyphDot
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={primary}
                  stroke="white"
                  strokeWidth={3}
                />
              </g>
            )
          })}
          {state.isHovered && (
            <HoverLine
              x={xScale(selectedDate)}
              y2={yScale(max(data, y))}
              y1={yScale(min(data, y))}
            />
          )}
          {state.isHovered && (
            <animated.circle
              style={{
                cy: circleProps.cx.interpolate(x =>
                  lerp(data, xScale, yScale, x)
                ),
                cx: circleProps.cx
              }}
              r={3}
              fill={primary}
            />
          )}
        </Group>
      </svg>
      <Tooltip ref={tipRef} isVisible={state.isHovered} style={tooltipProps}>
        <span> {formatDate(selectedDate)}</span>
        <hr />
        <span> {formatPrice(selectedValue)}</span>
      </Tooltip>
    </div>
  )
}
export default Chart
