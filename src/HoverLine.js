import React from 'react'
import { useSpring, interpolate, animated } from 'react-spring/hooks'

export default function HoverLine({ y1, y2, x }) {
  console.log(x)
  const props = useSpring({
    x
  })
  return (
    <animated.line
      y1={y1}
      y2={y2}
      x1={props.x}
      x2={props.x}
      stroke="green"
      strokeWidth="2"
    />
  )
}
