import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h3 className='bg-green-100 text-center font-semibold text-sm'>The backend is hosted on Render Free Tier. It must have gone to sleep, so might take some time to respond.</h3>
    <App />
  </StrictMode>,
)
