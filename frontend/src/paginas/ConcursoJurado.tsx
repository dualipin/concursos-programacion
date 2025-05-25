import { obtenerConcursos, registrarConcurso } from "@/servicios/concurso-serv";
import { useEffect, useState } from "react";

export default function ConcursoJurado() {
    const [concursos, setConcursos] = useState([]);
    const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
    const [fechaFinFiltro, setFechaFinFiltro] = useState("");
    const [criterios, setCriterios] = useState<{ nombre: string; valor: number }[]>([]);

    const datos = async () => {
        const data = await obtenerConcursos();
        setConcursos(data);
    }

    useEffect(() => {
        datos();
    }, []);

    // Filtrado por fechas
    const concursosFiltrados = concursos.filter((data: any) => {
        const fini = new Date(data.fini);
        const ffin = new Date(data.ffin);

        let pasaFiltro = true;

        if (fechaInicioFiltro) {
            const filtroInicio = new Date(fechaInicioFiltro);
            pasaFiltro = pasaFiltro && ffin >= filtroInicio;
        }
        if (fechaFinFiltro) {
            const filtroFin = new Date(fechaFinFiltro);
            pasaFiltro = pasaFiltro && fini <= filtroFin;
        }
        return pasaFiltro;
    });

    // Manejo de criterios de evaluación
    const handleCriterioSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const nombre = formData.get("nombre") as string;
        const valor = Number(formData.get("valor"));
        if (!nombre) return;
        setCriterios([...criterios, { nombre, valor }]);
        form.reset();
        setCriterios([]);
    };

    return (
        <div className="container my-4">
            <h1 className="mb-4 text-center">Concurso Jurado</h1>
            {/* Formulario para crear concurso */}
            <form
                className="mb-4"
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    const fini = `${yyyy}-${mm}-${dd}`;

                    const nuevoConcurso = {
                        clv: formData.get("clv") as string,
                        nom: formData.get("nom") as string,
                        dsc: formData.get("dsc") as string,
                        fini,
                        ffin: formData.get("ffin") as string,
                        fmin: formData.get("fmin") as string,
                        rq: formData.get("rq") as string,
                        lugar: formData.get("lugar") as string,
                        maxpar: Number(formData.get("maxpar")),
                    };

                    // Validar fechas
                    const fechaFini = new Date(nuevoConcurso.fini);
                    const fechaFfin = new Date(nuevoConcurso.ffin);
                    const fechaFmin = new Date(nuevoConcurso.fmin);

                    if (fechaFini > fechaFfin) {
                        alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
                        return;
                    }

                    if (fechaFmin > fechaFfin) {
                        alert("La fecha de inscripción no puede ser mayor que la fecha de fin.");
                        return;
                    }

                    if (fechaFmin < fechaFini) {
                        alert("La fecha de inscripción no puede ser menor que la fecha de inicio.");
                        return;
                    }

                    try {
                        const response = await registrarConcurso(nuevoConcurso, criterios)

                        console.log(response)
                        alert('Concurso registrado')
                        form.reset();
                    } catch (error) {
                        console.error("Error al crear el concurso:", error);
                        alert("Error al crear el concurso. Por favor, inténtalo de nuevo.");
                    }

                    await datos()
                }}
            >
                <div className="row g-3">
                    <h2>
                        Datos del concurso
                    </h2>
                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success">Crear Concurso</button>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Clave</label>
                        <input name="clv" type="text" className="form-control" required maxLength={20} />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label">Nombre</label>
                        <input name="nom" type="text" className="form-control" required maxLength={100} />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Descripción</label>
                        <textarea name="dsc" className="form-control" rows={2}></textarea>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Fecha del concurso</label>
                        <input name="ffin" type="date" className="form-control" required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Fecha máxima de inscripción</label>
                        <input name="fmin" type="date" className="form-control" required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Valor máximo por participante</label>
                        <input name="maxpar" type="number" className="form-control" min={1} required />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Requisitos</label>
                        <textarea name="rq" className="form-control" rows={1} required></textarea>
                    </div>
                    <div className="col-12">
                        <label className="form-label">Lugar</label>
                        <textarea name="lugar" className="form-control" rows={1} required></textarea>
                    </div>


                </div>
            </form>

            {/* Apartado para crear criterios de evaluación */}
            <div className="mb-4">
                <h2 className="mb-3">Criterios de Evaluación</h2>
                <form className="row g-3" onSubmit={handleCriterioSubmit}>
                    <div className="col-md-5">
                        <label className="form-label">Nombre del criterio</label>
                        <input name="nombre" type="text" className="form-control" required maxLength={50} />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Valor</label>
                        <input name="valor" type="number" className="form-control" maxLength={150} />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100">Agregar</button>
                    </div>
                </form>
                {criterios.length > 0 && (
                    <ul className="list-group mt-3">
                        {criterios.map((c, idx) => (
                            <li className="list-group-item" key={idx}>
                                <strong>{c.nombre}</strong>
                                {c.valor && <>: {c.valor}</>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Filtros por fecha */}
            <hr />
            <div className="row g-3 mb-4">
                <h2>
                    Registros previos
                </h2>
                <div className="col-md-4">
                    <label className="form-label">Filtrar desde</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaInicioFiltro}
                        onChange={e => setFechaInicioFiltro(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Filtrar hasta</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaFinFiltro}
                        onChange={e => setFechaFinFiltro(e.target.value)}
                    />
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <button className="btn btn-danger" onClick={() => {
                        setFechaFinFiltro("");
                        setFechaInicioFiltro("");
                    }}>
                        Restablecer el filtro
                    </button>
                </div>
            </div>

            <div className="row g-3">
                {concursosFiltrados.map((data: any) => (<div className="col-12 col-md-4" key={data.clv}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{data.nom}</h5>
                            <p className="card-text">{data.dsc}</p>
                            <p>   {new Date(data.fini).toLocaleDateString('es-MX')} - {new Date(data.ffin).toLocaleDateString('es-MX')}</p>
                        </div>
                    </div>
                </div>))}
            </div>
        </div>
    );
}