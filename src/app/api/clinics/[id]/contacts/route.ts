import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/clinics/[id]/contacts
 * List all contacts for a clinic
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("clinic_contacts")
    .select("*")
    .eq("clinic_id", id)
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * POST /api/clinics/[id]/contacts
 * Create a new contact for a clinic
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const { name, email, phone } = body

  if (!name && !email && !phone) {
    return NextResponse.json(
      { error: "At least one of name, email, or phone is required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("clinic_contacts")
    .insert({
      clinic_id: id,
      name: name || null,
      email: email || null,
      phone: phone || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

/**
 * PATCH /api/clinics/[id]/contacts
 * Update a clinic contact (pass contact_id in body)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const { contact_id, ...updates } = body

  if (!contact_id) {
    return NextResponse.json(
      { error: "contact_id is required" },
      { status: 400 }
    )
  }

  const allowedFields = ["name", "email", "phone"]
  const updateData: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in updates) {
      updateData[field] = updates[field] || null
    }
  }

  const { data, error } = await supabase
    .from("clinic_contacts")
    .update(updateData)
    .eq("id", contact_id)
    .eq("clinic_id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * DELETE /api/clinics/[id]/contacts
 * Delete a clinic contact (pass contact_id in body)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  let contact_id: string
  try {
    const body = await request.json()
    contact_id = body.contact_id
  } catch {
    return NextResponse.json(
      { error: "contact_id is required in request body" },
      { status: 400 }
    )
  }

  if (!contact_id) {
    return NextResponse.json(
      { error: "contact_id is required" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("clinic_contacts")
    .delete()
    .eq("id", contact_id)
    .eq("clinic_id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
