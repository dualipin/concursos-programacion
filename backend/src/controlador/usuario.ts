import { Request, Response } from "express";
import { bd } from '@/config/bd'
import bcrypt from 'bcrypt'

export async function login(req: Request, res: Response): Promise<void> {
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
            res.status(401).json({ error: "Credenciales inválidas." });
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
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function registrarUsuario(req: Request, res: Response): Promise<void> {
    try {
        const { rfc, contrasena, tipo, nom, apdos, fnac, sex, correo, tel } = req.body;

        if (!rfc || !contrasena || !tipo || !nom || !apdos || !fnac || !sex || !correo || !tel) {
            res.status(400).json({ error: "Todos los campos son requeridos." });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

        await bd.query(
            'INSERT INTO usuario (rfc, contra, tipo) VALUES (?, ?, ?)',
            [rfc, contrasenaEncriptada, tipo]
        );

        await bd.query(
            'INSERT INTO persona (rfc, nom, apdos, fnac, sex, correo, tel) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [rfc, nom, apdos, fnac, sex, correo, tel]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
        console.error("Error en registrarUsuario:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    }
}

export async function obtenerUsuarios(req: Request, res: Response): Promise<void> {
    try {
        const [rows]: any = await bd.query(
            'SELECT u.rfc, u.tipo, p.nom, p.apdos, p.fnac, p.sex, p.correo, p.tel FROM usuario u JOIN persona p ON u.rfc = p.rfc'
        );

        res.json(rows);
    } catch (error) {
        console.error("Error en obtenerUsuarios:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function actualizarUsuario(req: Request, res: Response): Promise<void> {
    try {
        const { rfc } = req.params;
        const { contrasena, tipo, nom, apdos, fnac, sex, correo, tel } = req.body;

        if (!rfc) {
            res.status(400).json({ error: "RFC es requerido." });
            return;
        }

        if (contrasena) {
            const salt = await bcrypt.genSalt(10);
            const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

            await bd.query(
                'UPDATE usuario SET contra = ? WHERE rfc = ?',
                [contrasenaEncriptada, rfc]
            );
        }

        await bd.query(
            'UPDATE usuario SET tipo = ? WHERE rfc = ?',
            [tipo, rfc]
        );

        await bd.query(
            'UPDATE persona SET nom = ?, apdos = ?, fnac = ?, sex = ?, correo = ?, tel = ? WHERE rfc = ?',
            [nom, apdos, fnac, sex, correo, tel, rfc]
        );

        res.json({ message: "Usuario actualizado exitosamente." });
    } catch (error) {
        console.error("Error en actualizarUsuario:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function eliminarUsuario(req: Request, res: Response): Promise<void> {
    try {
        const { rfc } = req.params;

        if (!rfc) {
            res.status(400).json({ error: "RFC es requerido." });
            return;
        }

        await bd.query('DELETE FROM persona WHERE rfc = ?', [rfc]);
        await bd.query('DELETE FROM usuario WHERE rfc = ?', [rfc]);

        res.json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
        console.error("Error en eliminarUsuario:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}