import { getDB } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET single audit log detail
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getDB()

    const result = await sql("SELECT * FROM audit_logs WHERE id = $1", [id])
    if (result.length === 0) {
      return NextResponse.json({ error: "Audit log not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching audit log:", error)
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 })
  }
}
