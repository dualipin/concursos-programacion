import mysql from 'mysql2/promise'

export const bd = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'concurso',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})