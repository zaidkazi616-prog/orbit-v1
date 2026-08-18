# Orbit: Your Dev Launchpad

Orbit — Product Brief / Build Prompt

Use this as a starting prompt with any AI coding tool if you ever want to rebuild, extend, or hand off Orbit elsewhere.

Build a web and mobile-optimized application called Orbit.

The problem

Developers who want to build a side project often get stuck before they even start — either they have no idea what to build, or they have an idea but no clear plan. The usual fallback is bouncing between AI chatbots for advice, but that breaks down fast: every new chat gives a differently-structured answer, long conversations lose context or hit token limits, and there's no way to save a plan and come back to the exact same one later.

The solution

Orbit is a one-stop workflow generator for developers. A user either:

Types a project idea into a search bar and receives a complete, structured build plan, or

Browses a built-in library of curated project ideas, organized by subject and difficulty, and picks one.

Either path leads to the same kind of output: a full step-by-step workflow from problem framing through deployment, plus a "do this / don't do that" table of common pitfalls specific to that project — and the whole thing can be downloaded so it's never lost.

Core user flow

Landing page — wordmark "ORBIT", subtext "A product by [name]", a single search bar with placeholder text inviting the user to type an idea, and a subtagline introducing the library ("Orbit around other topics").

Library grid — a set of topic "tracks" (e.g. AI, ML, NLP, IoT, Computer Science, Cyber Security). Clicking a track opens a list of project topics grouped into difficulty tiers: Easy, Medium, Hard.

Topic selection — clicking a specific topic opens its workflow page.

Custom idea path — typing a free-text idea and submitting it generates a workflow the same way, tailored to that idea specifically, via a real AI model (not a fixed template), so the range of topics is effectively unlimited.

Workflow page — shows: the project title, difficulty, suggested tech stack, a numbered sequence of build steps (problem framing → research → environment setup → core build → testing/evaluation → deployment), and a two-column do's/don'ts table of project-specific advice. Includes a download button that exports the workflow as a file the user can keep.

Design direction

Theme: premium, space-themed. Deep dark background, twinkling stars, slowly breathing colored nebula glows, small satellites drifting across the screen. Motion should feel ambient and premium, not busy or distracting.

Typography: a bold, characterful display typeface for headlines that still reads cleanly (avoid anything tacky or overly generic), paired with a clean, highly legible body typeface, plus a monospace face for labels/tags/technical chips.

Palette: dark space background with 2–3 accent colors used for difficulty tiers or highlights (e.g. one cool accent for "easy," one mid-tone accent for "medium," one warm accent for "hard").

Responsiveness: must work equally well on mobile and desktop — this is a hard requirement, not an afterthought.

Technical requirements

Frontend can be a single-file HTML/CSS/JS app or a component-based frontend (React, etc.) — either is acceptable as long as it's fully responsive.

The custom-idea generation must call a real AI model through a backend service (never expose an API key in frontend code). The backend should accept a short idea string and return structured data: a title, a difficulty rating, a suggested tech stack, an ordered list of build steps (each with a title and a specific, actionable description), and a list of do/don't pairs — as JSON, so the frontend can render it consistently.

The library's curated topics can be static/hand-written content bundled with the frontend; only the free-text custom-idea path needs to hit the AI backend live.

Downloaded workflows should export as a plain, readable file (e.g. Markdown) containing the full workflow content.

Tone

Direct, encouraging, and practical — write for someone who's about to start building at midnight and needs a plan, not a lecture. Avoid filler and hype; be specific about what to do at each step.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://orbit-plan-generator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6f9926f3-391a-4f18-abc8-30ba3c8e45a3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
