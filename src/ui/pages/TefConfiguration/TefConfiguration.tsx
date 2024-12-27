import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Select } from 'takeat-design-system-ui-kit'
import { ConfigContext } from '../../contexts/ConfigContext'

const INTEGRATION_TYPES = [
  {
    value: 'stone',
    label: 'Stone'
  }
  // {
  //   value: 'getnet',
  //   label: 'Getnet'
  // }
]

const COM_PORTS = [
  {
    value: 'COM1',
    label: 'COM1'
  },
  {
    value: 'COM2',
    label: 'COM2'
  },
  {
    value: 'COM3',
    label: 'COM3'
  },
  {
    value: 'COM4',
    label: 'COM4'
  },
  {
    value: 'COM5',
    label: 'COM5'
  },
  {
    value: 'COM6',
    label: 'COM6'
  },
  {
    value: 'COM7',
    label: 'COM7'
  },
  {
    value: 'COM8',
    label: 'COM8'
  },
  {
    value: 'COM9',
    label: 'COM9'
  },
  {
    value: 'COM10',
    label: 'COM10'
  },
  {
    value: 'COM11',
    label: 'COM11'
  },
  {
    value: 'COM12',
    label: 'COM12'
  },
  {
    value: 'COM13',
    label: 'COM13'
  },
  {
    value: 'COM14',
    label: 'COM14'
  }
]

export const TefConfiguration = () => {
  const { config, setConfig } = useContext(ConfigContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedIntegrationType, setSelectedIntegrationType] = useState('')
  const [stoneCode, setStoneCode] = useState('')
  const [COMPort, setCOMPort] = useState('')

  useEffect(() => {
    if (config) {
      setSelectedIntegrationType(config.StoneCode ? 'stone' : '')
      setStoneCode(config.StoneCode)
      setCOMPort(config.COMPort)
    }
  }, [config])

  const handleSave = () => {
    const newConfig = {
      StoneCode: stoneCode,
      COMPort
    }
    window.electron.writeConfigFile(newConfig)
    setConfig(newConfig)
    navigate('/')
  }

  return (
    <div>
      <div>
        <Link to="/">Back</Link>
        <h1>Tef Configuration</h1>
      </div>
      <div>
        <Select
          label="Selecione o tipo de integração"
          isLoading={loading}
          options={INTEGRATION_TYPES}
          value={INTEGRATION_TYPES.find(
            (i) => i.value === selectedIntegrationType
          )}
          onChange={(e) => {
            if (e) {
              setSelectedIntegrationType(e.value)
            }
          }}
        />
      </div>
      {selectedIntegrationType === 'stone' && (
        <div>
          <Input
            type="number"
            isLoading={loading}
            label="StoneCode"
            value={stoneCode}
            onChange={(e) => setStoneCode(e.target.value)}
          />
          <Select
            label="Porta COM"
            isLoading={loading}
            options={COM_PORTS}
            value={COM_PORTS.find((i) => i.value === COMPort)}
            onChange={(e) => {
              if (e) {
                setCOMPort(e.value)
              }
            }}
          />
        </div>
      )}
      <Button onClick={handleSave}>Salvar</Button>
    </div>
  )
}
