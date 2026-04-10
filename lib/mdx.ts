import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path"

export type ChallengeFrontmatter = {
    title: string,
    summary: string,
    difficulty: string,
    tags: string[],
    languages: string[]
    testCases: { input: string, output: string, isPublic: boolean }[]
}

export async function loadChallengeMdx(mdxPath: string) {
    const fullPath = path.join(process.cwd(), "content", mdxPath);
    const raw = await fs.readFile(fullPath, "utf-8");

    const { data, content } = matter(raw);

    return {
        frontmatter: data as ChallengeFrontmatter,
        content
    }
}