import { api } from "@/api";

export async function obtenerConcursos() {
    const response = await api.get("/concursos/obtener");
    return response.data;
}

export async function proximosConcursos(): Promise<any[]> {
    const response = await api.get("/concursos/proximos");
    return response.data;
}


export async function registrarConcurso(
    concurso: {
        clv: string;
        nom: string;
        dsc?: string;
        fcre: string; // YYYY-MM-DD
        ffin: string; // YYYY-MM-DD
        fins: string; // YYYY-MM-DD
        lugar: string;
        rq?: string; // Requisitos
        maxpar?: number; // Máximo de participantes
    },
    criterios: [] = []
) {
    const rfc = localStorage.getItem("rfc");
    // Enviar ambos: concurso y criterios de evaluación
    const payload = {
        ...concurso,
        criterios
    };
    const response = await api.post("/concursos/registrar/" + rfc, payload);
    return response.data;
}

export async function buscarConcurso(clv: string) {
    const response = await api.get(`/concursos/${clv}`);
    return response.data;
}

export async function editarConcurso(
    clv: string,
    concurso: {
        nom: string;
        dsc?: string;
        fini: string; // YYYY-MM-DD
        ffin: string; // YYYY-MM-DD
        fmin: string; // YYYY-MM-DD
        lugar: string;
    },
    criterios: { nombre: string; valor: number }[] = []
) {
    const payload = {
        ...concurso,
        criterios
    };
    const response = await api.put(`/concursos/${clv}`, payload);
    return response.data;
}