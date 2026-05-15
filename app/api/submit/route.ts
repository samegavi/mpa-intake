import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import pool from "@/lib/db";

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE ?? "10485760", 10);
// /tmp is the only writable directory on serverless platforms (e.g. Vercel)
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join("/tmp", "uploads");

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function arr(formData: FormData, key: string): string[] {
  return formData.getAll(key).map((v) => String(v).trim()).filter(Boolean);
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = str(formData, "name");
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const email = str(formData, "email");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  }

  const phone = str(formData, "phone");
  if (!phone || !/^\+[0-9\s()\-\.]{6,18}$/.test(phone)) {
    return NextResponse.json({ error: "A valid phone number with country code is required (e.g. +233265427212)" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await client.query("BEGIN");

    const result = await client.query<{ id: string }>(
      `INSERT INTO submissions (
        name, email, phone, role, organisation, geography, legal_status,
        impact_delivered, how_delivers_impact, impact_measurement,
        staff_size, annual_budget, strengths, gaps,
        interested_from_mpa, ideal_deal, what_you_offer, timeline,
        culture_description, junior_culture_description,
        admired_organisation, preventing_work
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,$17,$18,
        $19,$20,
        $21,$22
      ) RETURNING id`,
      [
        name,
        email,
        phone,
        str(formData, "role"),
        str(formData, "organisation"),
        str(formData, "geography"),
        str(formData, "legal_status"),
        str(formData, "impact_delivered"),
        str(formData, "how_delivers_impact"),
        str(formData, "impact_measurement"),
        str(formData, "staff_size"),
        str(formData, "annual_budget"),
        str(formData, "strengths"),
        str(formData, "gaps"),
        arr(formData, "interested_from_mpa"),
        str(formData, "ideal_deal"),
        str(formData, "what_you_offer"),
        str(formData, "timeline"),
        str(formData, "culture_description"),
        str(formData, "junior_culture_description"),
        str(formData, "admired_organisation"),
        str(formData, "preventing_work"),
      ]
    );

    const submissionId = result.rows[0].id;

    // Handle file uploads
    const docFiles = formData.getAll("documents") as File[];
    for (const file of docFiles) {
      if (!(file instanceof File) || file.size === 0) continue;

      if (file.size > MAX_FILE_SIZE) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 10 MB limit` },
          { status: 413 }
        );
      }

      const ext = path.extname(file.name);
      const storedName = `${uuidv4()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, storedName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      await client.query(
        `INSERT INTO documents (submission_id, original_name, stored_name, mime_type, file_size)
         VALUES ($1, $2, $3, $4, $5)`,
        [submissionId, file.name, storedName, file.type, file.size]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: submissionId }, { status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: "Failed to save submission. Please try again." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
