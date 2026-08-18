import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { difficultyClass, getTrack, type Difficulty } from "@/lib/library";

export const Route = createFileRoute("/track/$trackSlug")({
  loader: ({ params }) => {
    const track = getTrack(params.trackSlug);
    if (!track) throw notFound();
    return { track };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.track.name ?? "Track";
    const title = `${name} projects — Orbit`;
    const description = loaderData
      ? `${loaderData.track.tagline}. Browse ${name} project ideas by difficulty and open a full build plan.`
      : "Browse project ideas by difficulty on Orbit.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TrackPage,
});

const tiers: Difficulty[] = ["Easy", "Medium", "Hard"];

function TrackPage() {
  const { track } = Route.useLoaderData();

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> Back to Orbit
      </Link>

      <h1 className="mt-8 font-display text-4xl font-extrabold sm:text-5xl">{track.name}</h1>
      <p className="mt-2 text-muted-foreground">{track.tagline}</p>

      <div className="mt-12 space-y-12">
        {tiers.map((tier) => {
          const topics = track.topics.filter((t) => t.difficulty === tier);
          if (!topics.length) return null;
          return (
            <section key={tier}>
              <h2
                className={`inline-flex rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest ${difficultyClass[tier]}`}
              >
                {tier}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    to="/workflow"
                    search={{ idea: topic.title, difficulty: topic.difficulty }}
                    className="glass-panel hover-lift group rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-bold">{topic.title}</h3>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{topic.blurb}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
