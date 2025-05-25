import express from 'express'
import cors from 'cors'
import { rutas } from './rutas'

const app = express()

const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//rutas
app.use(rutas)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})