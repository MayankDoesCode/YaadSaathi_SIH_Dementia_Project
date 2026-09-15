import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { I18nProvider } from './i18n/I18nContext.jsx'
import { SaathiProvider } from './context/SaathiContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <AppProvider>
        <SaathiProvider>
          <App />
        </SaathiProvider>
      </AppProvider>
    </I18nProvider>
  </StrictMode>,
)

