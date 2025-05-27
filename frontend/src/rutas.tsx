import { createBrowserRouter } from "react-router";
import App from "./App";
import Inicio from "./paginas/Inicio";
import { lazy, Suspense } from "react";
import Protegida from "./compon/Protegida";
import Cargando from "./Cargando";
import Bienvenida from "./paginas/Bienvenida";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Inicio,
  },
  {
    path: "/registro",
    Component: lazy(() => import("./paginas/ParticipanteRegistro")),
  },
  {
    path: "/participante",
    Component: () => (
      <Protegida>
        <Suspense fallback={<Cargando />}>
          <App />
        </Suspense>
      </Protegida>
    ),
    children: [
      {
        index: true,
        Component: lazy(() => import("./paginas/Bienvenida")),
      },
    ],
  },
  {
    path: "/admin",
    Component: () => (
      <Protegida>
        <Suspense fallback={<Cargando />}>
          <App />
        </Suspense>
      </Protegida>
    ),
    children: [
      {
        index: true,
        Component: Bienvenida,
      },
      {
        path: "criterios",
        Component: lazy(() => import("./paginas/admin/Criterios")),
      },
      {
        path: "concursos",
        children: [
          {
            index: true,
            Component: lazy(() => import("./paginas/Concursos")),
          },
          {
            path: "crear",
            Component: lazy(() => import("./paginas/CrearConcurso")),
          },
          {
            path: "editar/:clv",
            Component: lazy(() => import("./paginas/admin/EditarConcurso")),
          },
        ],
      },
      {
        path: "participantes",
        children: [
          {
            index: true,
            Component: lazy(() => import("./paginas/Participantes")),
          },
          {
            path: "crear",
            Component: lazy(() => import("./paginas/ParticipanteRegistro")),
          },
        ],
      },
      {
        path: "jurado",
        children: [
          {
            index: true,
            Component: lazy(() => import("./paginas/admin/Jurado")),
          },
          {
            path: "crear",
            Component: lazy(() => import("./paginas/admin/CrearJurado")),
          },
        ],
      },
    ],
  },
]);

export default router;
