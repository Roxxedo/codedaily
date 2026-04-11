import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const challenge = await prisma.challenge.findUnique({
        where: {
            slug,
            isPublished: true,
        },
    });

    if (!challenge) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(challenge);
}