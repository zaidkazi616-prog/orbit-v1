export type Difficulty = "Easy" | "Medium" | "Hard";

export type Topic = {
  slug: string;
  title: string;
  difficulty: Difficulty;
  blurb: string;
};

export type Track = {
  slug: string;
  name: string;
  tagline: string;
  topics: Topic[];
};

const t = (title: string, difficulty: Difficulty, blurb: string): Topic => ({
  slug: title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  title,
  difficulty,
  blurb,
});

export const tracks: Track[] = [
  {
    slug: "ai",
    name: "AI",
    tagline: "Agents, assistants and generative tooling",
    topics: [
      t("AI Recipe Generator", "Easy", "Turn a list of leftovers into a cookable recipe."),
      t("PDF Chat Assistant", "Medium", "Ask questions across your own documents."),
      t("Autonomous Research Agent", "Hard", "Multi-step agent that plans, searches and reports."),
      t("AI Meeting Summarizer", "Medium", "Transcript in, decisions and action items out."),
      t("Prompt Playground", "Easy", "Compare model outputs side by side."),
      t("Multi-Agent Code Reviewer", "Hard", "Specialist agents debating a pull request."),
    ],
  },
  {
    slug: "ml",
    name: "Machine Learning",
    tagline: "Models, pipelines and honest evaluation",
    topics: [
      t("House Price Predictor", "Easy", "Classic regression with a deployed inference API."),
      t("Customer Churn Model", "Medium", "Imbalanced classification with real metrics."),
      t("Recommendation Engine", "Hard", "Collaborative filtering that survives cold start."),
      t("Image Classifier Web App", "Medium", "Fine-tune a vision model and ship it."),
      t("Time Series Forecaster", "Hard", "Forecast demand with proper backtesting."),
      t("Handwritten Digit Recognizer", "Easy", "The hello-world of neural networks, done properly."),
    ],
  },
  {
    slug: "nlp",
    name: "NLP",
    tagline: "Language in, structure out",
    topics: [
      t("Sentiment Analysis Dashboard", "Easy", "Score reviews and chart the mood over time."),
      t("Resume Parser", "Medium", "Extract structured fields from messy PDFs."),
      t("Semantic Search Engine", "Medium", "Embeddings plus a vector index over your corpus."),
      t("Multilingual Translator App", "Medium", "Translate with quality checks and glossaries."),
      t("Fake News Detector", "Hard", "Classification where the labels themselves are hard."),
      t("Keyword & Topic Extractor", "Easy", "Summarize a corpus into themes."),
    ],
  },
  {
    slug: "iot",
    name: "IoT",
    tagline: "Sensors, gateways and dashboards",
    topics: [
      t("Smart Home Dashboard", "Medium", "One screen for every sensor in the house."),
      t("Air Quality Monitor", "Easy", "Cheap sensor, live chart, threshold alerts."),
      t("Plant Watering System", "Easy", "Soil moisture triggers a pump and a notification."),
      t("Fleet GPS Tracker", "Hard", "Streaming location data at scale on a live map."),
      t("Predictive Maintenance Rig", "Hard", "Vibration data to failure prediction."),
      t("Smart Door Access Log", "Medium", "RFID entry with an audited history."),
    ],
  },
  {
    slug: "cs",
    name: "Computer Science",
    tagline: "Fundamentals you can actually show off",
    topics: [
      t("Build Your Own Shell", "Medium", "Parsing, pipes, processes and signals."),
      t("Toy Programming Language", "Hard", "Lexer, parser, interpreter, REPL."),
      t("Distributed Key-Value Store", "Hard", "Replication, consensus and failure handling."),
      t("URL Shortener", "Easy", "Hashing, collisions, redirects and analytics."),
      t("Algorithm Visualizer", "Easy", "Animate sorting and pathfinding step by step."),
      t("Mini Git Implementation", "Medium", "Content-addressed storage and commit graphs."),
    ],
  },
  {
    slug: "security",
    name: "Cyber Security",
    tagline: "Break it, then defend it — ethically",
    topics: [
      t("Password Strength Auditor", "Easy", "Entropy scoring plus breach-list checks."),
      t("Port Scanner", "Easy", "Async scanning with sane rate limits."),
      t("Phishing URL Detector", "Medium", "Feature engineering on suspicious links."),
      t("Vulnerable Lab App", "Medium", "Deliberately broken app plus a fix guide."),
      t("Network Intrusion Detector", "Hard", "Traffic capture, anomaly detection, alerting."),
      t("End-to-End Encrypted Chat", "Hard", "Key exchange, forward secrecy, no plaintext server."),
    ],
  },
];

export const getTrack = (slug: string) => tracks.find((tr) => tr.slug === slug);

export const findTopic = (slug: string) => {
  for (const track of tracks) {
    const topic = track.topics.find((tp) => tp.slug === slug);
    if (topic) return { track, topic };
  }
  return null;
};

export const difficultyClass: Record<Difficulty, string> = {
  Easy: "text-easy border-easy/40 bg-easy/10",
  Medium: "text-medium border-medium/40 bg-medium/10",
  Hard: "text-hard border-hard/40 bg-hard/10",
};
