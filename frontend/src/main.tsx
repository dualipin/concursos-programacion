import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import router from './rutas.tsx'
import './index.css'
import Cargando from './Cargando.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Cargando />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
