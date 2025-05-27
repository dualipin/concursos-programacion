import { registrarConcurso } from "@/servicios/concurso-serv";
import { useState, type FormEvent } from "react";

type Criterio = {
  nombre: string;
  valor?: number;
};

type ConcursoData = {
  clv: string;
  nom: string;
  dsc?: string;
  fcre: string;
  ffin: string;
  fins: string;
  lugar: string;
  rq?: string;
  maxpar?: number;
};

export default function FormularioConcurso() {
  const [formulario, setFormulario] = useState<ConcursoData>({
    clv: "",
    nom: "",
    dsc: "",
    fcre: "",
    ffin: "",
    fins: "",
    lugar: "",
    rq: "",
    maxpar: undefined,
  });

  // const form = document.querySelector("form");
  // if (!form) {
  //   console.error("El formulario no se ha encontrado en el DOM.");
  //   return null;
  // }

  const [criterios, setCriterios] = useState<Criterio[]>([]);

  const handleSubmit = async () => {
    if (!validacion()) return;

    const form = document.getElementById("concursoForm") as HTMLFormElement;
    const formData = new FormData(form);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const fcre = `${yyyy}-${mm}-${dd}`;

    const nuevoConcurso: ConcursoData = {
      clv: formData.get("clv") as string,
      nom: formData.get("nom") as string,
      dsc: formData.get("dsc") as string,
      fcre,
      ffin: formData.get("ffin") as string,
      fins: formData.get("fins") as string,
      rq: formData.get("rq") as string,
      lugar: formData.get("lugar") as string,
      maxpar: Number(formData.get("maxpar")),
    };

    // Validar fechas
    const fechafcre = new Date(nuevoConcurso.fcre);
    const fechaFfin = new Date(nuevoConcurso.ffin);
    const fechaFins = new Date(nuevoConcurso.fins || nuevoConcurso.ffin);
    const fechaFmin = new Date(nuevoConcurso.fins || nuevoConcurso.ffin);

    if (fechafcre > fechaFfin) {
      alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
      return;
    }

    if (fechaFmin > fechaFfin) {
      alert("La fecha de inscripción no puede ser mayor que la fecha de fin.");
      return;
    }

    if (fechaFmin < fechafcre) {
      alert("La fecha de inscripción no puede ser menor que la fecha de inicio.");
      return;
    }

    try {
      await registrarConcurso(nuevoConcurso, criterios as []);
      form.reset();
      setCriterios([]);
    } catch (error) {
      console.error("Error al crear el concurso:", error);
      alert("Error al crear el concurso. Por favor, inténtalo de nuevo.");
    }
  };

  const agregarCriterio = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem('nombre') as HTMLInputElement).value;
    const valor = (form.elements.namedItem('valor') as HTMLInputElement).value;

    if (nombre) {
      setCriterios([...criterios, {
        nombre,
        valor: valor ? Number(valor) : undefined
      }]);
      form.reset();
    }
  };

  function validacion() {
    // Validar campos requeridos
    const requiredFields = [
      "clv",
      "nom",
      "ffin",
      "fins",
      "maxpar",
      "rq",
      "lugar",
    ];
    for (const field of requiredFields) {
      const value = (document.querySelector(`[name="${field}"]`) as HTMLInputElement)?.value;
      if (!value) {
        alert(`El campo ${field} es requerido.`);
        return false;
      }
    }
    return true;
  }


  return (
    <>
      <form
        className="mb-10 p-6 border rounded-lg shadow-md bg-white"
        id="concursoForm"
      >
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Datos del concurso</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium">Clave</label>
              <input
                name="clv"
                type="text"
                className="mt-1 block w-full border rounded p-2"
                required
                maxLength={20}
                pattern="[A-Za-z0-9]{1,20}"
                placeholder="Ej: CONCURSO2023"
                value={formulario.clv}
                onChange={(e) => setFormulario({ ...formulario, clv: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                name="nom"
                type="text"
                className="mt-1 block w-full border rounded p-2"
                required
                maxLength={100}
                placeholder="Ej: Concurso de Programación 2023"
                value={formulario.nom}
                onChange={(e) => setFormulario({ ...formulario, nom: e.target.value })}
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                name="dsc"
                className="mt-1 block w-full border rounded p-2"
                rows={2}
                placeholder="Ej: Un concurso para demostrar tus habilidades de programación."
                value={formulario.dsc}
                onChange={(e) => setFormulario({ ...formulario, dsc: e.target.value })}
              ></textarea>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium">Fecha del concurso</label>
              <input
                name="ffin"
                type="date"
                className="mt-1 block w-full border rounded p-2"
                required
                value={formulario.ffin}
                onChange={(e) => setFormulario({ ...formulario, ffin: e.target.value })}
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium">
                Fecha máxima de inscripción
              </label>
              <input
                name="fins"
                type="date"
                className="mt-1 block w-full border rounded p-2"
                value={formulario.fins}
                onChange={(e) => setFormulario({ ...formulario, fins: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium">
                Máximos participantes
              </label>
              <input
                name="maxpar"
                type="number"
                className="mt-1 block w-full border rounded p-2"
                min={1}
                max={1000}
                value={formulario.maxpar}
                onChange={(e) => setFormulario({ ...formulario, maxpar: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="block text-sm font-medium">Requisitos</label>
              <textarea
                name="rq"
                className="mt-1 block w-full border rounded p-2"
                rows={1}
                required
                maxLength={200}
                placeholder="Ej: Conocimientos básicos de programación"
                value={formulario.rq}
                onChange={(e) => setFormulario({ ...formulario, rq: e.target.value })}
              ></textarea>
            </div>
            <div className="col-span-1 md:col-span-3">
              <label className="block text-sm font-medium">Lugar</label>
              <textarea
                name="lugar"
                className="mt-1 block w-full border rounded p-2"
                rows={1}
                required
                placeholder="Ej: Auditorio Principal del ITSM"
                value={formulario.lugar}
                onChange={(e) => setFormulario({ ...formulario, lugar: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="mt-4 text-right">
          </div>
        </div>
      </form>


      <div className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Criterios de Evaluación</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={agregarCriterio}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Nombre del criterio</label>
            <input
              name="nombre"
              type="text"
              className="mt-1 block w-full border rounded p-2"
              required
              maxLength={50}
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium">Valor</label>
            <input
              name="valor"
              type="number"
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div className="md:col-span-3 text-right">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full md:w-auto">
              Agregar
            </button>
          </div>
        </form>
        {criterios.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Criterios agregados:</h3>
            <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200 border border-gray-200">
              {criterios.map((c, idx) => (
                <li key={idx} className="py-3 px-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-800">{c.nombre}</span>
                  {c.valor !== undefined && (
                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                      Valor: {c.valor}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={() => { handleSubmit() }}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Crear Concurso
          </button>
        </div>
      </div>
    </>
  );
}