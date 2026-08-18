import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { tracks } from "@/lib/library";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbit — Build plans for developer side projects" },
      {
        name: "description",
        content:
          "Type an idea or browse curated tracks, and Orbit returns a full step-by-step build plan with a do's and don'ts table you can download.",
      },
      { property: "og:title", content: "Orbit — Build plans for developer side projects" },
      {
        property: "og:description",
        content:
          "One search bar, one complete workflow: framing, setup, build, testing, deployment — plus project-specific pitfalls.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = idea.trim();
    if (value.length < 3) return;
    navigate({ to: "/workflow", search: { idea: value } });
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-20 sm:pt-28">
      <section className="animate-rise text-center">
        <h1 className="text-glow font-display text-6xl font-extrabold tracking-[-0.05em] sm:text-8xl">
          ORBIT
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
          A product by Zaid Kazi
        </p>

        <form onSubmit={submit} className="mx-auto mt-12 w-full max-w-2xl">
          <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-2.5 focus-within:border-primary/60 focus-within:shadow-[0_0_50px_-18px_var(--primary)] sm:px-5 sm:py-3">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Type an idea — an app that plans my week from my calendar…"
              aria-label="Describe your project idea"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
            />
            <button
              type="submit"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
              disabled={idea.trim().length < 3}
              aria-label="Generate workflow"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Get a full build plan: framing, setup, core build, testing, deployment.
          </p>
        </form>
      </section>

      <section className="mt-24">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Orbit around other topics</h2>
          <p className="text-sm text-muted-foreground">
            Pick a track, choose a tier, start building tonight.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, i) => (
            <Link
              key={track.slug}
              to="/track/$trackSlug"
              params={{ trackSlug: track.slug }}
              className="glass-panel hover-lift animate-rise group rounded-2xl p-6"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold">{track.name}</h3>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{track.tagline}</p>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-primary">
                {track.topics.length} projects
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
