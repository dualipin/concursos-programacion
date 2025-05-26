import { Router } from "express";

import { usuarioRuta } from "./usuario-ruta";
import { concursoRuta } from "./concurso-ruta";
import { calificacionRuta } from "./calificacion-ruta";

export const rutas = Router();

rutas.use('/usuarios', usuarioRuta);
rutas.use('/concursos', concursoRuta);
rutas.use('/calificaciones', calificacionRuta);