import { getDB, type Quota } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET quotas for user
export async function GET(request: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    const { user_id } = await params
    const sql = getDB()

    const result = await sql("SELECT * FROM quotas WHERE user_id = $1", [user_id])
    if (result.length === 0) {
      return NextResponse.json({ error: "Quotas not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching quotas:", error)
    return NextResponse.json({ error: "Failed to fetch quotas" }, { status: 500 })
  }
}

// PATCH update quotas
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    const { user_id } = await params
    const { tokens_per_minute, tokens_per_day, requests_per_minute, concurrent_requests } = await request.json()

    // Validate numeric values
    const quota: Partial<Quota> = {}
    if (tokens_per_minute !== undefined) {
      if (tokens_per_minute <= 0) throw new Error("tokens_per_minute must be > 0")
      quota.tokens_per_minute = tokens_per_minute
    }
    if (tokens_per_day !== undefined) {
      if (tokens_per_day <= 0) throw new Error("tokens_per_day must be > 0")
      quota.tokens_per_day = tokens_per_day
    }
    if (requests_per_minute !== undefined) {
      if (requests_per_minute <= 0) throw new Error("requests_per_minute must be > 0")
      quota.requests_per_minute = requests_per_minute
    }
    if (concurrent_requests !== undefined) {
      if (concurrent_requests <= 0) throw new Error("concurrent_requests must be > 0")
      quota.concurrent_requests = concurrent_requests
    }

    const sql = getDB()

    const updates: string[] = []
    const values: unknown[] = []
    let paramCount = 1

    Object.entries(quota).forEach(([key, value]) => {
      updates.push(`${key} = $${paramCount}`)
      values.push(value)
      paramCount++
    })

    values.push(user_id)

    const result = await sql(
      `UPDATE quotas SET ${updates.join(", ")} WHERE user_id = $${paramCount} RETURNING *`,
      values,
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Quotas not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating quotas:", error)
    return NextResponse.json({ error: error.message || "Failed to update quotas" }, { status: 400 })
  }
}
