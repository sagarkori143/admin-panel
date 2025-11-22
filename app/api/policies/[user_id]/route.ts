import { getDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET policies for user
export async function GET(request: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    const { user_id } = await params
    const sql = getDB()

    const result = await sql("SELECT * FROM policies WHERE user_id = $1", [user_id])
    if (result.length === 0) {
      return NextResponse.json({ error: "Policies not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching policies:", error)
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

// PATCH update policies
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    const { user_id } = await params
    const { mcp_whitelist, web_search_enabled, allowed_tools } = await request.json()

    const sql = getDB()

    const updates: string[] = []
    const values: unknown[] = []
    let paramCount = 1

    if (mcp_whitelist !== undefined) {
      updates.push(`mcp_whitelist = $${paramCount}`)
      values.push(JSON.stringify(mcp_whitelist))
      paramCount++
    }
    if (web_search_enabled !== undefined) {
      updates.push(`web_search_enabled = $${paramCount}`)
      values.push(web_search_enabled)
      paramCount++
    }
    if (allowed_tools !== undefined) {
      updates.push(`allowed_tools = $${paramCount}`)
      values.push(JSON.stringify(allowed_tools))
      paramCount++
    }

    values.push(user_id)

    const result = await sql(
      `UPDATE policies SET ${updates.join(", ")} WHERE user_id = $${paramCount} RETURNING *`,
      values,
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Policies not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating policies:", error)
    return NextResponse.json({ error: "Failed to update policies" }, { status: 500 })
  }
}
