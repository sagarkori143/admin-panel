import { getDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET audit logs with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get("user_id")
    const status = searchParams.get("status")
    const action = searchParams.get("action")
    const from_date = searchParams.get("from_date")
    const to_date = searchParams.get("to_date")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const sql = getDB()

    let query = "SELECT * FROM audit_logs"
    const conditions: string[] = []
    const params: unknown[] = []

    if (user_id) {
      conditions.push(`user_id = $${params.length + 1}`)
      params.push(user_id)
    }
    if (status) {
      conditions.push(`status = $${params.length + 1}`)
      params.push(status)
    }
    if (action) {
      conditions.push(`action ILIKE $${params.length + 1}`)
      params.push(`%${action}%`)
    }
    if (from_date) {
      conditions.push(`timestamp >= $${params.length + 1}`)
      params.push(from_date)
    }
    if (to_date) {
      conditions.push(`timestamp <= $${params.length + 1}`)
      params.push(to_date)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += ` ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`

    const logs = await sql(query, params)

    // Get total count
    let countQuery = "SELECT COUNT(*) as count FROM audit_logs"
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ")
    }
    const countResult = await sql(countQuery, params)
    const total = (countResult[0] as any).count

    return NextResponse.json({ logs, total, limit, offset })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
