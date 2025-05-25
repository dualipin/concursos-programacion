import { obtenerConcursos } from "@/servicios/concurso-serv";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


export default function InicioJurado() {



  const navigate = useNavigate();

  const [concursos, setConcursos] = useState([]);

  useEffect(() => {
    // Simulación de una llamada a la API para obtener los concursos
    const fetchConcursos = async () => {
      const concursosData = await obtenerConcursos();
      // Aquí deberías hacer la llamada a tu API para obtener los concursos
      // Por ejemplo: const response = await api.get("/concursos");
      // setConcursos(response.data);
      setConcursos(concursosData);
    };

    fetchConcursos();
  }
    , []);

  const handleVerDetalles = (id: number) => {
    navigate(`/jurado/concurso/${id}`);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <h1 className="mt-5">Bienvenido, Jurado</h1>
          <p className="lead">Gestiona y evalúa los concursos próximos a realizarse.</p>
          <p className="text-muted">Selecciona un concurso para ver más detalles o gestionar tus evaluaciones.</p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <h2 className="text-center">Concursos Activos</h2>
          <ul className="list-group mt-3">
            {concursos.map((concurso: any, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5>{concurso.nom}</h5>
                  <p className="mb-0 text-muted">Fecha: {concurso.ffin}</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleVerDetalles(concurso.clv)}
                >
                  Ver Detalles
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}