import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { FavoritesProvider } from './contexts/FavoritesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </StrictMode>,
)
