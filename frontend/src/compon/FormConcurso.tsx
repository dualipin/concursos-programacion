import { api } from "@/api";
import { useUsuarioStore } from "@/estados/usuario-est";
import { useState } from "react";

type Props = {
  clv?: string;
  nom?: string;
  dsc?: string;
  fcre?: string;
  ffin?: string;
  fins?: string;
  lugar?: string;
  rq?: string;
  maxpar?: number;
  criterios?: {
    clv?: string;
    cvlcon?: string;
    nombre: string;
    valor: number;
  }[]

  accion: 'crear' | 'editar';
}


export default function FormConcurso(props?: Props) {
  const [mensaje, setMensaje] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [clv, setClv] = useState<string>(props?.clv || '');
  const [nom, setNom] = useState<string>(props?.nom || '');
  const [dsc, setDsc] = useState<string>(props?.dsc || '');

  const [ffin, setFfin] = useState<string>(props?.ffin || '');
  const [fins, setFins] = useState<string>(props?.fins || '');
  const [lugar, setLugar] = useState<string>(props?.lugar || '');
  const [rq, setRq] = useState<string>(props?.rq || '');
  const [maxpar, setMaxpar] = useState<number | undefined>(props?.maxpar || undefined);
  const [criterios, setCriterios] = useState<{ nombre: string; valor: number }[]>(props?.criterios || []);

  const rfc = useUsuarioStore((state) => state.usuario?.rfc);

  function validarFechas() {
    if (!ffin || !fins) {
      setError("Las fechas de finalización e inscripción son obligatorias.");
      return false;
    }
    const fechaFin = new Date(ffin);
    const fechaInscripcion = new Date(fins);
    if (fechaFin < fechaInscripcion) {
      setError("La fecha de finalización del concurso no puede ser anterior a la fecha máxima de inscripción.");
      return false;
    }
    if (fechaInscripcion < new Date()) {
      setError("La fecha máxima de inscripción no puede ser anterior a la fecha actual.");
      return false;
    }
    return true;
  }

  function limpiar() {
    setClv('');
    setNom('');
    setDsc('');
    setFfin('');
    setFins('');
    setLugar('');
    setRq('');
    setMaxpar(undefined);
    setCriterios([]);
  }

  async function enviar() {
    if (!validarFechas()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMensaje('');

      if (props?.accion === 'editar' && !clv) {
        setError("La clave del concurso es obligatoria para editar.");
        return;
      }
      if (props?.accion === 'crear' && !rfc) {
        setError("El RFC del usuario es obligatorio para crear un concurso.");
        return;
      }


      if (props?.accion === 'crear') {


        const response = await api.post('/concursos/registrar/' + rfc, {
          clv,
          nom,
          dsc,
          ffin,
          fins,
          lugar,
          rq,
          maxpar,
          criterios,
        });

        if (response.status !== 201) {
          setError("Error al crear el concurso. Por favor, inténtalo de nuevo más tarde.");
          return;
        }
        if (response.data.error) {
          setError(response.data.error);
          return;
        }
        setError('');
        limpiar();
        setMensaje("Concurso creado exitosamente.");
      } else if (props?.accion === 'editar') {
        const response = await api.put(`/concursos/actualizar/${clv}/${rfc}`, {
          nom,
          dsc,
          ffin,
          fins,
          lugar,
          rq,
          maxpar,
          criterios,
        });

        if (response.status !== 200) {
          setError("Error al editar el concurso. Por favor, inténtalo de nuevo más tarde.");
          return;
        }
        if (response.data.error) {
          setError(response.data.error);
          return;
        }
        setError('');


        setMensaje("Concurso editado exitosamente.");
      }
    } catch (error) {
      console.error("Error al crear el concurso:", error);
      setError("Error al crear el concurso. Por favor, inténtalo de nuevo más tarde.");
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6 bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      {mensaje && (
        <div className="bg-green-100 text-green-700 p-4 rounded">
          <p className="font-semibold">Éxito:</p>
          <p>{mensaje}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="clv" className="font-medium text-gray-700">Clave</label>
          <input
            type="text"
            id="clv"
            name="clv"
            value={clv}
            required
            placeholder="Clave del Concurso"
            className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            onChange={(e) => { setClv(e.target.value) }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="nom" className="font-medium text-gray-700">Nombre del Concurso</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={nom}
            required
            onChange={(e) => { setNom(e.target.value) }}
            placeholder="Nombre del Concurso"
            className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="dsc" className="font-medium text-gray-700">Descripción</label>
        <textarea
          id="dsc"
          name="dsc"
          value={dsc}
          onChange={(e) => { setDsc(e.target.value) }}
          placeholder="Descripción del Concurso"
          className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="ffin" className="font-medium text-gray-700">Fecha Final</label>
          <input
            type="date"
            id="ffin"
            name="ffin"
            onChange={(e) => { setFfin(e.target.value) }}
            value={ffin}
            required
            className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fins" className="font-medium text-gray-700">Fecha Máxima de Inscripción</label>
          <input
            type="date"
            id="fins"
            name="fins"
            onChange={(e) => { setFins(e.target.value) }}
            value={fins}
            required
            className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="lugar" className="font-medium text-gray-700">Lugar</label>
        <textarea
          id="lugar"
          name="lugar"
          onChange={(e) => { setLugar(e.target.value) }}
          placeholder="Lugar del Concurso"
          value={lugar}
          required
          className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
        ></textarea>
      </div>
      <div className="flex flex-col">
        <label htmlFor="rq" className="font-medium text-gray-700">Requisitos</label>
        <textarea
          id="rq"
          name="rq"
          onChange={(e) => { setRq(e.target.value) }}
          placeholder="Requisitos para Participar"
          required
          value={rq}
          className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
        ></textarea>
      </div>
      <div className="flex flex-col">
        <label htmlFor="maxpar" className="font-medium text-gray-700">Máximo de Participantes</label>
        <input
          type="number"
          id="maxpar"
          onChange={(e) => { setMaxpar(Number(e.target.value)) }}
          placeholder="Máximo de Participantes"
          name="maxpar"
          value={maxpar !== undefined ? maxpar : ''}
          required
          className="mt-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="font-medium text-gray-700">Criterios de Evaluación</label>
        <p className="text-sm text-gray-500">Define los criterios que se utilizarán para evaluar las participaciones.</p>
        <button
          type="button"
          onClick={() => {
            const newCriterio = { nombre: '', valor: 0 };
            setCriterios([...criterios, newCriterio]);
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          Agregar Criterio
        </button>
      </div>
      <div className="flex flex-col">
        <label className="font-medium text-gray-700">Criterios de Evaluación</label>
        {criterios.map((criterio, index) => (
          <div key={index} className="flex flex-col md:flex-row md:space-x-4 mt-2 items-center">
            <input
              type="text"
              onChange={(e) => {
                const newCriterios = [...criterios];
                newCriterios[index].nombre = e.target.value;
                setCriterios(newCriterios);
              }}
              name={`criterio-${index}-nombre`}
              value={criterio.nombre}
              placeholder="Nombre del Criterio"
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            <input
              type="number"
              name={`criterio-${index}-valor`}
              onChange={(e) => {
                const newCriterios = [...criterios];
                newCriterios[index].valor = Number(e.target.value);
                setCriterios(newCriterios);
              }}
              value={criterio.valor ? criterio.valor : ''}
              placeholder="Valor del Criterio"
              required
              className="w-full md:w-24 mt-2 md:mt-0 p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={() => {
                const newCriterios = criterios.filter((_, i) => i !== index);
                setCriterios(newCriterios);
              }}
              className="mt-2 md:mt-0 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:ring focus:ring-red-300"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          enviar();
        }}
        disabled={loading}
        className="w-full mt-6 px-4 py-2 disabled:opacity-50 bg-green-500 text-white rounded hover:bg-green-600 focus:ring focus:ring-green-300"
      >
        {props?.accion === 'crear' ? 'Crear Concurso' : 'Editar Concurso'}
      </button>
    </form>
  );
}
