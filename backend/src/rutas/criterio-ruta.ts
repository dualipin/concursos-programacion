import { Router } from "express"
import { bd } from "config/bd"

export const criterioRuta = Router()

type Criterio = {
  clv: number
  nom: string
}

criterioRuta.post("/registrar", async (req, res): Promise<any> => {
  const { nom } = req.body
  const nombre = nom.trim()

  if (!nombre) {
    return res
      .status(400)
      .json({ error: "El nombre del criterio es requerido" })
  }

  try {
    const [result]: any = await bd.query(
      "INSERT INTO criterio (nom) VALUES (?)",
      [nombre]
    )

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No se pudo registrar el criterio" })
    }

    res.status(201).json({ clv: result.insertId, nombre })
  } catch (error) {
    console.error("Error al registrar criterio:", error)
    res
      .status(500)
      .json({ error: "Error al registrar criterio", detail: error })
  }
})

criterioRuta.get("/obtener", async (req, res): Promise<any> => {
  try {
    const [result]: any = await bd.query("SELECT * FROM criterio")

    if (result.length === 0) {
      return res.status(404).json({ error: "No se encontraron criterios" })
    }

    const criterios: Criterio[] = result.map((row: any) => ({
      clv: row.clv,
      nom: row.nom,
    }))

    res.status(200).json(criterios)
  } catch (error) {
    console.error("Error al obtener criterios:", error)
    res.status(500).json({ error: "Error al obtener criterios" })
  }
})
criterioRuta.delete("/eliminar/:clv", async (req, res): Promise<any> => {
  const clv = parseInt(req.params.clv, 10)

  if (isNaN(clv)) {
    return res.status(400).json({ error: "Clave inválida" })
  }

  try {
    const [result]: any = await bd.query("DELETE FROM criterio WHERE clv = ?", [
      clv,
    ])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Criterio no encontrado" })
    }

    res.status(200).json({ message: "Criterio eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar criterio:", error)
    res.status(500).json({ error: "Error al eliminar criterio" })
  }
})
criterioRuta.put("/actualizar/:clv", async (req, res): Promise<any> => {
  const clv = parseInt(req.params.clv, 10)
  const { nom } = req.body
  const nombre = nom.trim()

  if (isNaN(clv) || !nombre) {
    return res.status(400).json({ error: "Clave inválida o nombre requerido" })
  }

  try {
    const [result]: any = await bd.query(
      "UPDATE criterio SET nom = ? WHERE clv = ?",
      [nombre, clv]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Criterio no encontrado" })
    }

    res.status(200).json({ clv, nombre })
  } catch (error) {
    console.error("Error al actualizar criterio:", error)
    res
      .status(500)
      .json({ error: "Error al actualizar criterio", detail: error })
  }
})
