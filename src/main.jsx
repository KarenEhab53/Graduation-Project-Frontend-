import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AuthProvider } from './context/AuthContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { DoctorProvider } from './context/DoctorContext.jsx'
import { NIDProvider } from './context/NIDContext.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <DoctorProvider>
            <NIDProvider>
              <App />
            </NIDProvider>
          </DoctorProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
