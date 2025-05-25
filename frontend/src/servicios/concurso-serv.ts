import { api } from "@/api";

export async function obtenerConcursos() {
    const response = await api.get("/concursos");
    return response.data;
}

export async function proximosConcursos(): Promise<any[]> {
    const response = await api.get("/concursos");

    console.log("Concursos obtenidos:", response.data);
    const now = new Date();

    const proximos = response.data.filter((concurso: any) => {
        // Parse fmin as DD/MM/YYYY
        const [day, month, year] = concurso.fmin.split("/");
        const fechaMaxInscripcion = new Date(Number(year), Number(month) - 1, Number(day));
        return fechaMaxInscripcion >= now;
    });

    console.log("Proximos concursos:", proximos);

    return proximos;
}


export async function registrarConcurso(
    concurso: {
        clv: string;
        nom: string;
        dsc?: string;
        fini: string; // YYYY-MM-DD
        ffin: string; // YYYY-MM-DD
        fmin: string; // YYYY-MM-DD
        lugar: string;
    },
    criterios: { nombre: string; valor: number }[] = []
) {
    // Enviar ambos: concurso y criterios de evaluación
    const payload = {
        ...concurso,
        criterios
    };
    const response = await api.post("/concursos", payload);
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