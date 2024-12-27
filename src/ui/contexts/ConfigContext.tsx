/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react'

interface ConfigProviderProps {
  children: React.ReactNode
}

export interface ConfigProps {
  config: StoneConfig
  setConfig: React.Dispatch<React.SetStateAction<StoneConfig>>
}

const initialConfig: ConfigProps = {
  config: { StoneCode: '', COMPort: '' },
  setConfig: () => {}
}

export const ConfigContext = createContext<ConfigProps>(initialConfig)

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [config, setConfig] = useState(initialConfig.config)

  useEffect(() => {
    return window.electron.readConfigFile((conf) => {
      setConfig(conf)
    })
  }, [])

  const value = { config, setConfig }
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}
