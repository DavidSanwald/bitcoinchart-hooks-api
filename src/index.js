import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import WebFont from 'webfontloader'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
html{font-size: 1em;};
  body {
font-family: 'Space Mono', monospace;
  };
`

WebFont.load({
  google: {
    families: ['Space Mono:400,400i']
  }
})

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <App />
  </React.Fragment>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
