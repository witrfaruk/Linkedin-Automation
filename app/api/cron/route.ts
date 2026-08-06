import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ error: "Cron has been moved to GitHub Actions" }, { status: 410 });
}
export async function GET(req: Request) {
  return NextResponse.json({ error: "Cron has been moved to GitHub Actions" }, { status: 410 });
}
