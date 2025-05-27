import { api } from "@/api";
import CardConcurso from "@/compon/CardConcurso";
import { useUsuarioStore } from "@/estados/usuario-est";
import { useEffect, useState } from "react";

interface Concurso {
    clv: string;
    nom: string;
    dsc: string;
    fcre: string;
    ffin: string;
    fins: string;
    lugar: string;
    rq?: string;
    maxpar: number;
    link: string;
}


export default function Concursos() {
    const tipo = useUsuarioStore((state) => state.usuario?.tipo);
    const [concursos, setConcursos] = useState<Concurso[]>([]);


    async function fetchConcursos() {
        try {
            const response = await api.get("/concursos/obtener");
            setConcursos(response.data);
        } catch (error) {
            console.error("Error al obtener los concursos:", error);
        }
    }

    useEffect(() => {
        fetchConcursos();
    }, []);


    const [fechaInicioFiltro, setFechaInicioFiltro] = useState("");
    const [fechaFinFiltro, setFechaFinFiltro] = useState("");


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

    return (
        <div className="container mx-auto my-12 px-4">

            {/* Filtros por fecha */}
            <hr className="mb-6" />
            <div className="mb-8 p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Registros previos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium">Filtrar desde</label>
                        <input
                            type="date"
                            className="mt-1 block w-full border rounded p-2"
                            value={fechaInicioFiltro}
                            onChange={(e) => setFechaInicioFiltro(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Filtrar hasta</label>
                        <input
                            type="date"
                            className="mt-1 block w-full border rounded p-2"
                            value={fechaFinFiltro}
                            onChange={(e) => setFechaFinFiltro(e.target.value)}
                        />
                    </div>
                    <div className="text-right">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded w-full md:w-auto"
                            onClick={() => {
                                setFechaFinFiltro("");
                                setFechaInicioFiltro("");
                            }}
                        >
                            Restablecer el filtro
                        </button>
                    </div>
                </div>
            </div>


            <h1 className="mb-10 text-center font-bold text-4xl text-blue-600">Concursos</h1>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
                {concursosFiltrados.map((concurso, idx) => (
                    <CardConcurso
                        key={idx}
                        titulo={concurso.nom}
                        descripcion={concurso.dsc}
                        concurso={concurso}
                    >
                        {
                            tipo === "participante" && (
                                <a
                                    href={concurso.link}
                                    className="mt-4 self-end rounded-full font-medium border border-blue-500 text-blue-500 hover:bg-blue-200 px-5 py-2 transition"
                                >
                                    Inscribirse
                                </a>
                            )
                        }

                        {
                            tipo === "admin" && (
                                <a
                                    href={`/admin/concursos/editar/${concurso.clv}`}
                                    className="mt-4 self-end rounded-full font-medium border border-blue-500 text-blue-500 hover:bg-blue-200 px-5 py-2 transition"
                                >
                                    Administrar
                                </a>
                            )
                        }

                        {
                            tipo === "jurado" && (
                                <a
                                    href={concurso.link}
                                    className="mt-4 self-end rounded-full font-medium border border-blue-500 text-blue-500 hover:bg-blue-200 px-5 py-2 transition"
                                >
                                    Evaluar
                                </a>
                            )
                        }
                    </CardConcurso>
                ))}
            </div>
        </div>
    );
}

