import ChallengeEditorClient from "@/app/ChallengeEditorClient";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { loadChallengeMdx } from "@/lib/mdx";
import remarkGfm from "remark-gfm";

export default async function HomePage() {
    const dailyKey = Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date())

    const challenge = await prisma.challenge.findFirst({
        where: {
            dailyKey: dailyKey,
            isPublished: true
        }
    })

    if (!challenge) {
        notFound()
    }

    const { frontmatter, content } = await loadChallengeMdx(challenge.sourcePath);

    return (
        <main className="min-h-screen bg-[#050816] text-zinc-100">
            <div className="mx-auto min-h-screen max-w-400 bg-[#050816] px-4 py-4 md:px-6 lg:px-8">
                <header className="mb-4 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,rgba(24,24,27,0.92),rgba(10,10,20,0.96))] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                    <div className="flex flex-col gap-6 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
                        <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-400">
                                <i className="fa-solid fa-sparkles text-emerald-300" aria-hidden="true" />
                                <span className="wrap-break-word">Daily programming challenge</span>
                            </div>
                            <h1 className="wrap-break-word text-3xl font-black tracking-tight md:text-5xl">CodeDaily</h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
                                Resolva o desafio do dia em um editor profissional, execute os testes e envie sua solução.
                            </p>
                        </div>

                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-2">
                            <MetricCard label="Desafio" value={`#${challenge.id}`} iconClassName="fa-solid fa-code" />
                            <MetricCard label="Dificuldade" value={frontmatter.difficulty} valueClassName="text-amber-300" iconClassName="fa-solid fa-chart-line" />
                        </div>
                    </div>
                </header>

                <div className="grid gap-4 xl:grid-cols-[520px_minmax(0,1fr)]">
                    <aside className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
                        <div className="space-y-5 p-5">
                            <div className="flex flex-wrap gap-2">
                                {frontmatter.tags.map((tag) => (
                                    <Pill key={tag} className="border-emerald-400/30 bg-emerald-500/10 text-emerald-300">{tag}</Pill>
                                ))}
                            </div>

                            <div className="min-w-0">
                                <h2 className="wrap-break-word text-2xl font-black tracking-tight">{frontmatter.title}</h2>
                                <p className="mt-3 wrap-break-word leading-7 text-zinc-300">{frontmatter.summary}</p>
                            </div>

                            <MDXRemote
                                source={content}
                                components={{
                                    InfoBlock: ({ title, children }: { title: string, children: React.ReactNode }) => (
                                        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-4">
                                            <h3 className="mb-3 wrap-break-word text-sm font-bold uppercase tracking-widest text-zinc-400">{title}</h3>
                                            <div className="wrap-break-word text-sm leading-7 text-zinc-300">{children}</div>
                                        </div>
                                    ),
                                    ul: (props) => (
                                        <ul className="list-disc pl-6 space-y-2" {...props} />
                                    ),
                                    ol: (props) => (
                                        <ol className="list-decimal pl-6 space-y-2" {...props} />
                                    ),
                                }}
                                options={{
                                    mdxOptions: {
                                        remarkPlugins: [remarkGfm]
                                    }
                                }}
                            />

                            <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-4">
                                <h3 className="mb-3 wrap-break-word text-sm font-bold uppercase tracking-widest text-zinc-400">Casos de teste públicos</h3>
                                <div className="space-y-3">
                                    {frontmatter.testCases.filter(x => x.isPublic).map((test, index) => (
                                        <div key={`${test.input}-${index}`} className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                                <strong className="text-sm uppercase tracking-widest text-zinc-400">Teste {index + 1}</strong>
                                                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">Público</span>
                                            </div>

                                            <div className="space-y-2 wrap-break-word font-mono text-sm">
                                                <p><span className="text-zinc-500">entrada:</span> <span className="break-all">{test.input}</span></p>
                                                <p><span className="text-zinc-500">esperado:</span> <span className="break-all">{test.output}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <ChallengeEditorClient
                        challengeId={challenge.id}
                        initialLanguage="JavaScript"
                    />
                </div>
            </div>
        </main>
    );
}

function MetricCard({
    label,
    value,
    iconClassName,
    valueClassName = "text-zinc-100",
}: {
    label: string;
    value: string;
    iconClassName: string;
    valueClassName?: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
            <div className="flex items-center justify-between gap-3 text-zinc-500">
                <span className="text-[11px] uppercase tracking-widest">{label}</span>
                <i className={iconClassName} aria-hidden="true" />
            </div>
            <div className={`mt-2 wrap-break-word text-lg font-bold ${valueClassName}`}>{value}</div>
        </div>
    );
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300 ${className}`}>
            {children}
        </span>
    );
}