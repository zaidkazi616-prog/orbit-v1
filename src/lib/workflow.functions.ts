import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Workflow } from "./workflow-types";

const inputSchema = z.object({
  idea: z.string().min(3).max(300),
  difficultyHint: z.enum(["Easy", "Medium", "Hard"]).optional(),
});

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "difficulty", "summary", "stack", "steps", "pitfalls"],
  properties: {
    title: { type: "string" },
    difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
    summary: { type: "string" },
    stack: { type: "array", items: { type: "string" } },
    steps: {
      type: "array",
      minItems: 8,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description", "substeps"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          substeps: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } },
        },
      },
    },
    pitfalls: {
      type: "array",
      minItems: 6,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["do", "dont"],
        properties: { do: { type: "string" }, dont: { type: "string" } },
      },
    },
  },
};

export const generateWorkflow = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<Workflow> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are Orbit, a build-plan generator for developers starting a side project at midnight. Be direct, encouraging and specific. No hype, no filler.\n\nProduce exactly 8-10 steps that cover this full arc, in order: (1) problem framing and scope, (2) research and prior art, (3) environment and project setup, (4) data/input layer, (5-6) core build — split into two steps for Medium/Hard ideas, (7) testing and evaluation, (8) deployment, (9) documentation and polish.\n\nEvery step description must be 4-6 sentences of dense, concrete instruction. Name the actual libraries and versions where it matters, the folder/file structure to create (e.g. src/lib/parser.ts), example shell commands (e.g. `npm create vite@latest`), config values, API endpoints, and the concrete acceptance check that tells the developer the step is done. A reader must be able to execute the step without Googling it first. Do not restate the step title or speak abstractly about 'setting things up'.\n\nProduce 6-8 do/don't pairs. Each pair must reference concrete specifics of THIS exact project idea — its domain, data, models, APIs, or failure modes. Reject anything that could be pasted into an unrelated project's plan.",
          },
          {
            role: "user",
            content: `Project idea: ${data.idea}${data.difficultyHint ? `\nIntended difficulty tier: ${data.difficultyHint}` : ""}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "workflow", strict: true, schema },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
      throw new Error(`Workflow generation failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("The model returned an empty plan. Try rephrasing your idea.");
    return JSON.parse(content) as Workflow;
  });
