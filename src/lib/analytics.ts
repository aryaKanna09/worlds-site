// Mockup stub. The instrumented calls stay in place across the site so the
// real analytics can be wired later; for now every call is a no op.
export function initAnalytics(): void {}

export function track(_event: string, _props?: Record<string, unknown>): void {}

export function identify(_id: string, _props?: Record<string, unknown>): void {}
