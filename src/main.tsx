import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App'
import { QueryProvider } from '@/lib/react-query/QueryProvider'
import { AuthProvider } from '@/context/AuthContext'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryProvider>
        </BrowserRouter>
    </StrictMode>,
)
