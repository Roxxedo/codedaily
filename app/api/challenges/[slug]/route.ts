import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: { slug: string } }
) {
    const challenge = await prisma.challenge.findUnique({
        where: {
            slug: params.slug,
            isPublished: true,
        },
        include: {
            tags: true,
            languages: true,
        },
    });

    if (!challenge) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(challenge)
}