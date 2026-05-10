import { NextResponse } from "next/server";
import { createLocalX402Receipt } from "@/lib/x402";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    resource?: string;
    amountUsdc?: number;
  };

  return NextResponse.json({
    receipt: createLocalX402Receipt(body.resource ?? "/api/analyze", body.amountUsdc ?? 0.001)
  });
}
