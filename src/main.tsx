import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'
import App from './App.tsx'
import PowerProvider from './components/PowerProvider'
import AppVersion from './components/AppVersion'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <AppVersion />
      <App />
    </PowerProvider>
  </StrictMode>,
)
