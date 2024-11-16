import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Questions from './Questions.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Questions />
  </StrictMode>,
)
