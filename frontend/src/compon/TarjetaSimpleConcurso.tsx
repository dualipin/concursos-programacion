interface Concurso {
  id?: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado?: 'activo' | 'proximo' | 'finalizado';
  premio?: string;
  participantes?: number;
}

interface TarjetaSimpleConcursoProps {
  concurso: Concurso;
  onClick?: () => void;
}

export default function TarjetaSimpleConcurso({
  concurso,
  onClick
}: TarjetaSimpleConcursoProps) {
  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'proximo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`
        bg-white shadow-lg rounded-xl p-6 mb-6 
        border border-gray-100 
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:scale-[1.02] hover:border-gray-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {/* Header con título y estado */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800 leading-tight">
          {concurso.nombre}
        </h2>
        {concurso.estado && (
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold border
            ${getEstadoColor(concurso.estado)}
          `}>
            {concurso.estado.charAt(0).toUpperCase() + concurso.estado.slice(1)}
          </span>
        )}
      </div>

      {/* Descripción */}
      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
        {concurso.descripcion}
      </p>

      {/* Información adicional */}
      <div className="space-y-3">
        {/* Fechas */}
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              <span className="font-medium">Inicio:</span> {formatDate(concurso.fechaInicio)}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              <span className="font-medium">Fin:</span> {formatDate(concurso.fechaFin)}
            </span>
          </div>
        </div>

        {/* Premio y participantes */}
        {(concurso.premio || concurso.participantes) && (
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 pt-2 border-t border-gray-100">
            {concurso.premio && (
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">{concurso.premio}</span>
              </div>
            )}
            {concurso.participantes && (
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM9 1a1 1 0 000 2v3a1 1 0 002 0V3a1 1 0 100-2H9zM6 15a2 2 0 104 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 13a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2z" />
                </svg>
                <span className="text-sm">{concurso.participantes} participantes</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}