import { useUsuarioStore } from '@/estados/usuario-est'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const enlacesAdmin = [
  { href: '/', label: 'Inicio' },
  { href: '/admin/criterios', label: 'Criterios de Evaluación' },
  {
    href: '/admin/concursos', label: 'Concursos', children: [
      { href: '/admin/concursos/crear', label: 'Crear Concurso' },
    ]
  },
  {
    href: '/admin/participantes', label: 'Participantes', children: [
      { href: '/admin/participantes/crear', label: 'Crear Participante' },
    ]
  },
  {
    href: '/admin/jurado', label: 'Jurado', children: [
      { href: '/admin/jurado/crear', label: 'Crear Jurado' },
    ]
  },
]

const enlacesParticipante = [
  { href: '/participante', label: 'Inicio Participante' },
  { href: '/participante/profile', label: 'Perfil' },
  { href: '/participante/events', label: 'Eventos' },
]

const enlacesJurado = [
  { href: '/jurado', label: 'Inicio Jurado' },
  { href: '/jurado/profile', label: 'Perfil' },
  { href: '/jurado/reviews', label: 'Revisiones' },
]

export default function Menu() {
  const [enlaces, setEnlaces] = useState(enlacesAdmin)
  const [abierto, setabierto] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const tipoUsuario = useUsuarioStore((state) => state.usuario?.tipo)
  const navigate = useNavigate()

  const isAdmin = tipoUsuario === 'admin'
  const isParticipante = tipoUsuario === 'participante'
  const isJurado = tipoUsuario === 'jurado'

  useEffect(() => {
    if (isAdmin) {
      setEnlaces(enlacesAdmin)
    } else if (isParticipante) {
      setEnlaces(enlacesParticipante)
    } else if (isJurado) {
      setEnlaces(enlacesJurado)
    }
  }, [isAdmin, isParticipante, isJurado])

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setabierto(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 flex flex-col h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50 ${abierto ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>

        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Concursos</h2>
            <button
              className="md:hidden"
              onClick={() => setabierto(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {enlaces.map((enlace) => {
              const hasChildren = enlace.children && Array.isArray(enlace.children)

              return (
                <li key={enlace.href} className="relative">
                  <div className="flex items-center">
                    <a
                      href={enlace.href}
                      className="block p-2 rounded hover:bg-gray-700 transition-colors flex-1"
                    >
                      {enlace.label}
                    </a>
                    {hasChildren && (
                      <button
                        type="button"
                        className="ml-2 p-1 rounded hover:bg-gray-700"
                        onClick={() =>
                          setOpenDropdown(openDropdown === enlace.href ? null : enlace.href)
                        }
                        aria-label="Mostrar submenu"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${openDropdown === enlace.href ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {hasChildren && openDropdown === enlace.href && (
                    <ul className="ml-4 mt-1 space-y-1 bg-gray-700 rounded shadow-lg absolute left-full top-0 min-w-max z-10">
                      {enlace.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            className="block p-2 rounded hover:bg-gray-600 transition-colors text-sm whitespace-nowrap"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className='mt-auto mb-4 p-4 text-center text-gray-400'>
          <p className='text-sm'>{useUsuarioStore.getState().usuario?.nom || 'Invitado'}</p>
          <p className='text-xs'>{useUsuarioStore.getState().usuario?.tipo.toLocaleUpperCase() || 'Desconocido'}</p>

          <button
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
            onClick={() => {
              useUsuarioStore.getState().setUsuario(null)
              navigate('/')
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <button
        className={`fixed top-4 right-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded ${abierto ? 'hidden' : 'block'}`}
        onClick={() => setabierto(!abierto)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="sr-only">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>
    </>
  )
}
