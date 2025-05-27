import React, { type ReactNode } from "react";

type Concurso = {
    clv: string;
    nom: string;
    dsc: string;
    fcre?: string;
    ffin: string;
    fins: string;
    lugar: string;
    rq?: string;
    maxpar: number;
};

type CardConcursoProps = {
    titulo: string;
    descripcion: string;
    tipo?: "participante" | "admin" | "jurado";
    link?: string;
    concurso?: Concurso;
    idx?: number;
    children?: ReactNode;
};

const CardConcurso: React.FC<CardConcursoProps> = ({
    titulo,
    descripcion,
    concurso,
    idx,
    children,
}) => {
    return (
        <div className="w-full max-w-sm" key={idx}>
            <div className="shadow-lg h-full rounded-xl bg-gradient-to-br from-blue-100 to-white">
                <div className="p-6 flex flex-col justify-between h-full">
                    <h5 className="text-blue-600 font-semibold text-lg mb-2">{titulo}</h5>
                    <p className="text-gray-600 flex-1">{descripcion}</p>
                    {concurso && (
                        <div className="mt-4 text-sm text-gray-500">
                            <p>Fecha final: {concurso.ffin}</p>
                            <p>Lugar: {concurso.lugar}</p>
                            <p>Máximo de participantes: {concurso.maxpar}</p>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CardConcurso;