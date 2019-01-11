import React from 'react'
import styled from 'styled-components'
import { animated } from 'react-spring/hooks'

const Tooltip = styled(animated.div)`
  position: absolute;
  background-color: white;
  color: rgba(25, 29, 34, 0.54);
  box-shadow: 0 4px 8px 0 rgba(25, 29, 34, 0.1);
  pointer-events: none;
  border: 1px solid rgba(25, 29, 34, 0.12);
  opacity: ${props => (props.active ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`
export default Tooltip
