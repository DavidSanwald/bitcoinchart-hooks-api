import React from 'react'
import styled from 'styled-components'
import { animated } from 'react-spring/hooks'

const Tooltip = styled.div`
  font-size: 1em;
  padding: 10px;
  position: absolute;
  background-color: white;
  color: rgba(25, 29, 34, 0.54);
  pointer-events: none;
  border: 1px solid rgba(25, 29, 34, 0.12);
  opacity: ${props => (props.isVisible ? 0.9 : 0)};
  transition: opacity 0.5s ease-in-out;
`
export default animated(Tooltip)
