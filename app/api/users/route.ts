import { getDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET all users with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const isActive = searchParams.get("is_active")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const sql = getDB()

    let query = "SELECT * FROM users"
    const conditions: string[] = []
    const params: unknown[] = []

    if (email) {
      conditions.push(`email ILIKE $${params.length + 1}`)
      params.push(`%${email}%`)
    }
    if (isActive !== null && isActive !== undefined) {
      conditions.push(`is_active = $${params.length + 1}`)
      params.push(isActive === "true")
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`

    const users = await sql(query, params)

    // Get total count
    let countQuery = "SELECT COUNT(*) as count FROM users"
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ")
    }
    const countResult = await sql(countQuery, params)
    const total = (countResult[0] as any).count

    return NextResponse.json({ users, total, limit, offset })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const { email, oidc_sub, is_active } = await request.json()

    if (!email || !oidc_sub) {
      return NextResponse.json({ error: "Email and oidc_sub are required" }, { status: 400 })
    }

    const sql = getDB()

    // Create user with default quotas and policies
    const userId = await sql("BEGIN TRANSACTION")

    try {
      // Insert user
      const userResult = await sql("INSERT INTO users (email, oidc_sub, is_active) VALUES ($1, $2, $3) RETURNING *", [
        email,
        oidc_sub,
        is_active ?? true,
      ])
      const user = userResult[0]

      // Insert default quotas
      await sql("INSERT INTO quotas (user_id) VALUES ($1)", [(user as any).id])

      // Insert default policies
      await sql("INSERT INTO policies (user_id) VALUES ($1)", [(user as any).id])

      await sql("COMMIT")

      return NextResponse.json(user, { status: 201 })
    } catch (error) {
      await sql("ROLLBACK")
      throw error
    }
  } catch (error: any) {
    console.error("Error creating user:", error)
    if (error.message?.includes("duplicate")) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
