import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        "challenges": "/api/challenges",
        "challenge": "/api/challenges/[slug]",
        "submission": "/api/submissions"
    })
}