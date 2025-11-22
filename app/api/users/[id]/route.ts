import { getDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET single user with quotas and policies
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getDB()

    const userResult = await sql("SELECT * FROM users WHERE id = $1", [id])
    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult[0]
    const quotasResult = await sql("SELECT * FROM quotas WHERE user_id = $1", [id])
    const policiesResult = await sql("SELECT * FROM policies WHERE user_id = $1", [id])

    return NextResponse.json({
      user,
      quota: quotasResult[0] || null,
      policy: policiesResult[0] || null,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PATCH update user
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { is_active } = await request.json()

    const sql = getDB()

    const result = await sql("UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *", [is_active, id])

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
