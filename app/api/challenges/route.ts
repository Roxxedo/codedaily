import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const challenges = await prisma.challenge.findMany({
        where: {
            isPublished: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            tags: true,
            languages: true,
        },
    });

    return NextResponse.json(challenges);
}