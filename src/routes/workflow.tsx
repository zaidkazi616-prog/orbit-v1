import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, FileDown, Loader2, X } from "lucide-react";
import { z } from "zod";
import { generateWorkflow } from "@/lib/workflow.functions";
import { difficultyClass } from "@/lib/library";
import { downloadPdf } from "@/lib/workflow-types";

const searchSchema = z.object({
  idea: z.string().catch(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().catch(undefined),
});

export const Route = createFileRoute("/workflow")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Your build plan — Orbit" },
      {
        name: "description",
        content:
          "A full step-by-step workflow for your project: tech stack, ordered build steps, and project-specific do's and don'ts.",
      },
      { property: "og:title", content: "Your build plan — Orbit" },
      {
        property: "og:description",
        content: "Framing to deployment, plus the mistakes to avoid — downloadable as Markdown.",
      },
    ],
  }),
  component: WorkflowPage,
});

function WorkflowPage() {
  const { idea, difficulty } = Route.useSearch();
  const generate = useServerFn(generateWorkflow);

  const { data, isPending, error, refetch, isFetching } = useQuery({
    queryKey: ["workflow", idea, difficulty],
    enabled: idea.trim().length >= 3,
    staleTime: Infinity,
    retry: false,
    queryFn: () => generate({ data: { idea: idea.trim(), difficultyHint: difficulty } }),
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-24 pt-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> Back to Orbit
      </Link>

      {idea.trim().length < 3 ? (
        <p className="mt-16 text-muted-foreground">
          No idea provided. Head back and type one into the search bar.
        </p>
      ) : isPending || isFetching ? (
        <div className="mt-24 flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="font-display text-xl font-bold">Plotting your orbit…</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Building a step-by-step plan for “{idea}”. This takes a few seconds.
          </p>
        </div>
      ) : error ? (
        <div className="glass-panel mt-16 rounded-2xl p-6">
          <h1 className="font-display text-xl font-bold">Couldn't generate that plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">{(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : data ? (
        <article className="animate-rise mt-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest ${difficultyClass[data.difficulty] ?? difficultyClass.Medium}`}
                >
                  {data.difficulty}
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{data.title}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">{data.summary}</p>
            </div>
            <button
              onClick={() => downloadMarkdown(data)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
            >
              <Download className="size-4" /> Download
            </button>
          </div>

          <section className="mt-10">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Suggested stack
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.stack.map((s) => (
                <span
                  key={s}
                  className="glass-panel rounded-full px-3 py-1.5 font-mono text-xs text-foreground/90"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Build steps</h2>
            <ol className="mt-6 space-y-4">
              {data.steps.map((step, i) => (
                <li key={i} className="glass-panel rounded-2xl p-5 sm:p-6">
                  <div className="flex gap-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-xs text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Do's and don'ts</h2>
            <div className="glass-panel mt-6 overflow-hidden rounded-2xl">
              <div className="grid grid-cols-2 border-b border-border font-mono text-[11px] uppercase tracking-widest">
                <div className="px-4 py-3 text-easy">Do this</div>
                <div className="border-l border-border px-4 py-3 text-hard">Don't do that</div>
              </div>
              {data.pitfalls.map((p, i) => (
                <div key={i} className="grid grid-cols-2 border-b border-border last:border-b-0">
                  <div className="flex gap-2 px-4 py-4 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-easy" />
                    <span>{p.do}</span>
                  </div>
                  <div className="flex gap-2 border-l border-border px-4 py-4 text-sm text-muted-foreground">
                    <X className="mt-0.5 size-4 shrink-0 text-hard" />
                    <span>{p.dont}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>
      ) : null}
    </main>
  );
}
