import { PoolConnection } from "mysql2/promise"

export async function log_sis(
  cone: PoolConnection,
  data: {
    usr: string
    acc: string
    ta: string
  }
) {
  return await cone.query(
    "INSERT INTO log_sis (usr, acc,ta,fch) VALUES (?, ?, ?, ?)",
    [
      data.usr,
      data.acc,
      data.ta,
      new Date().toISOString().slice(0, 19).replace("T", " "),
    ]
  )
}
