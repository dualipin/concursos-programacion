import { Request, Response, Router } from "express";
import { parseDate, parseDateTime } from "@/util/parseDate";
import { bd } from "@/config/bd";
import { log_sis } from "@/util/log_sis";

// Ruta para manejar los concursos
export const concursoRuta = Router();

// Creacion de un nuevo concurso
concursoRuta.post("/registrar/:registro", async (req: Request, res: Response): Promise<any> => {
    const { clv, nom, dsc, fcre, ffin, fins, lugar, rq, maxpar, criterios } = req.body;

    if (!clv || !nom || !fcre || !ffin || !fins || !lugar || maxpar === undefined || maxpar === null) {
        return res.status(400).json({ error: "Campos requeridos" });
    }

    const fcreFormatted = parseDate(fcre);
    const ffinFormatted = parseDate(ffin);
    const finsFormatted = parseDate(fins);

    if (!fcreFormatted || !ffinFormatted || !finsFormatted) {
        return res.status(400).json({ error: "Formato de fecha invalido" });
    }

    // Validar que fcre <= fins <= ffin
    if (fcreFormatted > finsFormatted || finsFormatted > ffinFormatted) {
        return res.status(400).json({ error: "Las fechas deben cumplir: fecha creacion <= fecha maxima de inscripcion <= fecha del concurso" });
    }

    // Validar maxpar (por ejemplo, debe ser un entero positivo)
    if (typeof maxpar !== "number" || maxpar <= 0 || !Number.isInteger(maxpar)) {
        return res.status(400).json({ error: "El campo maximos participantes debe ser un entero positivo" });
    }

    const conn = await bd.getConnection();
    try {
        await conn.beginTransaction();

        // Insert concurso
        const concursoQuery = `
            INSERT INTO concurso (clv, nom, dsc, fini, ffin, fmin, rq, lugar, maxpar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await conn.query(concursoQuery, [clv, nom, dsc, fcreFormatted, ffinFormatted, finsFormatted, rq, lugar, maxpar]);

        // Insert criterios if provided and is an array
        if (Array.isArray(criterios)) {
            const criterioQuery = `
                INSERT INTO criterio (nom, valor, clvcon)
                VALUES (?, ?, ?)
            `;
            for (const criterio of criterios) {
                const { nombre, valor } = criterio;
                if (!nombre || !valor) {
                    await conn.rollback();
                    return res.status(400).json({ error: "Formato de criterio invalido" });
                }
                await conn.query(criterioQuery, [nombre, valor, clv]);
            }
        }

        log_sis(conn, {
            usr: req.params.registro || "sistema",
            acc: "Registro de concurso " + clv,
            ta: "concurso"
        });

        await conn.commit();
        res.status(201).json({ message: `Concurso ${nom} fue creado` });

    } catch (error) {
        await conn.rollback();
        res.status(500).json({ error: "Error al crear el concurso", details: error });
    } finally {
        conn.release();
    }
});

// Obtener todos los concursos
concursoRuta.get("/obtener", async (_req: Request, res: Response): Promise<any> => {
    try {
        const query = `SELECT * FROM concurso;`;
        const [rows] = await bd.query(query) as any;

        const [rowsCriterios] = await bd.query(`SELECT * FROM criterio;`) as any;
        const criteriosMap = new Map<string, any[]>();
        if (Array.isArray(rowsCriterios)) {
            for (const criterio of rowsCriterios) {
                if (!criteriosMap.has(criterio.clvcon)) {
                    criteriosMap.set(criterio.clvcon, []);
                }
                criteriosMap.get(criterio.clvcon)?.push({
                    clv: criterio.clv,
                    clvcon: criterio.clvcon,
                    nombre: criterio.nombre,
                    valor: criterio.valor,
                });
            }
        }
        for (const row of rows) {
            if (criteriosMap.has(row.clv)) {
                row.criterios = criteriosMap.get(row.clv);
            }

            if (row.fini) row.fini = parseDateTime(row.fini);
            if (row.ffin) row.ffin = parseDateTime(row.ffin);
            if (row.fmin) row.fmin = parseDateTime(row.fmin);

        }

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener los concursos registrados", details: error });
    }
});

// Obtener un concurso por clave
concursoRuta.get("/obtener/:clv", async (req: Request, res: Response): Promise<any> => {
    const { clv } = req.params;

    try {
        const query = `SELECT * FROM concurso WHERE clv = ?;`;
        const [rows]: any = await bd.query(query, [clv]);
        const [rowsCriterios]: any = await bd.query(`SELECT * FROM criterio WHERE clvcon = ?;`, [clv]);
        const criteriosMap = new Map<string, any[]>();
        if (Array.isArray(rowsCriterios)) {
            for (const criterio of rowsCriterios) {
                if (!criteriosMap.has(criterio.clvcon)) {
                    criteriosMap.set(criterio.clvcon, []);
                }
                criteriosMap.get(criterio.clvcon)?.push({
                    clv: criterio.clv,
                    clvcon: criterio.clvcon,
                    nombre: criterio.nom,
                    valor: criterio.valor,
                });
            }
        }
        for (const row of rows) {
            if (criteriosMap.has(row.clv)) {
                row.criterios = criteriosMap.get(row.clv);
            }

            if (row.fini) row.fini = parseDateTime(row.fini);
            if (row.ffin) row.ffin = parseDateTime(row.ffin);
            if (row.fmin) row.fmin = parseDateTime(row.fmin);
        }

        if (Array.isArray(rows) && rows.length === 0) {
            return res.status(404).json({ error: "Concurso no encontrado" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el concurso", details: error });
    }
});

// Actualizar un concurso
concursoRuta.put("/actualizar/:clv/:actualizo", async (req: Request, res: Response): Promise<any> => {
    const { clv, actualizo } = req.params;
    const { nom, dsc, fcre, ffin, fins, lugar, rq, maxpar, criterios } = req.body;

    const fcreFormatted = fcre ? parseDate(fcre) : null;
    const ffinFormatted = ffin ? parseDate(ffin) : null;
    const finsFormatted = fins ? parseDate(fins) : null;

    const conn = await bd.getConnection();
    try {
        await conn.beginTransaction();

        // Actualizar concurso
        const query = `
            UPDATE concurso
            SET nom = ?, dsc = ?, fcre = ?, ffin = ?, fins = ?, rq =  ?, lugar = ?, maxpar = ?
            WHERE clv = ?;
        `;
        const [result]: any = await conn.query(query, [
            nom, dsc, fcreFormatted, ffinFormatted, finsFormatted, rq, lugar, maxpar, clv
        ]);

        if (result?.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Concurso no encontrado y actualizado" });
        }

        // Actualizar criterios si se proporcionan
        if (Array.isArray(criterios)) {
            // Eliminar criterios existentes
            await conn.query(`DELETE FROM criterio WHERE clvcon = ?`, [clv]);
            // Insertar nuevos criterios
            const criterioQuery = `
                INSERT INTO criterio (nombre, valor, clvcon)
                VALUES (?, ?, ?)
            `;
            for (const criterio of criterios) {
                const { nombre, valor } = criterio;
                if (!nombre || !valor) {
                    await conn.rollback();
                    return res.status(400).json({ error: "Formato de criterio invalido" });
                }
                await conn.query(criterioQuery, [nombre, valor, clv]);
            }
        }

        log_sis(conn, {
            usr: actualizo || "sistema",
            acc: "Actualizacion de concurso " + clv,
            ta: "concurso"
        });

        await conn.commit();
        res.status(200).json({ message: "Concurso y criterios actualizados" });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ error: "Error al intentar actualizar el concurso", details: error });
    } finally {
        conn.release();
    }
});

// Eliminar un concurso
concursoRuta.delete("/eliminar/:clv", async (req: Request, res: Response): Promise<any> => {
    const { clv } = req.params;
    const conn = await bd.getConnection();

    try {
        await conn.beginTransaction();

        // Eliminar criterios asociados al concurso
        await conn.query(`DELETE FROM criterio WHERE clvcon = ?;`, [clv]);

        // Eliminar el concurso
        const [result]: any = await conn.query(`DELETE FROM concurso WHERE clv = ?;`, [clv]);

        if (result?.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Concurso no encontrado" });
        }

        await conn.commit();
        res.status(200).json({ message: "Concurso y criterios eliminados" });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ error: "Error al intentar eliminar el concurso", details: error });
    } finally {
        conn.release();
    }
});

// Listado de participantes inscritos a un concurso
concursoRuta.get('/obtener/:clv/participantes', async (req: Request, res: Response): Promise<any> => {
    const { clv } = req.params;

    try {
        const query = `SELECT * FROM rol_concurso WHERE clvcon = ? and tipo='participante';`;
        const [rows] = await bd.query(query, [clv]) as any;

        if (Array.isArray(rows) && rows.length === 0) {
            return res.status(404).json({ error: "Participantes no encontrados" });
        }

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los participantes", details: error });
    }
});

concursoRuta.get('/obtener/:clv/jurados', async (req: Request, res: Response): Promise<any> => {
    const { clv } = req.params;
    try {
        const query = `SELECT * FROM rol_concurso WHERE clvcon = ? and tipo='jurado';`;
        const [rows] = await bd.query(query, [clv]) as any;

        if (Array.isArray(rows) && rows.length === 0) {
            return res.status(404).json({ error: "Jurados no encontrados" });
        }

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los jurados", details: error });
    }
});

// Inscribir a un participante en un concurso
concursoRuta.get('/registrar/:clv/:tipo/:rfc', async (req: Request, res: Response): Promise<any> => {
    const { clv, tipo, rfc } = req.params;

    if (!rfc || !tipo) {
        return res.status(400).json({ error: "RFC y tipo son requeridos" });
    }

    try {
        const query = `INSERT INTO rol_concurso (rfc, clvcon, tipo) VALUES (?, ?, ?);`;
        await bd.query(query, [rfc, clv, tipo]);

        res.status(201).json({ message: "Participante inscrito exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al inscribir al participante", details: error });
    }
});

// Desinscribir a un participante de un concurso
concursoRuta.delete('/desinscribir/:clv/:rfc', async (req: Request, res: Response): Promise<any> => {
    const { clv, rfc } = req.params;

    try {
        const query = `DELETE FROM rol_concurso WHERE rfc = ? AND clvcon = ?;`;
        await bd.query(query, [rfc, clv]);

        res.status(200).json({ message: "Participante desinscrito exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al desinscribir al participante", details: error });
    }
}); 