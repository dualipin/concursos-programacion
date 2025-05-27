import { useEffect, useState } from "react";
import FormConcurso from "@/compon/FormConcurso";
import { useParams } from "react-router";
import { api } from "@/api";

export default function EditarConcurso() {
  const params = useParams();

  const [concurso, setConcurso] = useState(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  async function fetchConcurso() {
    try {
      const response = await api.get("/concursos/obtener/" + params.clv);
      console.log("Concurso obtenido:", response.data);
      if (!response.status || response.status !== 200) {
        throw new Error("Error al obtener el concurso");
      }

      setConcurso({
        ...response.data,
        ffin: response.data.ffin,
        fins: response.data.fins
      });
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener el concurso:", err);
      setError("No se pudo obtener el concurso");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConcurso();
  }, [params.clv]);


  return (
    loading ? (
      <div>Cargando...</div>
    ) : error ? (
      <div>Error: {error}</div>
    ) : !concurso ? (
      <div>No se encontró el concurso</div>
    ) : (
      <FormConcurso accion="editar" {...concurso as any} />
    )
  )
}