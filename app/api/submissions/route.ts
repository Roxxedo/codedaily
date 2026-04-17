import { loadChallengeMdx } from "@/lib/mdx";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


function normalizeOutput(value: string) {
    return value.trim().replace(/\r\n/g, "\n");
}

export async function POST(req: Request) {
    const { challengeId, language, source_code, mode } = await req.json();;

    const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId, isPublished: true }
    });

    if (!challenge) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    const { frontmatter } = await loadChallengeMdx(challenge.sourcePath);
    const { testCases } = frontmatter

    let passedTests = 0;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        const runnerResponse = await fetch(`${process.env.RUNNER_URL}/run`, {
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
        const expected = normalizeOutput(testCase.output);

        const passed = 
            result.exit_code === 0 &&
            !result.stderr &&
            actual === expected;

        if (!passed) {
            return NextResponse.json({
                success: false,
                passed: false,
                failedAt: i + 1,
                passedTests,
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