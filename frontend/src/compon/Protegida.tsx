// componentes/Protegido.tsx
import { useUsuarioStore } from '@/estados/usuario-est';
import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router';

const Protegida = ({ children }: { children: JSX.Element }) => {
  const { usuario } = useUsuarioStore(); // tu lógica de login, por ejemplo Zustand
  const location = useLocation();

  if (!usuario) {
    // Redirige al login y guarda la ubicación previa
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default Protegida;
