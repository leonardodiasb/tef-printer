import ReactDOM from 'react-dom/client'
import UpdateNotification from './components/UpdateNotification/UpdateNotification'
import { StrictMode } from 'react'
import { DEFAULT_THEME, UiKitTheme } from 'takeat-design-system-ui-kit'

const CUSTOM_THEME = {
  ...DEFAULT_THEME,
  colors: {
    ...DEFAULT_THEME.colors,
    primary: {
      lightest: '#e5a1a4',
      lighter: '#db6e72',
      light: '#d13f45',
      default: '#a82743',
      dark: '#94090f',
      darker: '#610206'
    }
  }
}

ReactDOM.createRoot(document.getElementById('notification-root')!).render(
  <StrictMode>
    <UiKitTheme theme={CUSTOM_THEME}>
      <UpdateNotification />
    </UiKitTheme>
  </StrictMode>
)
