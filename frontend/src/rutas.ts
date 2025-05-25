import { createBrowserRouter } from "react-router";
import App from "./App";
import Inicio from "./paginas/Inicio";
import { lazy } from "react";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Inicio,
            },
            {
                path: 'registro',
                Component: lazy(() => import('./paginas/ParticipanteRegistro')),
            }, {
                path: 'concursos',
                Component: lazy(() => import('./paginas/Concursos')),
            },
        ]
    },
    {
        path: '/jurado',
        Component: App,
        children: [
            {
                index: true,
                Component: lazy(() => import('./paginas/InicioJurado')),
            },
            {
                path: 'concurso',
                children: [
                    {
                        index: true,
                        Component: lazy(() => import('./paginas/ConcursoJurado')),
                    },
                    {
                        path: ':clv',
                        Component: lazy(() => import('./paginas/ConcursoDetalle')),
                    },
                    {
                        path: ':clv/editar',
                        Component: lazy(() => import('./paginas/ConcursoEditar')),
                    }
                ]
            }
        ]
    },
]);

export default router;