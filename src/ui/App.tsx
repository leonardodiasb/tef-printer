import { useMemo, useState } from 'react'
import './App.css'
import { useStatistics } from './hooks/useStatistics'
import { Chart } from './components/Chart'

function App() {
  const [count, setCount] = useState(0)
  const statistics = useStatistics(10)
  const cpuUsages = useMemo(() => {
    return statistics.map((stat) => stat.cpuUsage)
  }, [statistics])

  return (
    <>
      <div style={{ width: 200, height: 100 }}>
        <Chart data={cpuUsages} maxDataPoints={10} selectedView="CPU" />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
