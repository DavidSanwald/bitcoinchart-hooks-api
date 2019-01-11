import React, { useReducer, useRef } from 'react'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { scaleTime, scaleLinear } from 'd3-scale'
import { extent, max, min } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import Tooltip from './Tooltip'
import HoverLine from './HoverLine'
import { line } from 'd3-shape'
import { localPoint } from '@vx/event'
import { closestDate, lerp } from './helpers'
import 'styled-components/macro'
import { useSpring, animated } from 'react-spring/hooks'

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const x = d => d.date
const y = d => d.value

const lineStyles = { fill: 'none', stroke: 'red' }

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
  const [state, dispatch] = useReducer(reducer, initState)
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom
  const xScale = scaleTime()
    .range([0, plotWidth])
    .domain(extent(data, x))
  const yScale = scaleLinear()
    .range([plotHeight, 0])
    .domain(extent(data, y))
  const { date: selectedDate, value: selectedValue } = closestDate(
    data,
    xScale.invert(state.position.x)
  )
  const tooltipProps = useSpring({
    top: state.position.y,
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
  return (
    <div css="position: relative">
      <svg width={width} height={height}>
        <g
          transform={`translate(${margin.left}, ${margin.top})`}
          pointerEvents="none">
          <rect
            ref={svgRef}
            x="0"
            y="0"
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onMouseLeave={() => dispatch({ type: 'toggle', payload: false })}
            onMouseEnter={() => dispatch({ type: 'toggle', payload: true })}
            onMouseMove={event =>
              dispatch({
                type: 'move',
                payload: localPoint(svgRef.current, event)
              })
            }
            pointerEvents="all"
          />
          <AxisBottom
            data={data}
            scale={xScale}
            x={x}
            top={plotHeight}
            left={margin.left + 18}
            numTicks={3}
            hideTicks
            hideAxisLine
            tickLabelComponent={
              <text
                fill="#ffffff"
                dy=".33em"
                fillOpacity={0.3}
                fontSize={11}
                textAnchor="middle"
              />
            }
          />
          <AxisLeft
            left={0}
            top={margin.top}
            data={data}
            scale={yScale}
            y={y}
            label="Axis Left Label"
            labelProps={{
              fill: '#8e205f',
              textAnchor: 'middle',
              fontSize: 12,
              fontFamily: 'Arial'
            }}
            stroke="#1b1a1e"
            tickStroke="#8e205f"
            tickLabelProps={(value, index) => ({
              fill: '#8e205f',
              textAnchor: 'end',
              fontSize: 10,
              fontFamily: 'Arial',
              dx: '-0.25em',
              dy: '0.25em'
            })}
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text {...tickProps}>{formattedValue}</text>
            )}
          />
          <path d={lineGen(data)} {...lineStyles} />
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
              fill="red"
            />
          )}
        </g>{' '}
      </svg>
      <Tooltip active={state.isHovered} style={tooltipProps}>
        <p> {selectedValue}</p>
        <p> {selectedDate.toString()}</p>
      </Tooltip>
    </div>
  )
}
export default Chart
