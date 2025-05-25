import { bd } from "@/config/bd";
import { login, registrarUsuario, actualizarUsuario, eliminarUsuario, obtenerUsuarios } from "@/controlador/usuario";
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";

export const usuarioRuta = Router();

// Verifica si el usario está autenticado
usuarioRuta.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { rfc, contrasena } = req.body;

        if (!rfc || !contrasena) {
            res.status(400).json({ error: "RFC y contraseña son requeridos." });
            return;
        }

        const [usuarioRows]: any = await bd.query(
            'SELECT * FROM usuario WHERE rfc = ?',
            [rfc]
        );

        if (!usuarioRows || usuarioRows.length === 0) {
            res.status(401).json({ error: "Usuario no econtrado, verifique." });
            return;
        }

        const usuario = usuarioRows[0];
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contra);

        if (!contrasenaValida) {
            res.status(401).json({ error: "Credenciales inválidas." });
            return;
        }

        const [personaRows]: any = await bd.query(
            'SELECT * FROM persona WHERE rfc = ?',
            [rfc]
        );

        if (!personaRows || personaRows.length === 0) {
            res.status(401).json({ error: "Credenciales inválidas." });
            return;
        }

        const persona = personaRows[0];

        const usuarioCompleto = {
            rfc: usuario.rfc,
            tipo: usuario.tipo,
            nom: persona.nom,
            apdos: persona.apdos,
            fnac: persona.fnac.toISOString().split('T')[0], // Formato "YYYY-MM-DD"
            sex: persona.sex,
            correo: persona.correo,
            tel: persona.tel
        };

        res.json(usuarioCompleto);
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    }
})

// Ruta para registrar un nuevo usuario
usuarioRuta.post("/registro-usuario", registrarUsuario);
usuarioRuta.put("/actualizar-usuario/:id", actualizarUsuario);
usuarioRuta.delete("/eliminar-usuario/:id", eliminarUsuario);
usuarioRuta.get("/obtener-usuarios", obtenerUsuarios);