import LoginForm from "@/compon/LoginForm";
import TarjetaSimpleConcurso from "@/compon/TarjetaSimpleConcurso";
import { useUsuarioStore } from "@/estados/usuario-est";
import { proximosConcursos } from "@/servicios/concurso-serv";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Inicio() {
    const usuario = useUsuarioStore((state) => state.usuario);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica si el usuario ya está autenticado
        if (usuario?.rfc) {
            if (usuario.tipo === "jurado") {
                navigate("/jurado");
            } else if (usuario.tipo === "participante") {
                navigate("/participante");
            } else if (usuario.tipo === "admin") {
                navigate("/admin");
            }
        }

        const obtenerProximosConcursos = async () => {
            const response = await proximosConcursos() as any;
            setConursos(response);
        };

        obtenerProximosConcursos();
    }, [usuario]);

    const [concursos, setConursos] = useState([]);

    return (
        <div className="container mx-auto my-10 mt-20 px-4">
            <div className="text-center mb-10">
                <img
                    src="https://escolar.macuspana.tecnm.mx/imagenes/empresa/logo2.png"
                    alt="logo itsm"
                    className="mx-auto mb-6 max-w-xs"
                />
                <h1 className="text-3xl font-bold mb-2">Concursos de Programación</h1>
                <p className="text-gray-500 mb-2">
                    Plataforma para consultar e inscribirse en concursos de programación.
                </p>
                <p>
                    <strong>Si deseas más información o quieres inscribirte, inicia sesión o regístrate</strong>
                </p>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                    <LoginForm />
                </div>
                <div className="lg:w-2/3">
                    {concursos.length === 0 ? (
                        <div className="bg-blue-100 text-blue-800 border border-blue-400 rounded p-6 text-center">
                            No hay concursos próximos disponibles.
                            <br />
                            <strong>Puede que proximamente existan disponibles</strong>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-center mb-6">Próximos Concursos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {concursos.map((concurso: any) => (
                                    <TarjetaSimpleConcurso
                                        key={concurso.clv}
                                        concurso={
                                            {
                                                nombre: concurso.nom,
                                                descripcion: concurso.dsc,
                                                estado: "activo",
                                                fechaInicio: concurso.ffin,
                                                fechaFin: concurso.fins,
                                                participantes: concurso.fechaMaximaInscripcion,
                                                premio: concurso.lugar,
                                            }

                                        }

                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
