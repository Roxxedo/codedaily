"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <div className="flex h-130 items-center justify-center bg-[#0b1020] text-sm text-zinc-400">
            Carregando editor...
        </div>
    ),
});

const LANGUAGES = [ "JavaScript", "Python", "Java" ] as const

type LanguageKey = (typeof LANGUAGES)[number];
type ConsoleTone = "default" | "success" | "error";

const STARTER_CODES: Record<LanguageKey, string> = {
    JavaScript: `console.log("Hello World")`,
    Python: `print("Hello World")`,
    Java: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello World")
    }
}`,
};

const FILE_EXTENSION: Record<LanguageKey, string> = {
    JavaScript: "js",
    Python: "py",
    Java: "java",
};

export default function ChallengeEditorClient({
    challengeId,
    initialLanguage = "JavaScript",
}: {
    challengeId: string;
    initialLanguage?: LanguageKey;
}) {
    const [language, setLanguage] = useState<LanguageKey>(initialLanguage);
    const [code, setCode] = useState(STARTER_CODES[initialLanguage]);
    const [consoleTone, setConsoleTone] = useState<ConsoleTone>("default");
    const [consoleStatus, setConsoleStatus] = useState("Pronto");
    const [consoleOutput, setConsoleOutput] = useState(
        "Selecione uma linguagem, escreva sua solução e execute os testes."
    );
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusBadgeClass = useMemo(() => {
        if (consoleTone === "success") {
            return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
        }

        if (consoleTone === "error") {
            return "border-rose-400/30 bg-rose-500/10 text-rose-300";
        }

        return "border-zinc-700 bg-zinc-900 text-zinc-400";
    }, [consoleTone]);

    function handleLanguageChange(value: LanguageKey) {
        setLanguage(value);
        setCode(STARTER_CODES[value]);
        setConsoleTone("default");
        setConsoleStatus("Pronto");
        setConsoleOutput(`Template de ${value} carregado.`);
    }

    async function handleRunTests() {
        try {
            setIsRunning(true);
            setConsoleTone("default");
            setConsoleStatus("Executando");
            setConsoleOutput("Executando testes...");

            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    challengeId,
                    language,
                    source_code: code,
                    mode: "run"
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Erro ao executar testes.")
            }

            setConsoleStatus(result.passed ? "Passou" : "Não passou")
            setConsoleTone(result.success ? "success" : "error")
            if (result.success) {
                setConsoleOutput([
                    "= = = = = Sucesso! = = = = =",
                    `${result.passedTests}/${result.totalTests}`,
                    "= = = = = = = = = = = = = = "
                ].join("\n"))
            } else {
                let firstLine = `= = = = = Caso Teste ${result.failedAt} = = = = =`
                setConsoleOutput([
                    firstLine,
                    `${result.passedTests}/${result.totalTests}`,
                    "",
                    `Saída Esperada: ${result.expectedOutput}`,
                    `Saída Atual: ${result.actualOutput}`,
                    `${"= ".repeat((firstLine.length / 2))}`
                ].join("\n"))
            } 
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erro ao executar testes.";
            setConsoleStatus("Erro");
            setConsoleTone("error");
            setConsoleOutput(message);
        } finally {
            setIsRunning(false);
        }
    }

    async function handleSubmit() {
        try {
            setIsSubmitting(true);
            setConsoleTone("default");
            setConsoleStatus("Enviando");
            setConsoleOutput("Enviando submissão...");

            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    challengeId,
                    language,
                    source_code: code,
                    mode: "submit"
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Erro ao executar testes.")
            }

            setConsoleStatus(result.passed ? "Passou" : "Não passou")
            setConsoleTone(result.success ? "success" : "error")
            if (result.success) {
                setConsoleOutput([
                    "= = = = = Sucesso! = = = = =",
                    `${result.passedTests}/${result.totalTests}`,
                    "= = = = = = = = = = = = = = "
                ].join("\n"))
            } else {
                let firstLine = `= = = = = Caso Teste ${result.failedAt} = = = = =`
                setConsoleOutput([
                    firstLine,
                    `${result.passedTests}/${result.totalTests}`,
                    "",
                    `Saída Esperada: ${result.expectedOutput}`,
                    `Saída Atual: ${result.actualOutput}`,
                    `${"= ".repeat((firstLine.length / 2))}`
                ].join("\n"))
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erro ao enviar submissão.";
            setConsoleStatus("Erro");
            setConsoleTone("error");
            setConsoleOutput(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="border-b border-white/10 bg-zinc-950/90 px-4 py-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                        <h2 className="wrap-break-word text-2xl font-black tracking-tight">
                            Editor de código
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                            Escreva sua solução, execute os testes e envie para validação.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={language}
                            onChange={(event) =>
                                handleLanguageChange(event.target.value as LanguageKey)
                            }
                            className="min-w-42.5 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 outline-none transition focus:border-emerald-400"
                        >
                            {LANGUAGES.map(x => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleRunTests}
                            disabled={isRunning || isSubmitting}
                            className="inline-flex items-center gap-2 rounded-2xl border border-sky-400/30 bg-sky-500/15 px-4 py-2.5 text-sm font-semibold text-sky-300 transition hover:-translate-y-0.5 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <i className="fa-solid fa-play" aria-hidden="true" />
                            {isRunning ? "Executando..." : "Executar testes"}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={isRunning || isSubmitting}
                            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                            {isSubmitting ? "Enviando..." : "Submeter solução"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-rows-[560px_auto]">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020]">
                    <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0f1c] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                        </div>
                        <span className="break-all text-xs uppercase tracking-[0.25em] text-zinc-500">
                            solution.{FILE_EXTENSION[language]}
                        </span>
                    </div>

                    <MonacoEditor
                        height="520px"
                        language={language.toLowerCase()}
                        value={code}
                        onChange={(value) => setCode(value ?? "")}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineHeight: 24,
                            padding: { top: 16 },
                            roundedSelection: true,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 4,
                            wordWrap: "on",
                            glyphMargin: false,
                            folding: true,
                            lineNumbersMinChars: 3,
                        }}
                    />
                </div>

                <div className="grid gap-4">
                    <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="wrap-break-word text-sm font-bold uppercase tracking-widest text-zinc-400">
                                    Console / saída
                                </h3>
                                <p className="mt-1 text-xs text-zinc-500">
                                    stdout, stderr e resumo dos testes
                                </p>
                            </div>
                            <span
                                className={`rounded-full border px-3 py-1 text-xs ${statusBadgeClass}`}
                            >
                                {consoleStatus}
                            </span>
                        </div>

                        <pre className="min-h-40 overflow-x-auto whitespace-pre-wrap wrap-break-word rounded-2xl border border-white/10 bg-zinc-950/80 p-4 font-mono text-sm leading-6 text-zinc-300">
                            {consoleOutput}
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}