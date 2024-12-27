import { useState, useEffect } from 'react'
import { Button, IconClose, Spinner } from 'takeat-design-system-ui-kit'
import TktSvg from '../../../assets/Tkt.svg'

const UpdateNotification = () => {
  const [type, setType] = useState<UpdateNotificaionWindowTypes>(
    'CHECKING_FOR_UPDATES'
  )
  const [loadingButton, setLoadingButton] = useState(false)
  const [newVersion, setNewVersion] = useState('')
  const [newVersionChangelog, setNewVersionChangelog] = useState('')
  const [downloadProgressPercentage, setDownloadProgressPercentage] =
    useState('')

  const handleDownloadAppUpdate = async () => {
    setLoadingButton(true)
    await window.electron.downloadAppUpdate()
  }

  const handleCloseNotificationWindow = () => {
    window.electron.closeNotificationWindow()
  }

  useEffect(() => {
    setLoadingButton(false)
    return window.electron.updateNotificationWindow((update) => {
      if (update.type === 'UPDATE_AVAILABLE') {
        setNewVersion(update.content.version)
        setNewVersionChangelog(update.content.releaseNotes)
      }
      if (update.type === 'DOWNLOAD_PROGRESS') {
        setDownloadProgressPercentage(
          update.content.progress.percent.toFixed(2)
        )
      }
      setType(update.type)
    })
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        boxSizing: 'border-box',
        textAlign: 'center',
        gap: '16px'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 12,
          cursor: 'pointer',
          fontSize: 24,
          fontWeight: 600,
          width: 24,
          height: 24
        }}
        onClick={handleCloseNotificationWindow}
      >
        <IconClose fontSize={24} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '16px'
        }}
      >
        <img src={TktSvg} alt="logo" width={100} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '220px',
            textAlign: 'left'
          }}
        >
          {type === 'CHECKING_FOR_UPDATES' && (
            <>
              <p style={{ fontSize: 14, width: '100%' }}>
                Procurando por atualizações...
              </p>
              <div style={{ marginBottom: 8 }}>
                <Spinner size={30} color="#000" />
              </div>
            </>
          )}
          {type === 'UPDATE_AVAILABLE' && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%'
                }}
              >
                <p style={{ fontSize: 14 }}>Nova versão: v{newVersion}.</p>
                <p style={{ fontSize: 10 }}>Changelog:</p>
                <div
                  style={{ fontSize: 10, marginLeft: 8 }}
                  dangerouslySetInnerHTML={{ __html: newVersionChangelog }}
                ></div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Button
                  style={{ fontSize: 12, padding: 12, height: 24, width: 80 }}
                  onClick={handleCloseNotificationWindow}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={loadingButton}
                  isLoading={loadingButton}
                  style={{ fontSize: 12, padding: 12, height: 24, width: 80 }}
                  onClick={handleDownloadAppUpdate}
                >
                  Baixar
                </Button>
              </div>
            </>
          )}
          {type === 'UPDATE_NOT_AVAILABLE' && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%'
                }}
              >
                <p style={{ fontSize: 14 }}>Nenhum update disponível.</p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Button
                  style={{ fontSize: 12, padding: 12, height: 24, width: 80 }}
                  onClick={handleCloseNotificationWindow}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
          {type === 'DOWNLOAD_PROGRESS' && (
            <>
              <p style={{ fontSize: 16, marginTop: 16 }}>
                Baixando... {downloadProgressPercentage}%
              </p>
              <div style={{ marginBottom: 8 }}>
                <Spinner size={30} color="#000" />
              </div>
            </>
          )}
          {type === 'UPDATE_DOWNLOADED' && (
            <>
              <p style={{ fontSize: 14, width: '100%' }}>
                Reiniciando aplicativo para instalação.
              </p>
              <div style={{ marginBottom: 8 }}>
                <Spinner size={30} color="#000" />
              </div>
            </>
          )}
          {type === 'ERROR' && (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: '100%'
                }}
              >
                <p style={{ fontSize: 14, width: '100%' }}>
                  Algum erro ocorreu.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Button
                  style={{ fontSize: 12, padding: 12, height: 24, width: 80 }}
                  onClick={handleCloseNotificationWindow}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdateNotification
