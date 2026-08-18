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
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: { title: { type: "string" }, description: { type: "string" } },
      },
    },
    pitfalls: {
      type: "array",
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
              "You are Orbit, a build-plan generator for developers starting a side project at midnight. Be direct, encouraging and specific. No hype, no filler. Every step description must be 2-4 sentences of concrete, actionable instruction naming real tools, libraries, files or commands where useful. Produce 6-8 steps covering: problem framing, research/data, environment setup, core build, testing/evaluation, deployment. Produce 5-7 do/don't pairs specific to this exact project, not generic advice.",
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
