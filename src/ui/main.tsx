import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DEFAULT_THEME, UiKitTheme } from 'takeat-design-system-ui-kit'
import { ConfigProvider } from './contexts/ConfigContext.tsx'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UiKitTheme theme={CUSTOM_THEME}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </UiKitTheme>
  </StrictMode>
)
