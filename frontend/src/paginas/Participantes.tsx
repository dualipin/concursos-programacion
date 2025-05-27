import { api } from "@/api";
import { useEffect, useState } from "react";

export default function Participantes() {
  const [listado, setListado] = useState<any[]>([]);

  async function fetchConcursosParticipantes() {
    try {
      const response = await api.get("/concursos/participantes");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los participantes:", error);
      return [];
    }
  }

  useEffect(() => {
    async function obtenerParticipantes() {
      const participantes = await fetchConcursosParticipantes();
      setListado(participantes);
    }
    obtenerParticipantes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Participantes</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        Participantes Registrados en algunos Concursos
      </p>

      {listado.length > 0 ? (
        <ul className="space-y-4">
          {listado.map((participante) => (
            <li
              key={participante.rfc}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-medium text-gray-800">
                {participante.nom} {participante.apds}
              </div>
              <div className="text-sm text-gray-500">{participante.rfc}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No hay participantes registrados.</p>
      )}
    </div>
  );
}