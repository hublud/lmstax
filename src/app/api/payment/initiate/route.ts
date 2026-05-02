import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Payment system is currently disabled for maintenance." },
    { status: 503 }
  );
}
