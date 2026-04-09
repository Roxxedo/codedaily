import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


function normalizeOutput(value: string) {
    return value.trim().replace(/\r\n/g, "\n");
}

export async function POST(req: Request) {
    const body = await req.json();

    const { challengeSlug, language, source_code } = body;

    const challenge = await prisma.challenge.findUnique({
        where: { slug: challengeSlug, isPublished: true }
    });

    if (!challenge) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    const testCases = await prisma.challengeTestCase.findMany({
        where: { challengeId: challenge.id },
        orderBy: { order: "asc" }
    })

    let passedTests = 0;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        const runnerResponse = await fetch(`${process.env.RUNNER_URL}/executions/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language,
                source_code,
                stdin: testCase.input
            })
        })

        const result = await runnerResponse.json();

        const actual = normalizeOutput(result.stdout ?? "");
        const expected = normalizeOutput(testCase.expectedOutput);

        const passed = 
            result.exit_code === 0 &&
            !result.stderr &&
            actual === expected;

        if (!passed) {
            return NextResponse.json({
                success: false,
                passed: false,
                failedAt: i + 1,
                totalTests: testCases.length,

                expectedOutput: expected,
                actualOutput: actual,
                stderr: result.stderr ?? null
            })
        }

        passedTests ++
    }

    return NextResponse.json({
        success: true,
        passed: true,
        passedTests,
        totalTests: testCases.length
    })
}