import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { SongContextProvider } from './features/home/song.context.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <SongContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SongContextProvider>
    </AuthProvider>
)
