import { api } from "@/api";
import { useEffect, useState } from "react";

export default function Criterios() {
  const [criterios, setCriterios] = useState([]);
  const [editingCriterio, setEditingCriterio] = useState<{
    clv: string;
    nom: string;
  } | null>(null);

  useEffect(() => {
    async function fetchCriterios() {
      const response = await api.get("/criterios/obtener");
      setCriterios(response.data);
    }

    fetchCriterios();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-3xl">
        Criterios de Evaluación
      </h1>
      <p className="text-center text-gray-600">
        Aquí puedes gestionar los criterios de evaluación para los concursos.
      </p>
      <form
        className="mt-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const nom = formData.get("nom") as string;
          if (!nom.trim()) {
            alert("El nombre del criterio es requerido.");
            return;
          }
          try {
            const response = await api.post("/criterios/registrar", { nom });
            const data = [
              ...criterios,
              { clv: response.data.clv, nom },
            ] as never[];
            setCriterios(data);
            (e.target as HTMLFormElement).reset();
          } catch (error) {
            console.error("Error al registrar criterio:", error);
            alert(
              "Error al registrar el criterio. Por favor, inténtalo de nuevo."
            );
          }
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del Criterio
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Ingrese el nombre del criterio"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Este nombre será visible para los participantes.
          </p>
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Crear Criterio
        </button>
      </form>

      <div>
        {criterios.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {[...criterios].reverse().map((criterio: any) => (
              <li
                key={criterio.clv}
                className="p-4 flex justify-between items-center bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
              >
                <div>
                  {editingCriterio?.clv === criterio.clv ? (
                    <form
                      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        const formData = new FormData(
                          e.target as HTMLFormElement
                        );
                        const nom = formData.get("nom") as string;
                        if (!nom.trim()) {
                          alert("El nombre del criterio es requerido.");
                          return;
                        }
                        try {
                          await api.put(
                            `/criterios/actualizar/${criterio.clv}`,
                            { nom }
                          );
                          setCriterios(
                            (prev) =>
                              prev.map((c: any) =>
                                c.clv === criterio.clv ? { ...c, nom } : c
                              ) as never[]
                          );
                          setEditingCriterio(null);
                        } catch (error) {
                          console.error("Error al actualizar criterio:", error);
                          alert(
                            "Error al actualizar el criterio. Por favor, inténtalo de nuevo."
                          );
                        }
                      }}
                    >
                      <input
                        type="text"
                        name="nom"
                        defaultValue={criterio.nom}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="mt-2 inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="mt-2 ml-2 inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={() => setEditingCriterio(null)}
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold">{criterio.nom}</h2>
                      <p className="text-sm text-gray-500">
                        Clave: {criterio.clv}
                      </p>
                    </>
                  )}
                </div>
                {!editingCriterio && (
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setEditingCriterio(criterio)}
                    >
                      Editar
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            "¿Estás seguro de que deseas eliminar este criterio?"
                          )
                        ) {
                          return;
                        }
                        try {
                          await api.delete(
                            `/criterios/eliminar/${criterio.clv}`
                          );
                          setCriterios((prev) =>
                            prev.filter((c: any) => c.clv !== criterio.clv)
                          );
                        } catch (error) {
                          console.error("Error al eliminar criterio:", error);
                          alert(
                            "Error al eliminar el criterio. Por favor, inténtalo de nuevo."
                          );
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-center text-gray-500">
            No hay criterios registrados.
          </p>
        )}
      </div>
    </div>
  );
}
