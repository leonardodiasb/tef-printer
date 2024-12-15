import { useEffect, useState } from "react"

export const useStatistics = (dataPointCount: number): Statistics[] => {
  const [value, setValue] = useState<Statistics[]>([])

  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((stats) => {
      setValue((prev) => {
        const newData = [...prev, stats]
        if (newData.length > dataPointCount) {
          newData.shift()
        }
        return newData;
      })
    })
    return unsub
  }, [])
  return value;
}