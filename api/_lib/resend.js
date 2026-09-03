import { Resend } from "resend";
import { schema } from "./db.js";
import { eq } from "drizzle-orm";

const FROM = "arya@usesparta.co";

// Records the email in events_outbox, then sends via Resend when configured.
// Without a key the row stays with sent_at null, which is the PENDING state.
export async function sendEmail(db, { kind, to, subject, text }) {
  const [row] = await db
    .insert(schema.eventsOutbox)
    .values({ kind, toEmail: to, payload: { subject } })
    .returning();
  if (!process.env.RESEND_API_KEY) return { queued: true };
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: `Arya at worlds <${FROM}>`, to, subject, text });
    await db
      .update(schema.eventsOutbox)
      .set({ sentAt: new Date() })
      .where(eq(schema.eventsOutbox.id, row.id));
    return { sent: true };
  } catch (err) {
    console.error("resend failed", err);
    return { queued: true };
  }
}

export const FOUNDER_EMAIL = FROM;
