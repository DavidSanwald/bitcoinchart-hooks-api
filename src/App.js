import React from 'react'
import useWindowSize from './useWindowSize'
import { useFetch } from './useFetch'
import Chart from './Chart'
import 'styled-components/macro'

const API = 'https://api.coindesk.com/v1/bpi/historical/close.json'
const credits = (
  <p>
    Powered by <a href={'https://www.coindesk.com/price/'}>CoinDesk</a>
  </p>
)

function App() {
  const { error, loading, data } = useFetch(API)
  const chartData = loading
    ? []
    : Object.entries(data.bpi).map(([date, value]) => ({
        date: new Date(date),
        value
      }))
  const { width, height } = useWindowSize()
  const chartWidth = width * 0.6
  const chartHeight = Math.min(height * 0.45, width / 3)
  return (
    <div css="display: flex; height:100vh; flex-direction: column; align-items: center; justify-content: center">
      {loading ? (
        'loading'
      ) : (
        <Chart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          margin={{
            top: 30,
            left: 45,
            right: 0,
            bottom: 45
          }}
        />
      )}
      {credits}
    </div>
  )
}
export default App
