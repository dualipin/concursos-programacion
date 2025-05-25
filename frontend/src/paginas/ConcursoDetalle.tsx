import { buscarConcurso } from "@/servicios/concurso-serv";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function ConcursoDetalle() {
    const [concurso, setConcurso] = useState<any>(null);
    const [error, setError] = useState("");
    const { clv } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConcurso = async () => {
            try {
                const response = await buscarConcurso(clv!);
                setConcurso(response);
            } catch (err) {
                setError("Error al cargar el concurso");
            }
        };

        fetchConcurso();
    }, [clv]);

    const handleEdit = () => {
        navigate(`/jurado/concurso/${clv}/editar`);
    };
    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este concurso?")) {
            try {
                // Aquí deberías implementar la lógica para eliminar el concurso
                // await eliminarConcurso(clv);
                alert("Concurso eliminado");
                navigate("/concursos");
            } catch (err) {
                setError("Error al eliminar el concurso");
            }
        }
    }
    return (
        <div className="container">
            <h1 className="mt-5">Detalles del Concurso</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {concurso ? (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">{concurso.nom}</h5>
                        <p className="card-text">Descripción: {concurso.dsc}</p>
                        <p className="card-text">Fecha de Inicio: {concurso.fini}</p>
                        <p className="card-text">Fecha de Fin: {concurso.ffin}</p>
                        <p className="card-text">Fecha de Inscripción: {concurso.fmin}</p>
                        <p className="card-text">Lugar: {concurso.lugar}</p>
                        {concurso.criterios && concurso.criterios.length > 0 && (
                            <div className="mb-3">
                                <h6>Criterios de Evaluación:</h6>
                                <ul>
                                    {concurso.criterios.map((criterio: any, idx: number) => (
                                        <li key={idx}>
                                            {criterio.nombre} {criterio.valor !== undefined && `(${criterio.valor})`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button onClick={handleEdit} className="btn btn-primary me-2">Editar</button>
                        <button onClick={handleDelete} className="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            ) : (
                <div className="alert alert-info mt-4">Cargando detalles del concurso...</div>
            )}
        </div>
    );
}