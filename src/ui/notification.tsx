import ReactDOM from 'react-dom/client'
import UpdateNotification from './components/UpdateNotification/UpdateNotification'
import { StrictMode } from 'react'

ReactDOM.createRoot(document.getElementById('notification-root')!).render(
  <StrictMode>
    <UpdateNotification />
  </StrictMode>
)
