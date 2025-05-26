import { Request, Response, Router } from "express";
import { bd } from "@/config/bd";
import bcrypt from "bcrypt";
import { log_sis } from "@/util/log_sis";
import { parseDate, toMySQLDate } from "@/util/parseDate";

export const usuarioRuta = Router();

// Verifica si el usario está autenticado
usuarioRuta.post("/login", async (req, res): Promise<void> => {
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
usuarioRuta.post("/registrar", async (req, res) => {
    const {
        rfc,
        contra,
        tipo,
        nom,
        apds,
        fnac,
        sex,
        correo,
        tel
    } = req.body


    // Validación de campos requeridos
    if (!rfc || !contra || !tipo || !nom || !apds || !fnac || !sex || !correo || !tel) {
        res.status(400).json({ error: "Todos los campos son requeridos." });
        return;
    }

    const nfnac = toMySQLDate(fnac);
    if (!nfnac) {
        res.status(400).json({ error: "Fecha de nacimiento inválida." });
        return;
    }

    const cone = await bd.getConnection();

    try {

        const hashedPassword = await bcrypt.hash(contra, 10);

        if (!cone) {
            res.status(500).json({ error: "Error al conectar a la base de datos." });
            return;
        }

        cone.beginTransaction();

        const [usuarioRows]: any = await cone.query(
            'INSERT INTO usuario (rfc, contra, tipo) VALUES (?, ?, ?)',
            [rfc, hashedPassword, tipo]
        );


        if (!usuarioRows || usuarioRows.length === 0) {
            res.status(500).json({ error: "Error al registrar el usuario." });
            return;
        }

        const [personaRows]: any = await cone.query(
            'INSERT INTO persona (rfc, nom, apds, fnac, sex, correo, tel) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [rfc, nom, apds, nfnac, sex, correo, tel]
        );

        if (!personaRows || personaRows.length === 0) {
            res.status(500).json({ error: "Error al registrar la persona." });
            return;
        }

        log_sis(cone, {
            usr: rfc,
            acc: "Registro de usuario",
            ta: "usuario"
        })


        await cone.commit();
        cone.release();

        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
        await cone.rollback();
        console.error("Error en registro de usuario:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    } finally {
        cone.release();
    }

});


usuarioRuta.put("/actualizar/:rfc", async (req, res) => {
    const { rfc } = req.params;

    const {
        contra,
        tipo,
        nom,
        apds,
        fnac,
        sex,
        correo,
        tel
    } = req.body


    // Validación de campos requeridos
    if (!tipo || !nom || !apds || !fnac || !sex || !correo || !tel) {
        res.status(400).json({ error: "Todos los campos son requeridos." });
        return;
    }

    const cone = await bd.getConnection();


    try {
        const [personaResult]: any = await cone.query(
            'UPDATE persona SET nom = ?, apds = ?, fnac = ?, sex = ?, correo = ?, tel = ? WHERE rfc = ?',
            [nom, apds, fnac, sex, correo, tel, rfc]
        );

        if (personaResult.affectedRows === 0) {
            res.status(404).json({ error: "Persona no encontrada." });
            return;
        }

        if (contra) {
            const hashedPassword = await bcrypt.hash(contra, 10);

            await cone.query(
                'UPDATE usuario SET contra = ? WHERE rfc = ?',
                [hashedPassword, rfc]
            );
        }

        await cone.query(
            'UPDATE usuario SET tipo = ? WHERE rfc = ?',
            [tipo, rfc]
        );


        await log_sis(cone, {
            usr: rfc,
            acc: "Actualización de usuario",
            ta: "usuario"
        });

        res.json({ message: "Usuario actualizado exitosamente." });
    } catch (error) {
        console.error("Error en actualización de usuario:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    } finally {
        cone.release();
    }

});

usuarioRuta.delete("/eliminar/:rfc", async (req, res) => {
    const { rfc } = req.params;
    const cone = await bd.getConnection();

    try {
        cone.beginTransaction();
        const [usuarioRows]: any = await cone.query(
            'DELETE FROM usuario WHERE rfc = ?',
            [rfc]
        );
        if (usuarioRows.affectedRows === 0) {
            res.status(404).json({ error: "Usuario no encontrado." });
            return;
        }
        const [personaRows]: any = await cone.query(
            'DELETE FROM persona WHERE rfc = ?',
            [rfc]
        );

        if (personaRows.affectedRows === 0) {
            res.status(404).json({ error: "Persona no encontrada." });
            return;
        }
        await log_sis(cone, {
            usr: rfc,
            acc: "Eliminación de usuario",
            ta: "usuario"
        });
        await cone.commit();
        res.json({ message: "Usuario eliminado exitosamente." });

    } catch (error) {
        await cone.rollback();
        console.error("Error en eliminación de usuario:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    } finally {
        cone.release();
    }

});

// Ruta para obtener todos los usuarios
usuarioRuta.get("/obtener", async (_req, res) => {
    try {
        const [usuarios]: any = await bd.query(
            'SELECT u.rfc, u.tipo, p.nom, p.apds, p.fnac, p.sex, p.correo, p.tel FROM usuario u JOIN persona p ON u.rfc = p.rfc'
        );
        res.json(usuarios);
    } catch (error) {
        console.error("Error en obtención de usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    }
})

// Ruta para obtener un usuario por RFC
usuarioRuta.get("/obtener/:rfc", async (req, res) => {
    const { rfc } = req.params;

    try {
        const [usuarioRows]: any = await bd.query(
            'SELECT u.rfc, u.tipo, p.nom, p.apds, p.fnac, p.sex, p.correo, p.tel FROM usuario u JOIN persona p ON u.rfc = p.rfc WHERE u.rfc = ?',
            [rfc]
        );
        res.json(usuarioRows);
    } catch (error) {
        console.error("Error en obtención de usuario:", error);
        res.status(500).json({ error: "Error interno del servidor.", details: error });
    }
});
