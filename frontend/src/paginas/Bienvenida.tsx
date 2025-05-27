import { useUsuarioStore } from "@/estados/usuario-est";
import { obtenerConcursos } from "@/servicios/concurso-serv";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Bienvenida() {
  const navigate = useNavigate();
  const [concursos, setConcursos] = useState([]);
  const tipo = useUsuarioStore((state) => state.usuario?.tipo || "");

  useEffect(() => {
    const fetchConcursos = async () => {
      const concursosData = await obtenerConcursos();
      setConcursos(concursosData);
    };

    fetchConcursos();
  }, []);

  const handleVerDetalles = (id: number) => {
    if (tipo === "jurado") {
      navigate(`/jurado/concursos/${id}`);
    }
    else if (tipo === "participante") {
      navigate(`/participante/concursos/${id}`);
    }
    else if (tipo === "admin") {
      navigate(`/admin/concursos/editar/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center">
        <h1 className="mt-10 text-4xl font-bold">Bienvenido</h1>
      </div>
      <div className="mt-10">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Concursos
        </h2>
        <ul className="space-y-4">
          {concursos.length === 0 && (
            <li className="text-red-600 font-bold bg-yellow-200 p-4 text-center rounded">
              ¡Atención! No hay concursos disponibles en este momento.
            </li>
          )}

          {concursos.map((concurso: any, idx) => (
            <li
              key={idx}
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <div>
                <h5 className="text-xl font-medium">{concurso.nom}</h5>
                <p className="text-gray-500">Fecha: {concurso.ffin}</p>
              </div>
              <button
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={() => handleVerDetalles(concurso.clv)}
              >
                Ver Detalles
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
