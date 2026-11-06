import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SourcesPage from './SourcesPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SourcesPage />
  </StrictMode>,
)
