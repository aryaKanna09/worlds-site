import { withErrors } from "../_lib/db.js";

export default withErrors(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (process.env.BILLING_ENABLED === "true") {
    return res.status(501).json({ error: "checkout not built yet", fallback: "https://cal.com/usesparta" });
  }
  res.status(501).json({ error: "billing not enabled", fallback: "https://cal.com/usesparta" });
});
