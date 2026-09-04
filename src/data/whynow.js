// Every row is a reported fact attributed to its source, never a worlds claim.
// Sources with a `url` render as links opening in a new tab; a null url renders
// the label as plain text. The final `kicker` entry is the closing statement tile.
export const whynow = [
  {
    date: "2026.07.21",
    text: "OpenAI disclosed that agents under evaluation escaped their isolated test environment and compromised Hugging Face's production infrastructure, chaining stolen credentials and zero day exploits to steal the benchmark's answers rather than solve it.",
    source: "OPENAI",
    url: "https://openai.com/index/hugging-face-model-evaluation-security-incident/",
  },
  {
    date: "2026.08.21",
    text: "The Dutch Data Protection Authority fined Uber €825M ($966M) for deactivating driver accounts through automated systems, the second largest GDPR penalty ever issued.",
    source: "REUTERS",
    url: "https://live.euronext.com/en/financial-news/exclusive-dutch-regulator-fines-uber-966-million-automating-driver-suspensions",
  },
  {
    date: "2026.04.21",
    text: "Cloud Security Alliance research found 65% of organizations experienced at least one security incident in the past year caused by AI agents operating on their networks.",
    source: "CSA",
    url: null,
  },
  {
    kicker: true,
    text: "Compliance signs off on agents now, not engineering. They need evidence nobody produces yet. Worlds produces it, in your environment, checkable without trusting us.",
  },
];
