import React, { useCallback, useState, useEffect } from 'react'

function throttle(cb, wait, scope) {
  const context = scope || this
  let timeout = null
  let cbArgs = null
  const later = () => {
    cb.apply(context, cbArgs)
  }
  return function() {
    if (!timeout) {
      cbArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}
const isClient = typeof window === 'object'

const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const [state, setState] = useState({
    width: isClient ? window.innerWidth : initialWidth,
    height: isClient ? window.innerHeight : initialHeight
  })

  useEffect(
    () => {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    },
    [1]
  )

  return state
}

export default useWindowSize
