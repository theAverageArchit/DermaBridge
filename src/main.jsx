import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import DoctorView from './pages/DoctorView'
import PatientView from './pages/PatientView'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/doctor" element={<DoctorView />} />
        <Route path="/patient" element={<PatientView />} />
        <Route path="*" element={<Navigate to="/doctor" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)