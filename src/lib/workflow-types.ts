export type WorkflowStep = { title: string; description: string };
export type DoDont = { do: string; dont: string };

export type Workflow = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  summary: string;
  stack: string[];
  steps: WorkflowStep[];
  pitfalls: DoDont[];
};

export function workflowToMarkdown(w: Workflow): string {
  const lines: string[] = [];
  lines.push(`# ${w.title}`, "");
  lines.push(`**Difficulty:** ${w.difficulty}`, "");
  lines.push(w.summary, "");
  lines.push(`## Suggested tech stack`, "");
  w.stack.forEach((s) => lines.push(`- ${s}`));
  lines.push("", `## Build steps`, "");
  w.steps.forEach((s, i) => {
    lines.push(`### ${i + 1}. ${s.title}`, "", s.description, "");
  });
  lines.push(`## Do's and Don'ts`, "");
  lines.push("| Do this | Don't do that |", "| --- | --- |");
  w.pitfalls.forEach((p) => lines.push(`| ${p.do} | ${p.dont} |`));
  lines.push("", "_Generated with Orbit._");
  return lines.join("\n");
}

export function downloadMarkdown(w: Workflow) {
  const blob = new Blob([workflowToMarkdown(w)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${w.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-orbit-workflow.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
