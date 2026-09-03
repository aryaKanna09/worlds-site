// Plain text, founder voice, no dashes, no images.

export const acknowledgeProvisioning = (worldName) => ({
  subject: `Your ${worldName} world`,
  text: `Hey,

You claimed the ${worldName} world. I'm preparing it now and you'll have it shortly.

Meanwhile the demo and the walkthrough work today: npx twinlab demo shows a real agent getting caught in about a minute.

If you tell me one thing your agent does in ${worldName}, I'll make sure the world covers it first.

Arya
worlds, by Sparta`,
});

export const notifyFounderProvisioning = (worldName, email) => ({
  subject: `Claim: ${worldName}`,
  text: `${email} claimed ${worldName}. It is in the build queue at /admin/claims.`,
});

export const inviteEngineer = (inviterEmail, link) => ({
  subject: `${inviterEmail} wants your agent graded`,
  text: `Hey,

${inviterEmail} is looking at worlds for grading what your agents actually do, and asked me to send you the engineering side.

Claim a world and wire an agent in an afternoon: ${link}

Two things are yours: confirm your agent reads the injected env vars, and write your business rules as assertions. Everything else is generated.

Arya
worlds, by Sparta`,
});

export const renewalReminder = (expiresAt) => ({
  subject: "Your worlds key expires soon",
  text: `Hey,

Your key expires on ${expiresAt}. Renewal is one click from the dashboard and takes effect immediately. Runs keep working through the grace period either way.

Arya
worlds, by Sparta`,
});
