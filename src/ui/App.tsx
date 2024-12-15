import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useStatistics } from './hooks/useStatistics'
import { Chart } from './components/Chart'

function App() {
  const [count, setCount] = useState(0)
  const [activeView, setActiveView] = useState<View>('CPU')
  const statistics = useStatistics(10)
  const cpuUsages = useMemo(() => {
    return statistics.map((stat) => stat.cpuUsage)
  }, [statistics])
  const ramUsages = useMemo(() => {
    return statistics.map((stat) => stat.ramUsage)
  }, [statistics])
  const storageUsages = useMemo(() => {
    return statistics.map((stat) => stat.storageUsage)
  }, [statistics])
  const activeUsages = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuUsages
      case 'RAM':
        return ramUsages
      case 'STORAGE':
        return storageUsages
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages])

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view))
  }, [])

  return (
    <>
      <div style={{ width: 200, height: 100 }}>
        <Chart
          selectedView={activeView}
          data={activeUsages}
          maxDataPoints={10}
        />{' '}
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
