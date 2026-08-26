export type WorkflowStep = { title: string; description: string; substeps: string[] };
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
    if (s.substeps?.length) {
      s.substeps.forEach((sub) => lines.push(`- [ ] ${sub}`));
      lines.push("");
    }
  });
  lines.push(`## Do's and Don'ts`, "");
  lines.push("| Do this | Don't do that |", "| --- | --- |");
  w.pitfalls.forEach((p) => lines.push(`| ${p.do} | ${p.dont} |`));
  lines.push("", "_Generated with Orbit._");
  return lines.join("\n");
}

function slug(w: Workflow) {
  return w.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function downloadMarkdown(w: Workflow) {
  const blob = new Blob([workflowToMarkdown(w)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(w)}-orbit-workflow.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function downloadPdf(w: Workflow) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const M = 48;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const CW = W - M * 2;
  let y = M;

  const ensure = (h: number) => {
    if (y + h > H - M) {
      doc.addPage();
      y = M;
    }
  };

  const text = (
    str: string,
    opts: { size?: number; style?: "normal" | "bold" | "italic"; color?: [number, number, number]; indent?: number; gap?: number } = {},
  ) => {
    const size = opts.size ?? 10.5;
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(size);
    const c = opts.color ?? [30, 30, 34];
    doc.setTextColor(c[0], c[1], c[2]);
    const indent = opts.indent ?? 0;
    const lines = doc.splitTextToSize(str, CW - indent) as string[];
    const lh = size * 1.35;
    lines.forEach((ln) => {
      ensure(lh);
      doc.text(ln, M + indent, y + size);
      y += lh;
    });
    y += opts.gap ?? 0;
  };

  const rule = () => {
    ensure(12);
    doc.setDrawColor(220);
    doc.setLineWidth(0.7);
    doc.line(M, y + 4, W - M, y + 4);
    y += 14;
  };

  // Header
  text(w.title, { size: 22, style: "bold", gap: 6 });

  const diffColor: Record<string, [number, number, number]> = {
    Easy: [22, 128, 96],
    Medium: [180, 120, 20],
    Hard: [190, 55, 55],
  };
  const dc = diffColor[w.difficulty] ?? diffColor.Medium;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const label = w.difficulty.toUpperCase();
  const bw = doc.getTextWidth(label) + 16;
  ensure(20);
  doc.setDrawColor(dc[0], dc[1], dc[2]);
  doc.setFillColor(dc[0], dc[1], dc[2]);
  doc.roundedRect(M, y, bw, 16, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(label, M + 8, y + 11);
  y += 28;

  text(w.summary, { color: [80, 80, 88], gap: 8 });
  rule();

  text("SUGGESTED STACK", { size: 9, style: "bold", color: [110, 110, 120], gap: 4 });
  text(w.stack.join("  •  "), { gap: 12 });
  rule();

  text("BUILD STEPS", { size: 9, style: "bold", color: [110, 110, 120], gap: 8 });
  w.steps.forEach((s, i) => {
    ensure(50);
    text(`${String(i + 1).padStart(2, "0")}.  ${s.title}`, { size: 13, style: "bold", gap: 2 });
    text(s.description, { color: [70, 70, 78], gap: 4 });
    (s.substeps ?? []).forEach((sub) => {
      text(`•  ${sub}`, { size: 10, indent: 14, color: [45, 45, 52] });
    });
    y += 12;
  });

  rule();
  text("DO'S AND DON'TS", { size: 9, style: "bold", color: [110, 110, 120], gap: 8 });

  const colW = CW / 2;
  ensure(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(22, 128, 96);
  doc.text("DO THIS", M + 6, y + 10);
  doc.setTextColor(190, 55, 55);
  doc.text("DON'T DO THAT", M + colW + 6, y + 10);
  y += 18;
  doc.setDrawColor(220);
  doc.line(M, y, W - M, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  w.pitfalls.forEach((p) => {
    const a = doc.splitTextToSize(p.do, colW - 14) as string[];
    const b = doc.splitTextToSize(p.dont, colW - 14) as string[];
    const h = Math.max(a.length, b.length) * 13 + 10;
    ensure(h);
    doc.setTextColor(40, 40, 46);
    doc.text(a, M + 6, y + 9);
    doc.setTextColor(90, 90, 98);
    doc.text(b, M + colW + 6, y + 9);
    y += h;
    doc.setDrawColor(235);
    doc.line(M, y - 4, W - M, y - 4);
  });

  y += 12;
  text("Generated with Orbit.", { size: 8.5, style: "italic", color: [150, 150, 158] });

  doc.save(`${slug(w)}-orbit-workflow.pdf`);
}
