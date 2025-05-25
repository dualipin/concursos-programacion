import { Router } from "express";

import { usuarioRuta } from "./usuario-ruta";
import { concursoRuta } from "./concurso-ruta";

export const rutas = Router();

rutas.use(usuarioRuta);
rutas.use(concursoRuta);
