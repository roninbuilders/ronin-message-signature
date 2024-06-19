import { NextResponse } from "next/server";

export default async function POST(request: Request) {
  const payload = "signed payload for %address%"
  const token = "token";
  return NextResponse.json({ payload, token });
}