import { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'

const UpdateNotification = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownloadAppUpdate = async () => {
    console.log('window', window)
    console.log('window.electron', window.electron)
    await window.electron.downloadAppUpdate()
  }

  useEffect(() => {
    return window.electron.updateNotificationWindow((update) => {
      console.log('updateR', update)
      setContent(update.type)
      setLoading(update.isLoading)
    })
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}
    >
      {loading ? (
        <ClipLoader color="black" size={30} speedMultiplier={0.7} />
      ) : (
        <>
          {content && (
            <>
              {content === 'UPDATE_AVAILABLE' && (
                <div>
                  <h1>Update Available</h1>
                  <button onClick={handleDownloadAppUpdate}>Download</button>
                </div>
              )}
              <div>{content}</div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default UpdateNotification
